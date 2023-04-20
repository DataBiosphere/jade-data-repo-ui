import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import BigQuery from 'modules/bigquery';
import { DatasetModel, ColumnModel } from 'generated/tdr';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';

const CHECKBOX_THRESHOLD = 30;

type FilterType = any;

type CategoryWrapperType = {
  column: ColumnModel;
  dataset: DatasetModel;
  filterMap: any;
  filterStatement: string;
  handleChange: (column: string, filter: FilterType, table: string) => void;
  handleFilters: () => any;
  joinStatement: string;
  tableName: string;
  toggleExclude: (boxIsChecked: boolean) => void;
  token: string;
};

function CategoryWrapper({
  column,
  dataset,
  filterMap,
  filterStatement,
  handleChange,
  handleFilters,
  joinStatement,
  tableName,
  toggleExclude,
  token,
}: CategoryWrapperType) {
  const [values, setValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  // Update the list of options on component mount and when table changes
  // even if you've filtered from another column, keeps all of the options in list
  useEffect(() => {
    updateValuesList(true);
  }, [tableName]);

  // Update list of selected values
  // We may be able to get rid of this - I think it's tracking the same thing as the filterMap
  useEffect(() => {
    updateValuesList(false);
  }, [column?.array_of, column.name, dataset, filterStatement, joinStatement, token]);

  const updateValuesList = (updateOriginalValues: boolean) => {
    if (column?.array_of) {
      setValues({});
      setOriginalValues({});
    } else {
      const bq_column = new BigQuery();
      bq_column
        .getColumnDistinct(column.name, dataset, tableName, token, filterStatement, joinStatement)
        .then((response) => {
          const newResponse = transformResponse(response);
          setValues(newResponse);
          if (updateOriginalValues) {
            setOriginalValues(newResponse);
          }
        });
    }
  };

  const transformResponse = (response: any) => {
    const counts: any = {};
    if (response) {
      // eslint-disable-next-line
      response.map((r: any) => {
        const name = r.f[0].v;
        const count = r.f[1].v;
        counts[name] = count;
      });
    }
    return counts;
  };

  if (values && originalValues && _.size(originalValues) <= CHECKBOX_THRESHOLD) {
    return (
      <CategoryFilterGroup
        column={column}
        filterMap={filterMap}
        handleChange={handleChange}
        originalValues={originalValues}
        values={values}
        table={tableName}
      />
    );
  }
  return (
    <FreetextFilter
      column={column}
      handleChange={handleChange}
      handleFilters={handleFilters}
      filterMap={filterMap}
      originalValues={originalValues}
      values={values}
      table={tableName}
      toggleExclude={toggleExclude}
      dataset={dataset}
      token={token}
      tableName={tableName}
      filterStatement={filterStatement}
      joinStatement={joinStatement}
    />
  );
}

export default CategoryWrapper;
