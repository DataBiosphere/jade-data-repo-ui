import React, { Dispatch, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { CHECKBOX_THRESHOLD, TableColumnType } from 'reducers/query';
import LoadingSpinner from 'components/common/LoadingSpinner';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';
import { getColumnStats } from '../../../../../actions';
import { ColumnStatsRetrievalType, ResourceType } from '../../../../../constants';

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
  useEffect(() => {
    const firstColumnStatsLoad = column.isExpanded && column.originalValues === undefined;
    const filterHasUpdatedForCheckboxFields =
      column.isExpanded &&
      column.filterHasUpdated &&
      column?.originalValues &&
      column.originalValues.length <= CHECKBOX_THRESHOLD;
    let columnStatsRetrievalType = null;
    if (firstColumnStatsLoad && column.filterHasUpdated) {
      columnStatsRetrievalType = ColumnStatsRetrievalType.RETRIEVE_ALL_AND_FILTERED_TEXT;
    } else if (filterHasUpdatedForCheckboxFields) {
      columnStatsRetrievalType = ColumnStatsRetrievalType.RETRIEVE_FILTERED_TEXT;
    } else if (firstColumnStatsLoad) {
      columnStatsRetrievalType = ColumnStatsRetrievalType.RETRIEVE_ALL_TEXT;
    }
    if (columnStatsRetrievalType !== null) {
      dispatch(
        getColumnStats(
          ResourceType.DATASET,
          dataset.id,
          tableName,
          column.name,
          columnStatsRetrievalType,
        ),
      );
    }
  }, [
    dispatch,
    dataset.id,
    tableName,
    column.name,
    column.isExpanded,
    column.originalValues,
    column.filterHasUpdated,
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
        values={originalValues}
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
