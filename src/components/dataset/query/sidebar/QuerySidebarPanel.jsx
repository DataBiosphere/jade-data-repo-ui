import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HighlightOff from '@material-ui/icons/HighlightOff';
import { applyFilters } from '../../../../actions';

const styles = theme => ({
  cardPadding: {
    padding: '10px',
  },
  noBullets: {
    listStyleType: 'none',
  },
});

export class QuerySidebarPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
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
    const { classes, filterData } = this.props;
    const listFilters = _.keys(filterData).map(filter => {
      let boundFilter = this.clearFilter.bind(this, filter);
      const data = _.get(filterData, filter);
      let dataString = data;
      if (Array.isArray(data)) {
        dataString = _.join(data, ', ');
      }
      if (_.isPlainObject(data)) {
        dataString = _.keys(data).join(', ');
      }

      return (
        <li key={filter}>
          <strong>{filter}</strong> : {dataString}
          <Button onClick={boundFilter}>
            <HighlightOff />
          </Button>
        </li>
      );
    });

    return (
      <Card className={classes.cardPadding}>
        <Typography>Properties</Typography>
        <ul className={classes.noBullets}>{listFilters}</ul>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QuerySidebarPanel));
