import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
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
  rangeInfo: {
    display: 'inline',
  }
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
    const filterValue = clonedFilter.value;
    if (clonedFilter.type === 'range') {
      delete clonedData[filter];
    } else {
      if (Array.isArray(filterValue)) {
        filterValue.splice(filterValue.indexOf(datum), 1);
      }
      if (_.isPlainObject(filterValue)) {
        delete filterValue[datum];
      }
    }
    dispatch(applyFilters(clonedData));
  };

  render() {
    const { classes, filterData } = this.props;
    const listFilters = _.keys(filterData).map(filter => {
      const data = _.get(filterData, filter);
      let dataString = data.value;
      if (data.type === 'range') {
        dataString = (
        <span>
          <Typography className={classes.rangeInfo}>{_.join(data.value, ' \u2013 ')}</Typography>
          <Button className={classes.rangeInfo} onClick={() => this.clearFilter(filter)}>
            <HighlightOff />
          </Button>
        </span>
        );
      } else {
        if (_.isPlainObject(data.value)) {
          dataString = _.keys(data.value);
        }
        dataString = dataString.map((datum, i) => {
          return (
            <ListItemText key={i}>
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
