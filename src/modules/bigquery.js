import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ColumnModes, DbColumns, TABLE_DEFAULT_COLUMN_WIDTH } from '../constants';

export default class BigQuery {
  constructor() {
    this.pageTokenMap = {};
  }

  transformColumns = (queryResults, columnsByName) =>
    _.get(queryResults, 'schema.fields', []).map((field) => ({
      name: field.name,
      dataType: field.type,
      arrayOf: field.mode === ColumnModes.REPEATED,
      allowSort: field.mode !== ColumnModes.REPEATED,
      allowResize: true,
      width: columnsByName[field.name]?.width || TABLE_DEFAULT_COLUMN_WIDTH,
    }));

  transformRows = (queryResults, columns) => {
    const rows = _.get(queryResults, 'rows', []).map((row) =>
      _.get(row, 'f', []).map((value) => _.get(value, 'v', '')),
    );

    return rows.map((row) => this.createData(columns, row));
  };

  createData = (columns, row) => {
    let i = 0;
    const res = {};
    for (i = 0; i < columns.length; i++) {
      const column = columns[i];
      const columnId = column.name;
      const columnType = column.dataType;
      const columnArrayOf = column.arrayOf;

      let value = row[i];
      if (value !== null) {
        // Convert into an array if it's not already one
        if (columnArrayOf) {
          value = value.map((v) => v.v);
        } else {
          value = [value];
        }

        if (columnType === 'INTEGER') {
          value = value.map((v) => this.commaFormatted(v));
        }

        if (columnType === 'FLOAT') {
          value = value.map((v) => this.significantDigits(v));
        }

        if (columnType === 'TIMESTAMP') {
          value = value.map((v) => new Date(v * 1000).toLocaleString());
        }
      }
      if (columnId === DbColumns.ROW_ID) {
        res.datarepo_row_id = value;
      } else {
        res[columnId] = value;
      }
    }

    return res;
  };

  commaFormatted = (amount) => new Intl.NumberFormat('en-US').format(amount);

  significantDigits = (amount) =>
    new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(amount);

  buildSnapshotFilterStatement = (filterMap, dataset) =>
    this.buildFilterStatement(filterMap, dataset);

