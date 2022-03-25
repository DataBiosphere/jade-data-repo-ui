import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { Button, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';
import SidebarDrawer from 'components/dataset/data/sidebar/SidebarDrawer';
import DataViewDropdown from './DataViewDropdown';
import JadeTable from '../../table/JadeTable';
import SnapshotPopup from '../../snapshot/SnapshotPopup';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import { BREADCRUMB_TYPE } from '../../../constants';

const styles = (theme) => ({
  pageRoot: { ...theme.mixins.pageRoot },
  pageTitle: { ...theme.mixins.pageTitle },
  wrapper: {
    paddingTop: theme.spacing(0),
    padding: theme.spacing(4),
  },
  scrollTable: {
    overflowY: 'auto',
    height: '100%',
  },
});

function DataView({
  canLink,
  classes,
  handleChangeTable,
  updateDataOnChange,
  handleDrawerWidth,
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
}) {
  return (
    <Fragment>
      {resourceLoaded && (
        <div className={classes.pageRoot}>
          <AppBreadcrumbs
            context={{
              type:
                resourceType === BREADCRUMB_TYPE.DATASET
                  ? BREADCRUMB_TYPE.DATASET
                  : BREADCRUMB_TYPE.SNAPSHOT,
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
                  updateDataOnChange={updateDataOnChange}
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

DataView.propTypes = {
  canLink: PropTypes.bool,
  classes: PropTypes.object,
  handleChangeTable: PropTypes.func,
  handleDrawerWidth: PropTypes.func,
  panels: PropTypes.array,
  queryParams: PropTypes.object,
  resourceId: PropTypes.string,
  resourceLoaded: PropTypes.bool,
  resourceName: PropTypes.string,
  resourceType: PropTypes.string,
  selected: PropTypes.string,
  selectedTable: PropTypes.object,
  sidebarWidth: PropTypes.number,
  tableNames: PropTypes.array,
  updateDataOnChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(DataView);
