import axios from 'axios';
import _ from 'lodash';

export default class BigQuery {
  constructor() {
    this.pageTokenMap = {};
  }

  transformColumns = queryResults => {
    return _.get(queryResults, 'schema.fields', []).map(field => {
      return { id: field.name, label: field.name, minWidth: 100, type: field.type };
    });
  };

  transformRows = (queryResults, columns) => {
    let rows = _.get(queryResults, 'rows', []).map(row => {
      return _.get(row, 'f', []).map(value => {
        return _.get(value, 'v', '');
      });
    });

    rows = rows.map(row => {
      return this.createData(columns, row);
    });

    console.log(rows);

    return rows;
  };

  createData = (columns, row) => {
    let i = 0;
    const res = {};
    for (i = 0; i < columns.length; i++) {
      const column = columns[i];
      const columnId = _.get(column, 'id');
      const columnType = _.get(column, 'type');

      let value = row[i];

      if (columnType === 'INTEGER') {
        value = this.commaFormatted(value);
      }

      if (columnType === 'FLOAT') {
        value = this.significantDigits(value);
      }

      if (columnId === 'datarepo_row_id') {
        res.code = value;
      } else {
        res[columnId] = value;
      }
    }

    return res;
  };

  commaFormatted = amount => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  significantDigits = amount =>
    new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(amount);

  calculateColumns = columns => columns.map(column => ({ title: column.name, field: column.name }));

  buildFilterStatement = filterMap => {
    if (!_.isEmpty(filterMap)) {
      const statementClauses = [];
      _.keys(filterMap).forEach(key => {
        if (_.isArray(filterMap[key])) {
          if (_.isNumber(filterMap[key][0])) {
            statementClauses.push(`${key} BETWEEN ${filterMap[key][0]} AND ${filterMap[key][1]}`);
          } else {
            statementClauses.push(
              `${key} = '${filterMap[key][0]}' OR ${key} = '${filterMap[key][1]}'`,
            );
          }
        } else if (_.isObject(filterMap[key])) {
          const checkboxes = _.keys(filterMap[key]);
          if (checkboxes.length > 0) {
            const checkboxValues = checkboxes.map(checkboxValue => `"${checkboxValue}"`).join(',');
            statementClauses.push(`${key} IN (${checkboxValues})`);
          }
        } else {
          const values = filterMap[key].split(',').map(val => `${key}='${val}'`);
          statementClauses.push(values.join(' OR '));
        }
      });

      if (!_.isEmpty(statementClauses)) {
        return `WHERE ${statementClauses.join(' AND ')}`;
      }
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
      .then(response => response.data.rows[0].f);
  };

  getColumnDistinct = (columnName, dataset, tableName, token, filterStatement) => {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${dataset.dataProject}/queries`;
    const query = `SELECT ${columnName}, COUNT(*) FROM [${dataset.dataProject}.datarepo_${dataset.name}.${tableName}] ${filterStatement} GROUP BY ${columnName}`;

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
      .then(response => response.data.rows);
  };
}
