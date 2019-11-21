import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { applyFilters, runQuery } from 'actions/index';
import { Typography } from '@material-ui/core';
import { DB_COLUMNS } from '../../../constants/index';

import QueryViewTable from './QueryViewTable';
import QueryViewSidebar from './sidebar/QueryViewSidebar';
import QueryViewDropdown from './QueryViewDropdown';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  scrollTable: {
    overflowY: 'scroll',
    height: '-webkit-fill-available',
  },
  headerArea: {
    paddingBottom: '3%',
  },
});

const PAGE_SIZE = 100;
const QUERY_LIMIT = 1000;

export class QueryView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      table: null,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterStatement: PropTypes.string,
    queryResults: PropTypes.object,
    token: PropTypes.string,
  };

  componentDidUpdate(prevProps, prevState) {
    const { dataset, dispatch, filterStatement } = this.props;
    const { selected } = this.state;
    if (prevProps.filterStatement !== filterStatement || prevState.selected !== selected) {
      dispatch(
        runQuery(
          dataset.dataProject,
          `#standardSQL
          SELECT * EXCEPT (${DB_COLUMNS.ROW_ID}) FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${selected}\`
          ${filterStatement}
          LIMIT ${QUERY_LIMIT}`,
          PAGE_SIZE,
        ),
      );
    }
  }

  handleChange = value => {
    const { dataset, dispatch } = this.props;

    const table = dataset.schema.tables.find(t => t.name === value);
    this.setState({
      selected: value,
      table,
    });
    dispatch(applyFilters({}));
  };

  render() {
    const { classes, dataset, queryResults, token } = this.props;
    const { table, selected } = this.state;
    const names = dataset.schema.tables.map(t => t.name);

    return (
      <Fragment>
        <QueryViewSidebar table={table} />
        <div className={classes.wrapper}>
          <Grid container spacing={2} direction="column">
            <div>
              <Grid container spacing={2} className={classes.headerArea}>
                <Grid item xs={3}>
                  <Typography variant="h5">{dataset.name}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <QueryViewDropdown options={names} onSelectedItem={this.handleChange} />
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid item xs={12}>
                <div className={classes.scrollTable}>
                  <QueryViewTable queryResults={queryResults} title={selected} token={token} />
                </div>
              </Grid>
            </div>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    filterStatement: state.query.filterStatement,
    queryResults: state.query.queryResults,
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QueryView));
