import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Failure from 'components/common/Failure';
import { applySort, changePage, changeRowsPerPage } from 'actions/index';
import JadeTableHead from './JadeTableHead';
import { TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS } from '../../constants';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  cell: {
    borderBottomColor: theme.palette.lightTable.bottomColor,
    ...theme.mixins.ellipsis,
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

function JadeTable({
  classes,
  columns,
  delay,
  dispatch,
  errMsg,
  error,
  orderDirection,
  page,
  pageBQQuery,
  polling,
  queryParams,
  rows,
  rowsPerPage,
}) {
  const [count, setCount] = useState(0);
  const [seeMore, setSeeMore] = useState({ open: false, title: '', contents: '' });

  const maxRepeatedValues = 5;
  useEffect(() => {
    const c = parseInt(queryParams.totalRows, 10);
    if (c >= 0) {
      setCount(c);
    }
  }, [queryParams]);

  // Once we no longer need to support BQ Querying,
  // we can remove the async/await call and pageBQQuery()
  const handleChangePage = async (event, newPage) => {
    await dispatch(changePage(newPage));
    if (pageBQQuery) {
      pageBQQuery();
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    await dispatch(changeRowsPerPage(newRowsPerPage));
    if (pageBQQuery) {
      pageBQQuery();
    }
  };

  const createSortHandler = (property) => {
    let newOrderDirection = '';

    if (orderDirection === 'asc') {
      newOrderDirection = 'desc';
    }
    if (orderDirection === 'desc') {
      newOrderDirection = 'asc';
    }

    dispatch(applySort(property, newOrderDirection));
  };

  const handleSeeMoreOpen = (values, title) => {
    setSeeMore({
      open: true,
      title,
      contents: values,
    });
  };

  const handleSeeMoreClose = () => {
    setSeeMore({
      open: false,
      title: '',
      contents: '',
    });
  };

  const handleNullValue = () => <span className={classes.nullValue}>null</span>;

  const handleRepeatedValues = (values, columnName) => {
    const allValues = [];
    const cleanValues = values.map((v) => (_.isNull(v) ? handleNullValue(v) : v));
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
    if (allValues.length > maxRepeatedValues) {
      const ellipses = <span key="ellipses">...</span>;
      const seeMoreLink = (
        <span key="see-more">
          <Link
            className={classes.seeMoreLink}
            onClick={() => handleSeeMoreOpen(valuesToDisplay, columnName)}
          >
            <br />
            See all {allValues.length} values
          </Link>
        </span>
      );
      return [start, ...allValues.slice(0, maxRepeatedValues), ellipses, end, seeMoreLink];
    }

    return valuesToDisplay;
  };

  const handleValues = (value, column) => {
    if (_.isArray(value)) {
      if (column.arrayOf) {
        return handleRepeatedValues(value, column.name, classes);
      }
      const singleValue = value[0];
      return _.isNull(singleValue) ? handleNullValue(singleValue) : singleValue;
    }
    if (_.isNull(value)) {
      return handleNullValue();
    }
    return value;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        {rows && columns && !error && (
          <Table stickyHeader aria-label="sticky table">
            <JadeTableHead columns={columns} createSortHandler={createSortHandler} />
            {!polling && (
              <TableBody data-cy="tableBody">
                {rows.map((row, i) => {
                  const drId = row.datarepo_row_id;

                  return (
                    <TableRow hover tabIndex={-1} key={drId}>
                      {columns.map((column) => {
                        const value = handleValues(row[column.name], column);
                        return (
                          !_.isUndefined(value) && (
                            <TableCell
                              key={`${column.name}-${drId}`}
                              className={classes.cell}
                              data-cy={`cellValue-${column.name}-${i}`}
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
          <LoadingSpinner
            delay={delay}
            delayMessage="For large datasets, it can take a few minutes to fetch results. Thank you for your patience."
          />
        )}
        {error && <Failure errString={errMsg} />}
      </div>
      <TablePagination
        rowsPerPageOptions={TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={seeMore.open} scroll="paper">
        <DialogTitle disableTypography={true} id="see-more-dialog-title">
          <Typography variant="h4" style={{ float: 'left' }}>
            {seeMore.title}
          </Typography>
          <IconButton size="small" style={{ float: 'right' }} onClick={handleSeeMoreClose}>
            <Close />
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

JadeTable.propTypes = {
  classes: PropTypes.object,
  columns: PropTypes.array,
  delay: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  errMsg: PropTypes.string,
  error: PropTypes.bool,
  orderDirection: PropTypes.string,
  page: PropTypes.number.isRequired,
  pageBQQuery: PropTypes.func,
  polling: PropTypes.bool,
  queryParams: PropTypes.object,
  rows: PropTypes.array,
  rowsPerPage: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    columns: state.query.columns,
    delay: state.query.delay,
    error: state.query.error,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    orderDirection: state.query.orderDirection,
    page: state.query.page,
    polling: state.query.polling,
    queryParams: state.query.queryParams,
    rows: state.query.rows,
    rowsPerPage: state.query.rowsPerPage,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTable));
