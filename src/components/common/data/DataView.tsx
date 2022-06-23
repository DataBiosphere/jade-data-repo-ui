import React, { Fragment } from 'react';
import { ClassNameMap, withStyles } from '@mui/styles';
import { Button, Grid, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';

import { Link } from 'react-router-dom';
import SidebarDrawer from 'components/dataset/data/sidebar/SidebarDrawer';
import DataViewDropdown from './DataViewDropdown';
import JadeTable from '../../table/JadeTable';
import SnapshotPopup from '../../snapshot/SnapshotPopup';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import { BreadcrumbType } from '../../../constants';

const styles = (theme: CustomTheme) => ({
  pageRoot: { ...theme.mixins.pageRoot },
  pageTitle: { ...theme.mixins.pageTitle },
  wrapper: {
    paddingTop: theme.spacing(0),
    padding: theme.spacing(4),
  },
  scrollTable: {
    // overflowY: 'auto',
    height: '100%',
  },
});

type DataViewProps = {
  canLink: boolean;
  classes: ClassNameMap;
  handleChangeTable: () => void;
  handleDrawerWidth: () => void;
  pageBQQuery: () => void;
  panels: Array<object>;
  queryParams: object;
  resourceId: string;
  resourceLoaded: boolean;
  resourceName: string;
  resourceType: string;
  selected: boolean;
  selectedTable: string;
  sidebarWidth: number;
  tableNames: Array<string>;
};

function DataView({
  canLink,
  classes,
  handleChangeTable,
  handleDrawerWidth,
  pageBQQuery,
  panels,
  queryParams,
  resourceId,
  resourceLoaded,
  resourceName,
  resourceType,
  selected,
  selectedTable,
  sidebarWidth,
  tableNames,
}: DataViewProps) {
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
                <JadeTable
                  pageBQQuery={pageBQQuery}
                  queryParams={queryParams}
                  title={selected}
                  table={selectedTable}
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

export default withStyles(styles)(DataView);
