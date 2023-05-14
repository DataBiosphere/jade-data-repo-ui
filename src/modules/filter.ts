import _ from 'lodash';
import { DatasetModel } from 'generated/tdr';

export const buildTdrApiFilterStatement = (filterMap: any) => {
  if (!_.isEmpty(filterMap)) {
    const tableClauses: any = [];

    _.keys(filterMap).forEach((table) => {
      const filters = filterMap[table];

      if (!_.isEmpty(filters)) {
        const statementClauses: any = [];

        _.keys(filters).forEach((key) => {
          // Note: original code qualitfied this with the dataset name
          const property = `${key}`;
          const keyValue = filters[key].value;
          const isRange = filters[key].type === 'range';
          const notClause = filters[key].exclude ? 'NOT' : '';

          if (_.isArray(keyValue)) {
            if (isRange) {
              statementClauses.push(`${property} BETWEEN ${keyValue[0]} AND ${keyValue[1]}`);
            } else if (_.isString(keyValue[0])) {
              const selections = keyValue.map((selection) => `'${selection}'`).join(',');
              statementClauses.push(`${property} ${notClause} IN (${selections})`);
            } else {
              statementClauses.push(
                `${property} = '${keyValue[0]}' OR ${property} = '${keyValue[1]}'`,
              );
            }
          } else if (_.isObject(keyValue)) {
            const checkboxes = _.keys(keyValue);
            if (checkboxes.length > 0) {
              const checkboxValues: any = [];
              const checkboxClauses = [];
              checkboxes.forEach((checkboxValue) => {
                if (checkboxValue === 'null') {
                  checkboxClauses.push(`${property} IS NULL`);
                } else {
                  checkboxValues.push(`'${checkboxValue}'`);
                }
              });
              if (checkboxValues.length > 0) {
                checkboxClauses.push(`${property} IN (${checkboxValues.join(',')})`);
              }
              statementClauses.push(`(${checkboxClauses.join(' OR ')})`);
            }
          } else {
            const values = keyValue.split(',').map((val: any) => `${key}='${val}'`);
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

export const buildSnapshotFilterStatement = (filterMap: any, dataset: DatasetModel) =>
  buildFilterStatement(filterMap, dataset);

// TODO - this is potentially still used for the actual snapshot create request
// Why is this different from tdrApiFilterStatement?
export const buildFilterStatement = (filterMap: any, dataset: DatasetModel) => {
  if (!_.isEmpty(filterMap)) {
    const tableClauses: any = [];

    _.keys(filterMap).forEach((table) => {
      const filters = filterMap[table];

      if (!_.isEmpty(filters)) {
        const statementClauses: any = [];

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
              const checkboxValues: any = [];
              const checkboxClauses = [];
              checkboxes.forEach((checkboxValue) => {
                if (checkboxValue === 'null') {
                  checkboxClauses.push(`${property} IS NULL`);
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
            const values = keyValue.split(',').map((val: any) => `${key}='${val}'`);
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

const constructGraph = (schema: any) => {
  const neighbors: any = {}; // Key = vertex, value = array of neighbors.

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
const bfs = (graph: any, source: any, target: any) => {
  if (source === target) {
    return [source];
  }
  const queue: any = [source];
  const visited: any = { source: true };
  const predecessor: any = {};
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

const findRelationshipData = (schema: any, source: any, target: any) => {
  // eslint-disable-next-line consistent-return
  let result = {};
  schema.forEach((relationship: any) => {
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
export const buildJoinStatement = (filterMap: any, table: any, dataset: any) => {
  // Add query back in the name later
  const schema = dataset.schema.relationships;
  const relationships = buildAllJoins(filterMap, schema, table);
  let joins = relationships.map((relationship: any) => {
    const { to, from } = relationship;
    return `JOIN \`${dataset.dataProject}.datarepo_${dataset.name}.${from.table}\` AS ${from.table} ON ${from.table}.${from.column} = ${to.table}.${to.column}`;
  });
  joins = _.uniq(joins);
  return joins.join(' ');
};

// wrapper for snapshot creation:
export const buildSnapshotJoinStatement = (filterMap: any, assetName: any, dataset: any) => {
  if (_.isEmpty(dataset.schema.assets)) {
    return '';
  }
  const schema = dataset.schema.relationships;
  const selectedAsset = dataset.schema.assets.find((a: any) => a.name === assetName);
  const { rootTable } = selectedAsset;
  const relationships = buildAllJoins(filterMap, schema, rootTable);
  let joins = relationships.map((relationship: any) => {
    const { to, from } = relationship;
    return `JOIN ${dataset.name}.${from.table} ON ${dataset.name}.${from.table}.${from.column} = ${dataset.name}.${to.table}.${to.column}`;
  });
  joins = _.uniq(joins);
  return `FROM ${dataset.name}.${rootTable} ${joins.join(' ')}`;
};

// helper method used by both:
export const buildAllJoins = (filterMap: any, schema: any, table: any) => {
  const tables = _.keys(filterMap);
  const graph = constructGraph(schema);
  const relationships: any = [];
  if (!tables.includes(table)) {
    tables.push(table);
  }
  tables.forEach((target) => {
    const path = bfs(graph, table, target);
    if (path != null) {
      for (let i = 1; i < path.length; i++) {
        const currTable = path[i];
        const prevTable = path[i - 1];
        const relationship = findRelationshipData(schema, currTable, prevTable);
        relationships.push(relationship);
      }
    }
  });
  return relationships;
};
