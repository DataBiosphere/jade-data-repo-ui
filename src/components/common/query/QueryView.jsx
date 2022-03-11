import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { Button, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';
import SidebarDrawer from './sidebar/SidebarDrawer';
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
  classes,
  resourceLoaded,
  resourceName,
  tableNames,
  handleChange,
  queryParams,
  selected,
  selectedTable,
  canLink,
  panels,
  handleDrawerWidth,
  sidebarWidth,
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
                <QueryViewDropdown options={tableNames} onSelectedItem={handleChange} />
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
                    queryParams={queryParams}
                    title={selected}
                    table={selectedTable}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <SidebarDrawer
            canLink={canLink}
            panels={panels}
            handleDrawerWidth={handleDrawerWidth}
            width={sidebarWidth}
            table={selectedTable}
            selected={selected}
          />
          <SnapshotPopup />
        </Fragment>
      )}
    </Fragment>
  );
}

QueryView.propTypes = {
  allowSort: PropTypes.bool,
  classes: PropTypes.object,
  resourceLoaded: PropTypes.bool,
  resourceName: PropTypes.string,
  tableNames: PropTypes.array,
  handleChange: PropTypes.func,
  queryParams: PropTypes.object,
  selected: PropTypes.string,
  selectedTable: PropTypes.object,
  canLink: PropTypes.bool,
  panels: PropTypes.array,
  handleDrawerWidth: PropTypes.func,
  sidebarWidth: PropTypes.number,
};

export default withStyles(styles)(QueryView);
