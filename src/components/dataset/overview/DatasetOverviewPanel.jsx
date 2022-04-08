import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';
import moment from 'moment';
import { renderCloudPlatforms, renderStorageResources } from '../../../libs/render-utils';
import DatasetAccess from '../DatasetAccess';
import DatasetSnapshotsTable from '../../table/DatasetSnapshotsTable';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  tabsRoot: {
    fontFamily: theme.typography.fontFamily,
    height: 18,
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 18,
    textAlign: 'center',
    width: '100%',
    borderBottom: `1px solid ${theme.palette.terra.green}`,
    paddingLeft: '28px',
  },
  tabSelected: {
    fontWeight: 700,
    color: theme.palette.secondary.dark,
    bottomBar: '6px',
  },
  tabsIndicator: {
    borderBottom: `6px solid ${theme.palette.terra.green}`,
    transition: 'none',
  },
  tabPanel: {
    padding: '1em 1em 1em 28px',
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function DatasetOverviewPanel(props) {
  const [value, setValue] = React.useState(0);
  const { classes, dataset } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        classes={{
          root: classes.tabsRoot,
          indicator: classes.tabsIndicator,
        }}
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab
          label="Dataset Summary"
          classes={{ selected: classes.tabSelected }}
          disableFocusRipple
          disableRipple
          {...a11yProps(0)}
        />
        <Tab
          label="Snapshots"
          classes={{ selected: classes.tabSelected }}
          disableFocusRipple
          disableRipple
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Description:</Typography>
            <Typography>{dataset.description}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Created:</Typography>
            <Typography>{moment(dataset.createdDate).fromNow()}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Storage:</Typography>
            {renderStorageResources(dataset)}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Cloud Platforms:</Typography>
            {renderCloudPlatforms(dataset)}
          </Grid>
        </Grid>
        <DatasetAccess horizontal={true} />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <DatasetSnapshotsTable />
      </TabPanel>
    </div>
  );
}

DatasetOverviewPanel.propTypes = {
  classes: PropTypes.object,
  dataset: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetOverviewPanel));
