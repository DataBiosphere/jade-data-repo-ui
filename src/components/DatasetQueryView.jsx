import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import { runQuery } from 'actions/index';

const styles = theme => ({});

const tableIcons = {
  Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: React.forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: React.forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export class DatasetQueryView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pageToken: '',
    };
  }

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
        'SELECT * FROM [broad-jade-my-data.datarepo_ingest_test_08_15_15_47.sample]',
      ),
    );
  }

  render() {
    const { queryResults, token } = this.props;

    let columns = [];
    let options = {
      pageSize: 1,
      pageSizeOptions: [1, 2, 3],
    };
    if (queryResults.rows !== undefined && queryResults.schema !== undefined) {
      queryResults.schema.fields.forEach(colData => {
        const col = {
          title: colData.name,
          field: colData.name,
        };

        columns.push(col);
      });
    }

    return (
      <div>
        {queryResults && queryResults.jobReference && (
          <MaterialTable
            columns={columns}
            options={options}
            data={query =>
              new Promise((resolve, reject) => {
                let rawData = {};
                let data = [];

                const { jobId } = queryResults.jobReference;
                const { projectId } = queryResults.jobReference;

                console.log('TOKEN');
                console.log(query.tokenToUse);
                console.log('PAGE');
                console.log(query.page);

                if (query.tokenToUse === undefined) {
                  query.tokenToUse = queryResults.pageToken;
                }

                const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries/${jobId}`;
                const params = {
                  maxResults: 1,
                  pageToken: query.tokenToUse,
                };

                axios
                  .get(url, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    params,
                  })
                  .then(response => {
                    rawData = response.data;
                    query.tokenToUse = rawData.pageToken;

                    const columnNames = columns.map(x => x.title);
                    rawData.rows.forEach(rowData => {
                      const row = {};

                      for (let i = 0; i < rowData.f.length; i++) {
                        const item = rowData.f[i].v;
                        const currColumn = columnNames[i];

                        row[currColumn] = item;
                      }

                      data.push(row);
                    });
                    console.log('DATA');
                    console.log(data);

                    resolve({
                      data,
                      page: query.page,
                      totalCount: parseInt(queryResults.totalRows, 10),
                    });
                  });
              })
            }
            icons={tableIcons}
          />
        )}
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

export default connect(mapStateToProps)(withStyles(styles)(DatasetQueryView));
