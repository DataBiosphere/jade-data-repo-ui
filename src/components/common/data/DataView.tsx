import React, { Fragment } from 'react';
import { ClassNameMap, withStyles } from '@mui/styles';
import { Button, Typography } from '@mui/material';
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
    height: '100%',
    paddingTop: theme.spacing(1),
    maxWidth: '100%',
  },
  scrollTableWithPadding: {
    height: '100%',
    paddingTop: theme.spacing(1),
    maxWidth: '97%',
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  dropdown: {
    minWidth: '400px',
    paddingRight: '1em',
  },
});

type DataViewProps = {
  canLink: boolean;
  classes: ClassNameMap;
  columns: Array<TableColumnType>;
  filterStatement: string;
  handleChangeTable: () => void;
  handleDrawerWidth: () => void;
  handleEnumeration: () => void;
  pageBQQuery: () => void;
  panels: Array<object>;
  polling: boolean;
  resourceId: string;
  resourceLoaded: boolean;
  resourceName: string;
  resourceType: string;
  rows: Array<TableRowType>;
  selected: boolean;
  selectedTable: string;
  sidebarWidth: number;
  tableNames: Array<string>;
  totalRows: number;
};

function DataView({
  canLink,
  classes,
  columns,
  filterStatement,
  handleChangeTable,
  handleDrawerWidth,
  handleEnumeration,
  pageBQQuery,
  panels,
  polling,
  resourceId,
  resourceLoaded,
  resourceName,
  resourceType,
  rows,
  selected,
  selectedTable,
  sidebarWidth,
  tableNames,
  totalRows,
}: DataViewProps) {
  // Can be removed after DR-2483
  const showPanels = panels.length > 0;
  // Only used for Direct BQ Query
  const isDatasetFiltered = filterStatement.length > 0;

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
          <div className={classes.controls}>
            <div className={classes.dropdown}>
              <DataViewDropdown options={tableNames} onSelectedItem={handleChangeTable} />
            </div>
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
          </div>
          <div className={showPanels ? classes.scrollTableWithPadding : classes.scrollTable}>
            <LightTable
              columns={columns}
              filteredCount={totalRows}
              handleEnumeration={handleEnumeration}
              loading={polling}
              noRowsMessage={
                isDatasetFiltered ? 'No rows match your filter' : 'No rows exist in the table'
              }
              pageBQQuery={pageBQQuery}
              rows={rows}
              searchString={filterStatement}
              tableName={selectedTable}
              totalCount={totalRows} // TODO - DR-2663 - instead should display total rows regardless of filtering
            />
          </div>
          {showPanels && (
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
    rows: state.query.rows,
    rowsPerPage: state.query.rowsPerPage,
    totalRows: state.query.queryParams.totalRows,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DataView));
