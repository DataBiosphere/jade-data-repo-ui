import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { applyFilters, runQuery, getDatasetById } from 'actions/index';
import { Typography } from '@material-ui/core';
import { DB_COLUMNS } from '../../../constants/index';

import QueryViewTable from './QueryViewTable';
// import QueryViewSidebar from './sidebar/QueryViewSidebar';
import SidebarDrawer from './sidebar/SidebarDrawer';
import QueryViewDropdown from './QueryViewDropdown';
import JadeTable from '../../table/JadeTable';

const styles = theme => ({
  wrapper: {
    paddingTop: theme.spacing(0),
    padding: theme.spacing(4),
  },
  scrollTable: {
    overflowY: 'auto',
    height: '100%',
  },
  headerArea: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
    match: PropTypes.object,
    orderBy: PropTypes.string,
    queryResults: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, match, dataset } = this.props;
    const datasetId = match.params.uuid;
    if (dataset == null || dataset.id !== datasetId) {
      dispatch(getDatasetById(datasetId));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { dataset, dispatch, filterStatement, orderBy } = this.props;
    const { selected } = this.state;
    if (
      this.hasDataset() &&
      (prevProps.filterStatement !== filterStatement ||
        prevState.selected !== selected ||
        prevProps.orderBy !== orderBy)
    ) {
      dispatch(
        runQuery(
          dataset.dataProject,
          `#standardSQL
          SELECT * FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${selected}\`
          ${filterStatement}
          ${orderBy}
          LIMIT ${QUERY_LIMIT}`,
          PAGE_SIZE,
        ),
      );
    }
  }

  hasDataset() {
    const { dataset } = this.props;
    return dataset && dataset.schema;
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

  realRender() {
    const { classes, dataset, queryResults } = this.props;
    const { table } = this.state;
    const names = dataset.schema.tables.map(t => t.name);

    return (
      <Fragment>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Typography variant="h5" className={classes.headerArea}>
                {dataset.name}
              </Typography>
              <QueryViewDropdown options={names} onSelectedItem={this.handleChange} />
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <div className={classes.scrollTable}>
                <QueryViewTable
                  queryResults={queryResults}
                  title={selected}
                  token={token}
                  table={table}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <SidebarDrawer />
      </Fragment>
    );
  }

  render() {
    if (this.hasDataset()) {
      return this.realRender();
    }
    return <div>Loading</div>;
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    filterStatement: state.query.filterStatement,
    queryResults: state.query.queryResults,
    token: state.user.token,
    orderBy: state.query.orderBy,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QueryView));
