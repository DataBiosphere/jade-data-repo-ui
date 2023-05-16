import React, { Dispatch, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { CHECKBOX_THRESHOLD, TableColumnType } from 'reducers/query';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';
import { getColumnStats } from '../../../../../actions';
import { ColumnDataTypeCategory, ResourceType } from '../../../../../constants';

type CategoryWrapperProps = {
  column: TableColumnType;
  dataset: any;
  dispatch: Dispatch<Action>;
  filterMap: any;
  filterStatement: string;
  handleChange: () => void;
  handleFilters: () => void;
  tableName: string;
  toggleExclude: () => void;
};

function CategoryWrapper({
  column,
  dataset,
  dispatch,
  filterMap,
  handleChange,
  handleFilters,
  tableName,
  filterStatement,
  toggleExclude,
}: CategoryWrapperProps) {
  const refreshColumnStats =
    column.values === undefined ||
    (column?.originalValues && column.originalValues.length <= CHECKBOX_THRESHOLD);
  useEffect(() => {
    // only update for checkbox text columns on filtering
    if (refreshColumnStats) {
      dispatch(
        getColumnStats(
          ResourceType.DATASET,
          dataset.id,
          tableName,
          column.name,
          ColumnDataTypeCategory.TEXT,
        ),
      );
    }
  }, [dispatch, dataset.id, tableName, column.name, filterStatement, refreshColumnStats]);

  const { originalValues, values } = column;
  if (values) {
    if (originalValues && _.size(originalValues) <= CHECKBOX_THRESHOLD) {
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
        values={values}
        table={tableName}
        toggleExclude={toggleExclude}
        tableName={tableName}
      />
    );
  }
  return null;
}

function mapStateToProps(state: any) {
  return {
    dataset: state.datasets.dataset,
    filterStatement: state.query.filterStatement,
  };
}

export default connect(mapStateToProps)(CategoryWrapper);