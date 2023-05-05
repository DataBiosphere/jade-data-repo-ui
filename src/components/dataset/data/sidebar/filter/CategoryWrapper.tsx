import React, { Dispatch, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Action } from 'redux';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';
import { getColumnStats } from '../../../../../actions';
import { ColumnDataTypeCategory, ResourceType } from '../../../../../constants';
import { TableColumnType } from 'reducers/query';

const CHECKBOX_THRESHOLD = 30;

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
  toggleExclude,
}: CategoryWrapperProps) {
  
  useEffect(() => {
    dispatch(getColumnStats(ResourceType.DATASET, dataset.id, tableName, column.name, ColumnDataTypeCategory.TEXT));
  }, [dispatch, dataset.id, tableName, column.name]);

  const { values, originalValues } = column;
  if (values && originalValues) {
    if (_.size(originalValues) <= CHECKBOX_THRESHOLD) {
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
