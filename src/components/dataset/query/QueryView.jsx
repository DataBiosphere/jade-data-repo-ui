import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { runQuery } from 'actions/index';

import QueryViewTable from './QueryViewTable';
import QueryViewSidebar from './QueryViewSidebar';
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
});

const PAGE_SIZE = 100;

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
    queryResults: PropTypes.object,
    token: PropTypes.string,
  };

  handleChange = value => {
    const { dataset, dispatch } = this.props;
    dispatch(
      runQuery(
        dataset.dataProject,
        `#standardSQL
        SELECT * FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${value}\``,
        PAGE_SIZE,
      ),
    );
    const table = dataset.schema.tables.find(t => t.name === value);
    this.setState({
      selected: value,
      table,
    });
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
              <Grid item xs={3}>
                <QueryViewDropdown options={names} onSelectedItem={this.handleChange} />
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
    queryResults: state.query.queryResults,
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QueryView));
