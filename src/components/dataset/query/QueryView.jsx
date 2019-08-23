import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { runQuery } from 'actions/index';

import Grid from '@material-ui/core/Grid';
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
});

export class QueryView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    queryResults: PropTypes.object,
    token: PropTypes.string,
  };

  componentDidMount() {
    const { dataset, dispatch } = this.props;
    dispatch(
      runQuery(
        'broad-jade-my',
        `SELECT * FROM [${dataset.dataProject}.datarepo_${dataset.name}.${dataset.schema.tables[0].name}]`,
        100,
      ),
    );
  }

  render() {
    const { classes, dataset, queryResults, token } = this.props;
    const names = dataset.schema.tables.map(table => table.name);

    return (
      <Fragment>
        <div className={classes.wrapper}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <QueryViewDropdown options={names} />
            </Grid>
            <Grid item xs={12}>
              <QueryViewTable queryResults={queryResults} token={token} />
            </Grid>
          </Grid>
        </div>
        <QueryViewSidebar />
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
