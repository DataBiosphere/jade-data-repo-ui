import _ from 'lodash';

/*
We can filter on any table in the dataset, but the query on snapshot create must be built
in relation to the asset's root table.
*/

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
