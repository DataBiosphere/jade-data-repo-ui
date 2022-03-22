import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { pageQuery, applySort } from 'actions/index';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import JadeTableHead from './JadeTableHead';
import { ellipsis } from '../../libs/styles';
import { COLUMN_MODES, GOOGLE_CLOUD_RESOURCE } from '../../constants';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  spinWrapper: {
    height: 'calc(100% - 60px)',
    display: 'grid',
    width: 500,
    textAlign: 'center',
    margin: 'auto',
  },
  spinner: {
    margin: 'auto',
  },
  cell: {
    borderBottomColor: theme.palette.lightTable.bottomColor,
    ...ellipsis,
  },
  nullValue: {
    fontStyle: 'italic',
    textColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  },
  dialogContentText: {
    width: 'max-content',
    maxWidth: '800px',
  },
  seeMoreLink: {
    ...theme.mixins.jadeLink,
    cursor: 'pointer',
  },
});

export class JadeTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 100,
      pageToTokenMap: {},
      orderBy: '',
      order: '',
      seeMore: {
        open: false,
        title: '',
        contents: '',
      },
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    columns: PropTypes.array,
    dataset: PropTypes.object,
    delay: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    polling: PropTypes.bool,
    queryResults: PropTypes.object,
    rows: PropTypes.array,
  };

  maxRepeatedValues = 5;

  handleChangePage = (event, newPage) => {
    const { dispatch, queryResults, dataset } = this.props;
    const { page, rowsPerPage, pageToTokenMap } = this.state;
    const bqStorage = dataset.storage.find(
      (s) => s.cloudResource === GOOGLE_CLOUD_RESOURCE.BIGQUERY,
    );
    const location = bqStorage?.region;
    if (page === 0) {
      pageToTokenMap[0] = undefined;
    }

    if (newPage > page) {
      pageToTokenMap[newPage] = queryResults.pageToken;
    }

    dispatch(
      pageQuery(
        pageToTokenMap[newPage],
        queryResults.jobReference.projectId,
        queryResults.jobReference.jobId,
        rowsPerPage,
        location,
      ),
    );
    this.setState({
      page: newPage,
      pageToTokenMap,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  createSortHandler = (property) => {
    const { dispatch } = this.props;
    const { order } = this.state;
    let newOrder = '';
    let newOrderBy = property;

    if (order === '') {
      newOrder = 'desc';
    }
    if (order === 'asc') {
      newOrder = '';
      newOrderBy = '';
    }
    if (order === 'desc') {
      newOrder = 'asc';
    }

    dispatch(applySort(newOrderBy, order));

    this.setState({
      order: newOrder,
      orderBy: newOrderBy,
    });
  };

  handleSeeMoreOpen = (values, title) => {
    this.setState({
      seeMore: {
        open: true,
        title,
        contents: values,
      },
    });
  };

  handleSeeMoreClose = () => {
    this.setState({
      seeMore: {
        open: false,
        title: '',
        contents: '',
      },
    });
  };

  handleRepeatedValues = (values, columnName, classes) => {
    const allValues = [];
    const cleanValues = values.map((v) => (_.isNull(v) ? this.handleNullValue(v) : v));
    const start = <span key="start">[</span>;
    const end = <span key="end">]</span>;
    for (let i = 0; i < cleanValues.length; i++) {
      const thisValue = cleanValues[i];
      if (i < cleanValues.length - 1) {
        allValues.push(
          <span key={`sep-${i}`}>
            {thisValue},<br />
          </span>,
        );
      } else {
        allValues.push(thisValue);
      }
    }
    const valuesToDisplay = [start, ...allValues, end];
    if (allValues.length > this.maxRepeatedValues) {
      const ellipses = <span key="ellipses">...</span>;
      const seeMore = (
        <span key="see-more">
          <Link
            className={classes.seeMoreLink}
            onClick={() => this.handleSeeMoreOpen(valuesToDisplay, columnName)}
          >
            <br />
            See full list
          </Link>
        </span>
      );
      return [start, ...allValues.slice(0, this.maxRepeatedValues), ellipses, end, seeMore];
    }

    return valuesToDisplay;
  };

  handleNullValue = (classes) => <span className={classes.nullValue}>null</span>;

  handleValues = (value, column, classes) => {
    if (_.isArray(value)) {
      if (column.mode === COLUMN_MODES.REPEATED) {
        return this.handleRepeatedValues(value, column.id, classes);
      }
      const singleValue = value[0];
      return _.isNull(singleValue) ? this.handleNullValue(singleValue) : singleValue;
    }
    if (_.isNull(value)) {
      return this.handleNullValue(classes);
    }
    return value;
  };

  render() {
    const { classes, queryResults, columns, rows, polling, delay } = this.props;
    const { page, rowsPerPage, orderBy, order, seeMore } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          {rows && columns && (
            <Table stickyHeader aria-label="sticky table">
              <JadeTableHead
                columns={columns}
                orderBy={orderBy}
                order={order}
                createSortHandler={this.createSortHandler}
              />
              {!polling && (
                <TableBody data-cy="tableBody">
                  {rows.map((row, i) => {
                    const drId = row.datarepo_id;

                    return (
                      <TableRow hover tabIndex={-1} key={drId}>
                        {columns.map((column) => {
                          const value = this.handleValues(row[column.id], column, classes);
                          return (
                            !_.isUndefined(value) && (
                              <TableCell
                                key={`${column.id}-${drId}`}
                                className={classes.cell}
                                data-cy={`cellvalue-${column.id}-${i}`}
                              >
                                {value}
                              </TableCell>
                            )
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          )}
          {polling && (
            <div className={classes.spinWrapper}>
              <CircularProgress className={classes.spinner} />
              {delay &&
                'For large datasets, it can take a few minutes to fetch results from BigQuery. Thank you for your patience.'}
            </div>
          )}
        </div>
        <TablePagination
          rowsPerPageOptions={[100]}
          component="div"
          count={parseInt(queryResults.totalRows, 10) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Dialog open={seeMore.open} scroll="paper">
          <DialogTitle disableTypography={true} id="see-more-dialog-title">
            <Typography variant="h4" style={{ float: 'left' }}>
              {seeMore.title}
            </Typography>
            <IconButton size="small" style={{ float: 'right' }} onClick={this.handleSeeMoreClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              className={classes.dialogContentText}
              id="see-more-dialog-content-text"
            >
              {seeMore.contents}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    delay: state.query.delay,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    token: state.user.token,
    queryResults: state.query.queryResults,
    columns: state.query.columns,
    rows: state.query.rows,
    polling: state.query.polling,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTable));
