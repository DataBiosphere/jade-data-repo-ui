import React from 'react';
import BigQuery from 'modules/bigquery';
import PropTypes from 'prop-types';
import FreetextFilter from './FreetextFilter';
import CategoryFilterGroup from './CategoryFilterGroup';

export class CategoryWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };

    const { column, dataset, tableName, token, filterStatement } = this.props;
    const bq = new BigQuery();

    bq.getColumnDistinct(column.name, dataset, tableName, token, filterStatement).then(response => {
      this.setState({
        values: response,
      });
    });
  }

  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
    handleChange: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { column, dataset, tableName, token, filterStatement } = this.props;
    if (filterStatement !== prevProps.filterStatement) {
      const bq = new BigQuery();
      bq.getColumnDistinct(column.name, dataset, tableName, token, filterStatement).then(
        response => {
          this.setState({
            values: response,
          });
        },
      );
    }
  }

  render() {
    const { values } = this.state;
    const { column, filterData, handleChange } = this.props;

    if (values && values.length <= 10) {
      return (
        <CategoryFilterGroup
          column={column}
          filterData={filterData}
          handleChange={handleChange}
          values={values}
        />
      );
    }
    return <FreetextFilter column={column} handleChange={handleChange} filterData={filterData} />;
  }
}

export default CategoryWrapper;
