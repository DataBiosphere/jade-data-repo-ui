import axios from 'axios';
import _ from 'lodash';

export default class BigQuery {
  constructor() {
    this.pageTokenMap = {};
  }

  transformColumns = queryResults =>
    _.get(queryResults, 'schema.fields', []).map(field => {
      return { id: field.name, label: field.name, minWidth: 100, type: field.type };
    });

  transformRows = (queryResults, columns) => {
    let rows = _.get(queryResults, 'rows', []).map(row => {
      return _.get(row, 'f', []).map(value => {
        return _.get(value, 'v', '');
      });
    });

    return rows.map(row => this.createData(columns, row));
  };

  createData = (columns, row) => {
    let i = 0;
    const res = {};
    for (i = 0; i < columns.length; i++) {
      const column = columns[i];
      const columnId = column.id;
      const columnType = column.type;

      let value = row[i];

      if (columnType === 'INTEGER') {
        value = this.commaFormatted(value);
      }

      if (columnType === 'FLOAT') {
        value = this.significantDigits(value);
      }

      if (columnId === 'datarepo_row_id') {
        res.datarepo_id = value;
      } else {
        res[columnId] = value;
      }
    }

    return res;
  };

  commaFormatted = amount => new Intl.NumberFormat('en-US').format(amount);

  significantDigits = amount =>
    new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(amount);

  calculateColumns = columns => columns.map(column => ({ title: column.name, field: column.name }));

  buildFilterStatement = filterMap => {
    if (!_.isEmpty(filterMap)) {
      const tableClauses = [];

      _.keys(filterMap).forEach(table => {
        const filters = filterMap[table];

        if (!_.isEmpty(filters)) {
          const statementClauses = [];

          _.keys(filters).forEach(key => {
            const property = `${table}.${key}`;
            const keyValue = filters[key].value;

            if (_.isArray(keyValue)) {
              if (_.isNumber(keyValue[0])) {
                statementClauses.push(`${property} BETWEEN ${keyValue[0]} AND ${keyValue[1]}`);
              } else if (_.isString(keyValue[0])) {
                const selections = keyValue.map(selection => `"${selection}"`).join(',');
                statementClauses.push(`${property} IN (${selections})`);
              } else {
                statementClauses.push(
                  `${property} = '${keyValue[0]}' OR ${property} = '${keyValue[1]}'`,
                );
              }
            } else if (_.isObject(keyValue)) {
              const checkboxes = _.keys(keyValue);
              if (checkboxes.length > 0) {
                const checkboxValues = checkboxes
                  .map(checkboxValue => `"${checkboxValue}"`)
                  .join(',');
                statementClauses.push(`${property} IN (${checkboxValues})`);
              }
            } else {
              const values = keyValue.split(',').map(val => `${key}='${val}'`);
              statementClauses.push(values.join(' OR '));
            }
          });

          if (!_.isEmpty(statementClauses)) {
            tableClauses.push(statementClauses.join(' AND '));
          }
        }
      });

      if (!_.isEmpty(tableClauses)) {
        return `WHERE ${tableClauses.join(' AND ')}`;
      }
    }
    return '';
  };

  buildOrderBy = (property, direction) => (property ? `ORDER BY ${property} ${direction}` : '');

  getColumnMinMax = (columnName, dataset, tableName, token) => {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${dataset.dataProject}/queries`;
    const query = `SELECT MIN(${columnName}) AS min, MAX(${columnName}) AS max FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${tableName}\``;

    return axios
      .post(
        url,
        {
          query,
          useLegacySql: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => response.data.rows[0].f);
  };

  getColumnDistinct = (columnName, dataset, tableName, token, filterStatement, joinStatement) => {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${dataset.dataProject}/queries`;
    const query = `SELECT ${tableName}.${columnName}, COUNT(*) FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${tableName}\` AS ${tableName} ${joinStatement} ${filterStatement} GROUP BY ${tableName}.${columnName}`;
    return axios
      .post(
        url,
        {
          query,
          useLegacySql: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => response.data.rows);
  };

  constructGraph = schema => {
    const neighbors = {}; // Key = vertex, value = array of neighbors.

    _.forEach(schema, relationship => {
      const u = relationship.from.table;
      const v = relationship.to.table;

      if (neighbors[u] === undefined) {
        // Add the edge u -> v.
        neighbors[u] = [];
      }
      neighbors[u].push(v);
      if (neighbors[v] === undefined) {
        // Also add the edge v -> u in order
        neighbors[v] = []; // to implement an undirected graph.
      } // For a directed graph, delete
      neighbors[v].push(u); // these four lines.
    });

    return neighbors;
  };

  bfs = (graph, source, target) => {
    if (source === target) {
      return [source];
    }
    let queue = [source];
    let visited = { source: true };
    let predecessor = {};
    let tail = 0;

    while (tail < queue.length) {
      let u = queue[tail++]; // Pop a vertex off the queue.
      let neighbors = graph[u];
      for (let i = 0; i < neighbors.length; ++i) {
        let v = neighbors[i];
        if (visited[v]) {
          continue;
        }
        visited[v] = true;
        if (v === target) {
          // Check if the path is complete.
          let path = [v]; // If so, backtrack through the path.
          while (u !== source) {
            path.push(u);
            u = predecessor[u];
          }
          path.push(u);
          path.reverse();
          return path;
        }
        predecessor[v] = u;
        queue.push(v);
      }
    }
  };

  findRelationshipData = (schema, source, target) => {
    // eslint-disable-next-line consistent-return
    let result = {};
    schema.forEach(relationship => {
      if (relationship.from.table === source && relationship.to.table === target) {
        result = relationship;
      }

      if (relationship.from.table === target && relationship.to.table === source) {
        result = {
          to: relationship.from,
          from: relationship.to,
          name: relationship.name,
        };
      }
    });
    return result;
  };

  buildJoinStatement = (filterMap, schema, table, dataset) => {
    const tables = _.keys(filterMap);
    const graph = this.constructGraph(schema);
    let joins = [];

    if (!tables.includes(table)) {
      tables.push(table);
    }

    tables.forEach(target => {
      const path = this.bfs(graph, table, target);

      for (let i = 1; i < path.length; i++) {
        const currTable = path[i];
        const prevTable = path[i - 1];
        const relationship = this.findRelationshipData(schema, currTable, prevTable);
        const joinString = `JOIN \`${dataset.dataProject}.datarepo_${dataset.name}.${relationship.from.table}\` AS ${relationship.from.table} ON ${relationship.from.table}.${relationship.from.column} = ${relationship.to.table}.${relationship.to.column}`;
        joins.push(joinString);
      }
    });

    joins = _.uniq(joins);
    return joins.join(' ');
  };
}
