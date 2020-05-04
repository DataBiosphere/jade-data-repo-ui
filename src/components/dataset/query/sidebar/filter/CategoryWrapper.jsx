import React from 'react';
import _ from 'lodash';
import BigQuery from 'modules/bigquery';
import PropTypes from 'prop-types';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';

const CHECKBOX_THRESHOLD = 10;

export class CategoryWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      originalValues: {},
    };

    const { column, dataset, tableName, token, filterStatement, joinStatement } = this.props;
    const bq = new BigQuery();

    bq.getColumnDistinct(
      column.name,
      dataset,
      tableName,
      token,
      filterStatement,
      joinStatement,
    ).then((response) => {
      const newResponse = this.transformResponse(response);
      this.setState({
        values: newResponse,
        originalValues: newResponse,
      });
    });
  }

  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    filterMap: PropTypes.object,
    filterStatement: PropTypes.string,
    joinStatement: PropTypes.string,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  transformResponse = (response) => {
    const counts = {};
    if (response) {
      response.map((r) => {
        const name = r.f[0].v;
        const count = r.f[1].v;
        counts[name] = count;
      });
    }
    return counts;
  };

  componentDidUpdate(prevProps) {
    const { column, dataset, tableName, token, filterStatement, joinStatement } = this.props;
    if (filterStatement !== prevProps.filterStatement || tableName !== prevProps.tableName) {
      const bq = new BigQuery();
      bq.getColumnDistinct(
        column.name,
        dataset,
        tableName,
        token,
        filterStatement,
        joinStatement,
      ).then((response) => {
        const newResponse = this.transformResponse(response);
        this.setState({
          values: newResponse,
        });
        if (tableName !== prevProps.tableName) {
          this.setState({
            originalValues: newResponse,
          });
        }
      });
    }
  }

  render() {
    const { values, originalValues } = this.state;
    const { column, filterData, handleChange, handleFilters, tableName, filterMap } = this.props;
    if (values && originalValues && _.size(originalValues) <= CHECKBOX_THRESHOLD) {
      return (
        <CategoryFilterGroup
          column={column}
          filterData={filterData}
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
        filterData={filterData}
        filterMap={filterMap}
        originalValues={originalValues}
        values={values}
        table={tableName}
      />
    );
  }
}

export default CategoryWrapper;