  buildFilterStatement = (filterMap, dataset) => {
    if (!_.isEmpty(filterMap)) {
      const tableClauses = [];

      _.keys(filterMap).forEach((table) => {
        const filters = filterMap[table];

        if (!_.isEmpty(filters)) {
          const statementClauses = [];

          _.keys(filters).forEach((key) => {
            const datasetName = !dataset ? '' : `${dataset.name}.`;
            const property = `${datasetName}${table}.${key}`;
            const keyValue = filters[key].value;
            const isRange = filters[key].type === 'range';
            const notClause = filters[key].exclude ? 'NOT' : '';

            if (_.isArray(keyValue)) {
              if (isRange) {
                statementClauses.push(`${property} BETWEEN ${keyValue[0]} AND ${keyValue[1]}`);
              } else if (_.isString(keyValue[0])) {
                const selections = keyValue.map((selection) => `"${selection}"`).join(',');
                statementClauses.push(`${property} ${notClause} IN (${selections})`);
              } else {
                statementClauses.push(
                  `${property} = '${keyValue[0]}' OR ${property} = '${keyValue[1]}'`,
                );
              }
            } else if (_.isObject(keyValue)) {
              const checkboxes = _.keys(keyValue);
              if (checkboxes.length > 0) {
                const checkboxValues = [];
                const checkboxClauses = [];
                checkboxes.forEach((checkboxValue) => {
                  if (checkboxValue === 'null') {
                    checkboxClauses.push(`${property} IS ${notClause} NULL`);
                  } else {
                    checkboxValues.push(`"${checkboxValue}"`);
                  }
                });
                if (checkboxValues.length > 0) {
                  checkboxClauses.push(`${property} IN (${checkboxValues.join(',')})`);
                }
                statementClauses.push(`(${checkboxClauses.join(' OR ')})`);
              }
            } else {
              const values = keyValue.split(',').map((val) => `${key}='${val}'`);
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

  getColumnMinMax = (columnName, dataset, tableName, token) => {
    const url = `/bigquery/v2/projects/${dataset.dataProject}/queries`;
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
      .then((response) => response.data.rows[0].f);
  };

  getColumnDistinct = (columnName, dataset, tableName, token, filterStatement, joinStatement) => {
    const url = `/bigquery/v2/projects/${dataset.dataProject}/queries`;
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
      .then((response) => response.data.rows);
  };

  getAutocompleteForColumn = (
    currText,
    columnName,
    dataset,
    tableName,
    token,
    filterStatement,
    joinStatement,
  ) => {
    const url = `/bigquery/v2/projects/${dataset.dataProject}/queries`;
    const filterOrEmpty = _.isEmpty(filterStatement)
      ? `WHERE ${columnName} LIKE '%${currText}%'`
      : `${filterStatement} AND ${columnName} LIKE '%${currText}%'`;
    const query = `SELECT ${columnName} FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${tableName}\` AS ${tableName} ${joinStatement} ${filterOrEmpty} GROUP BY ${tableName}.${columnName} LIMIT 50`;
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
      .then((response) => response.data.rows);
  };

  getAutocompleteForColumnDebounced = AwesomeDebouncePromise(this.getAutocompleteForColumn, 500);

  constructGraph = (schema) => {
    const neighbors = {}; // Key = vertex, value = array of neighbors.

    _.forEach(schema, (relationship) => {
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
      }
      neighbors[v].push(u);
    });

    return neighbors;
  };

  // eslint-disable-next-line consistent-return
  bfs = (graph, source, target) => {
    if (source === target) {
      return [source];
    }
    const queue = [source];
    const visited = { source: true };
    const predecessor = {};
    let tail = 0;

    while (tail < queue.length) {
      let u = queue[tail++]; // Pop a vertex off the queue.
      const neighbors = graph[u];
      for (let i = 0; i < neighbors.length; ++i) {
        const v = neighbors[i];
        if (visited[v]) {
          continue;
        }
        visited[v] = true;
        if (v === target) {
          // Check if the path is complete.
          const path = [v]; // If so, backtrack through the path.
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
    schema.forEach((relationship) => {
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

  // wrapper for query:
  buildJoinStatement = (filterMap, table, dataset) => {
    // Add query back in the name later
    const schema = dataset.schema.relationships;
    const relationships = this.buildAllJoins(filterMap, schema, table);
    let joins = relationships.map((relationship) => {
      const { to, from } = relationship;
      return `JOIN \`${dataset.dataProject}.datarepo_${dataset.name}.${from.table}\` AS ${from.table} ON ${from.table}.${from.column} = ${to.table}.${to.column}`;
    });
    joins = _.uniq(joins);
    return joins.join(' ');
  };

  // wrapper for snapshot creation:
  buildSnapshotJoinStatement = (filterMap, assetName, dataset) => {
    if (_.isEmpty(dataset.schema.assets)) {
      return '';
    }
    const schema = dataset.schema.relationships;
    const selectedAsset = dataset.schema.assets.find((a) => a.name === assetName);
    const { rootTable } = selectedAsset;
    const relationships = this.buildAllJoins(filterMap, schema, rootTable);
    let joins = relationships.map((relationship) => {
      const { to, from } = relationship;
      return `JOIN ${dataset.name}.${from.table} ON ${dataset.name}.${from.table}.${from.column} = ${dataset.name}.${to.table}.${to.column}`;
    });
    joins = _.uniq(joins);
    return `FROM ${dataset.name}.${rootTable} ${joins.join(' ')}`;
  };

  // helper method used by both:
  buildAllJoins = (filterMap, schema, table) => {
    const tables = _.keys(filterMap);
    const graph = this.constructGraph(schema);
    const relationships = [];
    if (!tables.includes(table)) {
      tables.push(table);
    }
    tables.forEach((target) => {
      const path = this.bfs(graph, table, target);
      if (path != null) {
        for (let i = 1; i < path.length; i++) {
          const currTable = path[i];
          const prevTable = path[i - 1];
          const relationship = this.findRelationshipData(schema, currTable, prevTable);
          relationships.push(relationship);
        }
      }
    });
    return relationships;
  };
}
