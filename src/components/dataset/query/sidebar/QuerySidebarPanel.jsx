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

  clearFilter = (filter, datum) => {
    const { dispatch, filterData } = this.props;
    const clonedData = _.cloneDeep(filterData);
    const clonedFilter = clonedData[filter];
    if (Array.isArray(clonedFilter)) {
      clonedFilter.splice(clonedFilter.indexOf(datum), 1);
    }
    if (_.isPlainObject(clonedFilter)) {
      delete clonedFilter[datum];
    }
    dispatch(applyFilters(clonedData));
  };
  render() {
    const { classes, filterData } = this.props;
    const listFilters = _.keys(filterData).map(filter => {
      const data = _.get(filterData, filter);
      let dataString = data;
      if (Array.isArray(data)) {
        dataString = data.map(datum => {
          return (
            <ListItemText>
              {datum}
              <Button onClick={() => this.clearFilter(filter, datum)}>
                <HighlightOff />
              </Button>
            </ListItemText>);
        });
      }
      if (_.isPlainObject(data)) {
        dataString = _.keys(data).map(datum => {
          return (
            <ListItemText>
              {datum}
              <Button onClick={() => this.clearFilter(filter, datum)}>
                <HighlightOff />
              </Button>
            </ListItemText>);
        });
      }

      return (
        <ListItem dense={true} key={filter}>
          <ListItemText>
            <strong>{filter}:</strong> {dataString}
          </ListItemText>
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
