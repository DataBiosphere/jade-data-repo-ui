import _ from 'lodash';
import { DatasetModel } from 'generated/tdr';

export const buildfilterStatement = (filterMap: any, dataset: DatasetModel | undefined) => {
  if (!_.isEmpty(filterMap)) {
    const tableClauses: any = [];

    _.keys(filterMap).forEach((table) => {
      const filters = filterMap[table];

      if (!_.isEmpty(filters)) {
        const statementClauses: any = [];

        _.keys(filters).forEach((key) => {
          const datasetName = !dataset ? '' : `${dataset.name}.${table}.`;
          const property = `${datasetName}${key}`;
          const keyValue = filters[key].value;
          const isRange = filters[key].type === 'range';
          const notClause = filters[key].exclude ? 'NOT' : '';

          if (_.isArray(keyValue)) {
            if (isRange) {
              statementClauses.push(`${property} BETWEEN ${keyValue[0]} AND ${keyValue[1]}`);
            } else {
              const keyValueClauses: any[] = [];
              const arrayListValues: any[] = [];
              keyValue.forEach((selection) => {
                if (_.isNil(selection)) {
                  keyValueClauses.push(`${property} IS NULL`);
                } else {
                  arrayListValues.push(`'${selection}'`);
                }});
              if (!_.isEmpty(arrayListValues)) {
                keyValueClauses.push(`${property} ${notClause} IN (${arrayListValues.join(',')})`);
              }
              statementClauses.push(keyValueClauses.join(' OR '));
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
