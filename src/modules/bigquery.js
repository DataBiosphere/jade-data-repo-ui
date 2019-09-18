import axios from 'axios';
import _ from 'lodash';

export default class BigQuery {
  constructor() {
    this.pageTokenMap = {};
  }

  pageData = (query, queryResults, columns, token) =>
    new Promise(resolve => {
      let rawData = {};
      const data = [];

      const { jobId, projectId } = queryResults.jobReference;

      if (query.tokenToUse === undefined && query.page === 0) {
        this.pageTokenMap[1] = queryResults.pageToken;
      }

      if (this.pageTokenMap[query.page] === undefined && query.page !== 0) {
        this.pageTokenMap[query.page] = query.tokenToUse;
      }

      const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries/${jobId}`;
      const params = {
        maxResults: query.pageSize,
        pageToken: this.pageTokenMap[query.page],
      };

      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params,
        })
        .then(response => {
          rawData = response.data;
          query.tokenToUse = rawData.pageToken;

          const columnNames = columns.map(x => x.title);

          if (rawData.rows && rawData.rows.length > 0) {
            rawData.rows.forEach(rowData => {
              const row = {};

              for (let i = 0; i < rowData.f.length; i++) {
                const item = rowData.f[i].v;
                const currColumn = columnNames[i];

                row[currColumn] = item;
              }

              data.push(row);
            });
          }

          resolve({
            data,
            page: query.page,
            totalCount: parseInt(queryResults.totalRows, 10),
          });
        });
    });

  calculateColumns = queryResults => {
    const columns = [];
    if (
      queryResults.rows !== undefined &&
      queryResults.schema !== undefined &&
      queryResults.schema.fields !== undefined
    ) {
      queryResults.schema.fields.forEach(colData => {
        const col = {
          title: colData.name,
          field: colData.name,
        };

        columns.push(col);
      });
    }
    return columns;
  };

  calculatePageOptions = (queryResults, maxPageSize) => {
    if (queryResults.totalRows !== undefined) {
      const numRows = parseInt(queryResults.totalRows, 10);
      let pageSize = 0;
      if (numRows > maxPageSize) {
        pageSize = maxPageSize;
      } else {
        pageSize = numRows;
      }

      return {
        pageSize,
        pageSizeOptions: [pageSize],
        showFirstLastPageButtons: false,
      };
    }
    return {};
  };

  buildFilterStatement = filterMap => {
    if (!_.isEmpty(filterMap)) {
      let statementClauses = [];
      _.keys(filterMap).forEach(key => {
        if (_.isArray(filterMap[key])) {
          statementClauses.push(`${key} BETWEEN ${filterMap[key][0]} AND ${filterMap[key][1]}`);
        } else {
          statementClauses.push(`${key}='${filterMap[key]}'`);
        }
      });

      return `WHERE ${statementClauses.join(' AND ')}`;
    }
    return '';
  };

  getColumnMinMax = (columnName, dataset, tableName, token) => {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${dataset.dataProject}/queries`;
    const query = `SELECT MIN(${columnName}) AS min, MAX(${columnName}) AS max FROM [${dataset.dataProject}.datarepo_${dataset.name}.${tableName}]`;

    return axios
      .post(
        url,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        return response.data.rows[0].f;
      });
  };
}
