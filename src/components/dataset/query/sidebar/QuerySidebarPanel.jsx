import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import HighlightOff from '@material-ui/icons/HighlightOff';
import { applyFilters } from '../../../../actions';

const styles = () => ({
  listHeader: {
    paddingTop: '16px',
    paddingBottom: '4px',
    lineHeight: 'inherit',
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
      const data = _.get(filterData, filter);
      let dataString = data;
      if (Array.isArray(data)) {
        dataString = _.join(data, ', ');
      }
      if (_.isPlainObject(data)) {
        dataString = _.keys(data).join(', ');
      }

      return (
        <ListItem dense={true} key={filter}>
          <ListItemText>
            <strong>{filter}:</strong> {dataString}
          </ListItemText>
          <Button onClick={() => this.clearFilter(filter)}>
            <HighlightOff />
          </Button>
        </ListItem>
      );
    });

    return (
      <Card>
        <List
          subheader={
            <ListSubheader className={classes.listHeader} component="div">
              Properties
            </ListSubheader>
          }
        >
          {listFilters}
        </List>
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
