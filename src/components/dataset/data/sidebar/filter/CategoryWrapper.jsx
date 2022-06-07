import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import BigQuery from 'modules/bigquery';
import PropTypes from 'prop-types';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';

const CHECKBOX_THRESHOLD = 10;

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
}) {
  const [values, setValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    const bq = new BigQuery();

    if (column.arrayOf) {
      setValues({});
      setOriginalValues({});
    } else {
      bq.getColumnDistinct(
        column.name,
        dataset,
        tableName,
        token,
        filterStatement,
        joinStatement,
      ).then((response) => {
        const newResponse = transformResponse(response);
        setValues(newResponse);
        // TODO - figure out why only setting this when the table is different
        setOriginalValues(newResponse);
      });
    }
  }, [column, dataset, tableName, token, filterStatement, joinStatement]);

  const transformResponse = (response) => {
    const counts = {};
    if (response) {
      // eslint-disable-next-line
      response.map((r) => {
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

CategoryWrapper.propTypes = {
  column: PropTypes.object,
  dataset: PropTypes.object,
  filterMap: PropTypes.object,
  filterStatement: PropTypes.string,
  handleChange: PropTypes.func,
  handleFilters: PropTypes.func,
  joinStatement: PropTypes.string,
  tableName: PropTypes.string,
  toggleExclude: PropTypes.func,
  token: PropTypes.string,
};

export default CategoryWrapper;
