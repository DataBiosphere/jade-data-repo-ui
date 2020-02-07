import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { applyFilters } from '../../../../actions';
import { Chip } from '@material-ui/core';

const styles = () => ({
  listHeader: {
    paddingTop: '16px',
    paddingBottom: '4px',
    lineHeight: 'inherit',
  },
  rangeInfo: {
    display: 'inline',
  },
  inline: {
    margin: '2px',
  },
});

export class QuerySidebarPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    selected: PropTypes.string,
  };

  clearFilter = (table, filter, datum) => {
    const { dispatch, filterData, dataset, selected } = this.props;
    const { relationships } = dataset.schema;
    const clonedData = _.cloneDeep(filterData);
    const clonedFilter = clonedData[table][filter];
    const filterValue = clonedFilter.value;

    if (clonedFilter.type !== 'range') {
      if (Array.isArray(filterValue)) {
        filterValue.splice(filterValue.indexOf(datum), 1);
      }
      if (_.isPlainObject(filterValue)) {
        delete filterValue[datum];
      }
    }

    if (_.isEmpty(filterValue) || clonedFilter.type === 'range') {
      delete clonedData[table][filter];
    }

    if (_.isEmpty(clonedData[table])) {
      delete clonedData[table];
    }

    dispatch(applyFilters(clonedData, relationships, selected, dataset));
  };

  render() {
    const { classes, filterData } = this.props;
    // emdash used as the long dash in between values
    const emdash = ' \u2013 ';

    const listTables = _.keys(filterData).map(table => {
      const listFilters = _.keys(filterData[table]).map(filter => {
        const data = _.get(filterData[table], filter);
        let dataString = data.value;
        if (data.type === 'range') {
          dataString = (
            <Chip
              onDelete={() => this.clearFilter(table, filter)}
              className={classes.inline}
              label={_.join(data.value, emdash)}
            />
          );
        } else {
          if (_.isPlainObject(data.value)) {
            dataString = _.keys(data.value);
          }
          dataString = dataString.map((datum, i) => (
            <Chip
              key={i}
              onDelete={() => this.clearFilter(table, filter, datum)}
              className={classes.inline}
              label={datum}
            />
          ));
        }

        return (
          <ListItem dense={true} key={filter}>
            <ListItemText>
              <strong>{filter}:</strong> {dataString}
            </ListItemText>
          </ListItem>
        );
      });
      return listFilters;
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
          {listTables}
        </List>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QuerySidebarPanel));
