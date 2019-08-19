import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { runQuery } from 'actions/index';

const styles = theme => ({});

export class DatasetQueryView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    queryResults: PropTypes.object,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(
      runQuery(
        'broad-jade-my',
        'SELECT * FROM [broad-jade-my-data.datarepo_ingest_test_08_15_15_47.sample]',
      ),
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    const { queryResults } = this.props;
    let data = [];
    let columns = [];

    if (queryResults.rows !== undefined && queryResults.schema !== undefined) {
      queryResults.schema.fields.forEach(colData => {
        const col = {
          title: colData.name,
          field: colData.name,
        };

        columns.push(col);
      });

      const columnNames = columns.map(x => x.title);
      queryResults.rows.forEach(rowData => {
        const row = {};

        for (let i = 0; i < rowData.f.length; i++) {
          const item = rowData.f[i].v;
          const currColumn = columnNames[i];

          row[currColumn] = item;
        }

        data.push(row);
      });
    }

    return (
      <div>
        <MaterialTable columns={columns} data={data} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    queryResults: state.query.queryResults,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetQueryView));
