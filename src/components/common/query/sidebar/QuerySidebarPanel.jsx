import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { Card, List, ListSubheader, LinearProgress, Button } from '@material-ui/core';
import AppliedFilterList from './AppliedFilterList';
import { applyFilters } from '../../../../actions';

const styles = (theme) => ({
  load: {
    lineHeight: '48px',
    margin: '22px 0px 22px 0px',
  },
  clearButton: {
    float: 'right',
    margin: theme.spacing(1),
    fontSize: '12px',
  },
});

export class QuerySidebarPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    polling: PropTypes.bool,
    results: PropTypes.number,
    selected: PropTypes.string,
  };

  clearAllFilters = () => {
    const { dispatch, dataset, selected } = this.props;
    dispatch(applyFilters({}, selected, dataset, dataset.schema.relationships));
  };

  render() {
    const { classes, filterData, selected, results, polling } = this.props;
    const listTables = _.keys(filterData).map((table, i) => (
      <AppliedFilterList key={`filter-${i}`} table={table} selected={selected} />
    ));

    const rowsLabel = results === 1 ? 'Row' : 'Rows';

    return (
      <Card variant="outlined">
        <List
          subheader={
            <ListSubheader component="div" data-cy="resultsCount">
              {polling ? (
                <LinearProgress className={classes.load} />
              ) : (
                `${results.toLocaleString()} ${rowsLabel}`
              )}
            </ListSubheader>
          }
        >
          {listTables}
        </List>
        {_.keys(filterData).length > 0 && (
          <Button className={classes.clearButton} onClick={this.clearAllFilters}>
            Clear all
          </Button>
        )}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
    dataset: state.datasets.dataset,
    results: state.query.resultsCount,
    polling: state.query.polling,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QuerySidebarPanel));
