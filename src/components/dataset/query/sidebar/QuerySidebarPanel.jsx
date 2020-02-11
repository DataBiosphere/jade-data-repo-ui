import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { Card, List, ListSubheader, LinearProgress } from '@material-ui/core';
import AppliedFilterList from './AppliedFilterList';

const styles = () => ({
  load: {
    lineHeight: '48px',
    margin: '22px 0px 22px 0px',
  },
});

export class QuerySidebarPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    results: PropTypes.number,
    polling: PropTypes.bool,
    selected: PropTypes.string,
  };

  render() {
    const { classes, filterData, selected, results, polling } = this.props;
    const listTables = _.keys(filterData).map(table => {
      return <AppliedFilterList table={table} selected={selected} />;
    });

    const resultsLabel = results == 1 ? 'Result' : 'Results';

    return (
      <Card>
        <List
          subheader={
            <ListSubheader component="div">
              {polling ? <LinearProgress className={classes.load} /> : `${results} ${resultsLabel}`}
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
    results: state.query.queryResults.totalRows,
    polling: state.query.polling,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QuerySidebarPanel));
