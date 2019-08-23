import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { runQuery } from 'actions/index';

import Grid from '@material-ui/core/Grid';
import QueryViewTable from './QueryViewTable';
import QueryViewSidebar from './QueryViewSidebar';
import { QueryViewDropdown } from './QueryViewDropdown';

export class QueryView extends React.PureComponent {
  static propTypes = {
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
    const { queryResults, token } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <QueryViewDropdown />
            </Grid>
            <Grid item>
              <QueryViewTable queryResults={queryResults} token={token} />
            </Grid>
            <Grid item>
              <QueryViewSidebar />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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

export default connect(mapStateToProps)(QueryView);
