import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HighlightOff from '@material-ui/icons/HighlightOff';
import { applyFilters } from '../../../../actions';

export class QuerySidebarPanel extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
  };

  clearFilter = filter => {
    const { dispatch, filterData } = this.props;
    const clonedData = _.clone(filterData);
    delete clonedData[filter];
    dispatch(applyFilters(clonedData));
  };

  render() {
    const { filterData } = this.props;
    const listFilters = _.keys(filterData).map(filter => {
      let boundFilter = this.clearFilter.bind(this, filter);
      const data = _.get(filterData, filter);
      let dataString = data;
      console.log(data);
      if (Array.isArray(data)) {
        dataString = _.join(data, ', ');
      }
      if (_.isPlainObject(data)) {
        dataString = _.keys(data).join(', ');
      }

      return (
        <li key={filter}>
          {filter} : {dataString}
          <Button onClick={boundFilter}>
            <HighlightOff />
          </Button>
        </li>
      );
    });

    return (
      <Card>
        <Typography>Properties</Typography>
        <ul>{listFilters}</ul>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
  };
}

export default connect(mapStateToProps)(QuerySidebarPanel);
