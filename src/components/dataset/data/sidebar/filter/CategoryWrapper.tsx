import React, { Dispatch, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { CHECKBOX_THRESHOLD, TableColumnType } from 'reducers/query';
import LoadingSpinner from 'components/common/LoadingSpinner';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';
import { getColumnStats, getFilteredColumnStats } from '../../../../../actions';
import { ColumnDataTypeCategory, ResourceType } from '../../../../../constants';

type CategoryWrapperProps = {
  column: TableColumnType;
  dataset: any;
  dispatch: Dispatch<Action>;
  filterMap: any;
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
  toggleExclude,
}: CategoryWrapperProps) {
  // Only runs on first expanding the column
  // Other columns could already be filtered
  useEffect(() => {
    if (column.isExpanded && column.originalValues === undefined) {
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
  }, [dispatch, dataset.id, tableName, column.name, column.isExpanded, column.originalValues]);

  // Run when filter has been updated
  useEffect(() => {
    if (
      column.isExpanded &&
      column.filterHasUpdated &&
      column?.originalValues &&
      column.originalValues.length <= CHECKBOX_THRESHOLD
    ) {
      dispatch(
        getFilteredColumnStats(
          ResourceType.DATASET,
          dataset.id,
          tableName,
          column.name,
          ColumnDataTypeCategory.TEXT,
        ),
      );
    }
  }, [
    dispatch,
    dataset.id,
    tableName,
    column.name,
    column.isExpanded,
    column.filterHasUpdated,
    column.originalValues,
  ]);

  const { originalValues, values, isLoading } = column;
  if (isLoading) {
    return <LoadingSpinner />;
  }
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
  };
}

export default connect(mapStateToProps)(CategoryWrapper);
