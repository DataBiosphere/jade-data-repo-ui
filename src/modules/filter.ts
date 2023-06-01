import _ from 'lodash';
import { DatasetModel } from 'generated/tdr';

export const buildfilterStatement = (filterMap: any) => {
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

// TODO - this is largely the same as buildfilterStatement
// Will refactor with DR-3025 because will need to add logic for azure filtering/snapshot create
export const buildSnapshotFilterStatement = (filterMap: any, dataset: DatasetModel) => {
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
