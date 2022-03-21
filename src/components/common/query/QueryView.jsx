import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { Button, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';
import SidebarDrawer from '../../dataset/query/sidebar/SidebarDrawer';
import QueryViewDropdown from './QueryViewDropdown';
import JadeTable from '../../table/JadeTable';
import SnapshotPopup from '../../snapshot/SnapshotPopup';

const styles = (theme) => ({
  wrapper: {
    paddingTop: theme.spacing(0),
    padding: theme.spacing(4),
  },
  scrollTable: {
    overflowY: 'auto',
    height: '100%',
  },
  headerArea: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
});

function QueryView({
  allowSort,
  canLink,
  classes,
  handleChangeTable,
  updateDataOnChange,
  handleDrawerWidth,
  panels,
  queryParams,
  resourceLoaded,
  resourceName,
  selected,
  selectedTable,
  sidebarWidth,
  tableNames,
}) {
  return (
    <Fragment>
      {resourceLoaded && (
        <Fragment>
          <Grid container spacing={0} className={classes.wrapper}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h3" className={classes.headerArea}>
                  {resourceName}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <QueryViewDropdown options={tableNames} onSelectedItem={handleChangeTable} />
              </Grid>
              <Grid item xs={3}>
                <Link to="overview">
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
                    allowSort={allowSort}
                    updateDataOnChange={updateDataOnChange}
                    queryParams={queryParams}
                    title={selected}
                    table={selectedTable}
                  />
                </div>
              </Grid>
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
        </Fragment>
      )}
    </Fragment>
  );
}

QueryView.propTypes = {
  allowSort: PropTypes.bool,
  canLink: PropTypes.bool,
  classes: PropTypes.object,
  handleChangeTable: PropTypes.func,
  handleDrawerWidth: PropTypes.func,
  panels: PropTypes.array,
  queryParams: PropTypes.object,
  resourceLoaded: PropTypes.bool,
  resourceName: PropTypes.string,
  selected: PropTypes.string,
  selectedTable: PropTypes.object,
  sidebarWidth: PropTypes.number,
  tableNames: PropTypes.array,
  updateDataOnChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(QueryView);
