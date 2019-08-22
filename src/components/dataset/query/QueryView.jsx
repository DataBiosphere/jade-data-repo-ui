import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { runQuery } from 'actions/index';

import QueryViewTable from './QueryViewTable';
import QueryViewSidebar from './QueryViewSidebar';

export class QueryView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    queryResults: PropTypes.object,
    token: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      runQuery(
        'broad-jade-my',
        'SELECT * FROM [broad-jade-my-data.datarepo_V2F_GWAS_Summary_Stats.variant]',
        100,
      ),
    );
  }

  render() {
    const { queryResults, token } = this.props;
    return (
      <div>
        <div>
          <QueryViewTable queryResults={queryResults} token={token} />
        </div>
        <div>
          <QueryViewSidebar />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    queryResults: state.query.queryResults,
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(QueryView);
