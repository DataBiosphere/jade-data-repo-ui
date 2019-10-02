import React, { Fragment } from 'react';
import BigQuery from 'modules/bigquery';
import PropTypes from 'prop-types';
import { CategoryFilter } from './CategoryFilter';

export class CategoryFilterGroup extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    handleChange: PropTypes.func,
    values: PropTypes.array,
  };

  render() {
    const { values } = this.props;
    let checkboxes = values.map(value => {
      const name = value.f[0].v;
      const count = value.f[1].v;
      return (
        <Fragment key={name}>
          <CategoryFilter />
        </Fragment>
      );
    });

    return <Fragment>{checkboxes}</Fragment>;
  }
}
