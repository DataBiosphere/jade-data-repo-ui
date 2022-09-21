import React, { Fragment } from 'react';
import { ClassNameMap, withStyles } from '@mui/styles';
import { Button, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import _ from 'lodash';
import { TableDataType, TableModel } from 'generated/tdr';

import { Link } from 'react-router-dom';
import JadeDropdown from 'components/dataset/data/JadeDropdown';
import LightTable from 'components/table/LightTable';
import SidebarDrawer from 'components/dataset/data/sidebar/SidebarDrawer';
import SnapshotPopup from '../../snapshot/SnapshotPopup';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import { BreadcrumbType, DbColumns, ResourceType } from '../../../constants';
import { OrderDirectionOptions, TableColumnType, TableRowType } from '../../../reducers/query';
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
  handleChangeTable: (value: string) => void;
  handleDrawerWidth: (width: number) => void;
  handleEnumeration?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  pageBQQuery?: () => void;
  panels: Array<object>;
  polling: boolean;
  resourceId: string;
  resourceLoaded: boolean;
  resourceName: string;
  resourceType: ResourceType | BreadcrumbType;
  rows: Array<TableRowType>;
  selected: string;
  selectedTable: TableModel;
  sidebarWidth: number;
  tableNames: Array<string>;
  totalRows: number;
  refreshCnt: number;
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
  refreshCnt,
}: DataViewProps) {
  // Can be removed after DR-2483
  const showPanels = panels.length > 0;
  // Only used for Direct BQ Query
  const isDatasetFiltered = filterStatement.length > 0;

  const columnsByName = _.keyBy(columns, 'name');
  const orderedColumns: TableColumnType[] = [
    resourceType === ResourceType.DATASET
      ? { name: DbColumns.ROW_ID, datatype: TableDataType.String, array_of: false, required: true }
      : undefined,
    ...selectedTable.columns,
  ]
    .map((col) => (col !== undefined ? columnsByName[col.name] : undefined))
    .filter((col) => col !== undefined)
    .map((col) => col as TableColumnType);
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
              <JadeDropdown
                onSelectedItem={(e) => handleChangeTable(e.target.value)}
                options={tableNames}
                value={selectedTable.name}
                name="Select Table"
              />
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
              columns={orderedColumns}
              filteredCount={totalRows}
              handleEnumeration={handleEnumeration}
              loading={polling}
              noRowsMessage={
                isDatasetFiltered ? 'No rows match your filter' : 'No rows exist in the table'
              }
              pageBQQuery={pageBQQuery}
              rows={rows}
              searchString={filterStatement}
              tableName={selectedTable.name}
              totalCount={totalRows} // TODO - DR-2663 - instead should display total rows regardless of filtering
              refreshCnt={refreshCnt}
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
    refreshCnt: state.query.refreshCnt,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DataView));
