import React, { Fragment } from 'react';
import { ClassNameMap, withStyles } from '@mui/styles';
import { Button, Grid, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import LightTable from 'components/table/LightTable';
import SidebarDrawer from 'components/dataset/data/sidebar/SidebarDrawer';
import DataViewDropdown from './DataViewDropdown';
import SnapshotPopup from '../../snapshot/SnapshotPopup';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import { BreadcrumbType } from '../../../constants';
import { TableColumnType, TableRowType } from '../../../reducers/query';
import { TdrState } from '../../../reducers';

const styles = (theme: CustomTheme) => ({
  pageRoot: { ...theme.mixins.pageRoot },
  pageTitle: { ...theme.mixins.pageTitle },
  wrapper: {
    paddingTop: theme.spacing(0),
    padding: theme.spacing(4),
  },
  scrollTable: {
    overflow: 'auto',
    height: '100%',
    paddingTop: theme.spacing(1),
  },
});

type DataViewProps = {
  canLink: boolean;
  classes: ClassNameMap;
  columns: Array<TableColumnType>;
  filterStatement: string;
  handleChangeTable: () => void;
  handleDrawerWidth: () => void;
  pageBQQuery: () => void;
  panels: Array<object>;
  polling: boolean;
  resourceId: string;
  resourceLoaded: boolean;
  resourceName: string;
  resourceType: string;
  resultsCount: number;
  rows: Array<TableRowType>;
  selected: boolean;
  selectedTable: string;
  sidebarWidth: number;
  tableNames: Array<string>;
};

function DataView({
  canLink,
  classes,
  columns,
  filterStatement,
  handleChangeTable,
  handleDrawerWidth,
  pageBQQuery,
  panels,
  polling,
  resourceId,
  resourceLoaded,
  resourceName,
  resourceType,
  resultsCount,
  rows,
  selected,
  selectedTable,
  sidebarWidth,
  tableNames,
}: DataViewProps) {
  const rowKey = (row: TableRowType): string => {
    const drId = row.datarepo_row_id;
    return drId ?? row.name;
  };

  return (
    //eslint-disable-next-line react/jsx-no-useless-fragment
    <Fragment>
      {resourceLoaded && (
        <div className={classes.pageRoot}>
          <AppBreadcrumbs
            context={{
              type:
                resourceType === BreadcrumbType.DATASET
                  ? BreadcrumbType.DATASET
                  : BreadcrumbType.SNAPSHOT,
              id: resourceId,
              name: resourceName,
            }}
            childBreadcrumbs={[{ text: 'Data', to: 'data' }]}
          />
          <Typography variant="h3" className={classes.pageTitle}>
            {resourceName}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <DataViewDropdown options={tableNames} onSelectedItem={handleChangeTable} />
            </Grid>
            <Grid item xs={3}>
              <Link to={`/${resourceType}s/${resourceId}`}>
                <Button
                  className={classes.viewDatasetButton}
                  color="primary"
                  variant="outlined"
                  disableElevation
                  size="large"
                >
                  Back to Overview
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xs={11}>
              <div className={classes.scrollTable}>
                <LightTable
                  columns={columns}
                  filteredCount={resultsCount}
                  loading={polling}
                  noRowsMessage="No rows exist in the table" // TODO - handle case where filtered
                  pageBQQuery={pageBQQuery}
                  rowKey={rowKey}
                  rows={rows}
                  searchString={filterStatement}
                  summary={false}
                  totalCount={resultsCount} //TODO - this is the filtered count
                />
              </div>
            </Grid>
          </Grid>
          {panels.length > 0 && (
            <SidebarDrawer
              canLink={canLink}
              panels={panels}
              handleDrawerWidth={handleDrawerWidth}
              width={sidebarWidth}
              table={selectedTable}
              selected={selected}
            />
          )}
          <SnapshotPopup />
        </div>
      )}
    </Fragment>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    columns: state.query.columns,
    delay: state.query.delay,
    error: state.query.error,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    orderDirection: state.query.orderDirection,
    page: state.query.page,
    polling: state.query.polling,
    resultsCount: state.query.resultsCount,
    rows: state.query.rows,
    rowsPerPage: state.query.rowsPerPage,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DataView));
