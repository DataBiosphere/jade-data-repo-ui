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

const PAGE_SIZE = 100;

export class QueryView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
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
    this.setState({ selected: value });
    const { dataset, dispatch } = this.props;
    dispatch(
      runQuery(
        dataset.dataProject,
        `#standardSQL
        SELECT * FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${value}\``,
        PAGE_SIZE,
      ),
    );
  };

  render() {
    const { classes, dataset, queryResults, token } = this.props;
    const names = dataset.schema.tables.map(table => table.name);

    return (
      <Fragment>
        <div className={classes.wrapper}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <QueryViewDropdown options={names} onSelectedItem={this.handleChange} />
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
