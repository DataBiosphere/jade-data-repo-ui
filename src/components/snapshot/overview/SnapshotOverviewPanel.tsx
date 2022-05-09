import React from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import { CustomTheme } from '@mui/material/styles';
import { renderStorageResources } from '../../../libs/render-utils';
import SnapshotAccess from '../SnapshotAccess';
import TabPanel from '../../common/TabPanel';
import SnapshotExport from './SnapshotExport';
import { SnapshotModel } from '../../../generated/tdr';
import SnapshotGoogleSheet from './SnapshotGoogleSheet';

const styles = (theme: CustomTheme) =>
  createStyles({
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface SnapshotOverviewPanelProps extends WithStyles<typeof styles> {
  snapshot: SnapshotModel;
}

function SnapshotOverviewPanel(props: SnapshotOverviewPanelProps) {
  const [value, setValue] = React.useState(0);
  const { classes, snapshot } = props;
  // @ts-ignore
  const sourceDataset = snapshot.source[0].dataset;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
          data-cy="snapshot-summary-tab"
          label="Snapshot Summary"
          classes={{ selected: classes.tabSelected }}
          disableFocusRipple
          disableRipple
          {...a11yProps(0)}
        />
        <Tab
          data-cy="snapshot-export-tab"
          label="Export Snapshot"
          classes={{ selected: classes.tabSelected }}
          disableFocusRipple
          disableRipple
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Description:</Typography>
            <Typography data-cy="snapshot-description">{snapshot.description}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Root dataset:</Typography>
            <Typography data-cy="snapshot-source-dataset">{sourceDataset.name}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Date Created:</Typography>
            <Typography data-cy="snapshot-date-created">
              {moment(snapshot.createdDate).fromNow()}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Storage:</Typography>
            {renderStorageResources(sourceDataset)}
          </Grid>
        </Grid>
        <Typography variant="h6"> Roles and memberships: </Typography>
        <Typography> Learn more about roles and memberships </Typography>
        <SnapshotAccess horizontal={true} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SnapshotExport of={snapshot} />
          </Grid>
          <Grid item xs={6}>
            <SnapshotGoogleSheet classes={classes} of={snapshot} />
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
}

export default withStyles(styles)(SnapshotOverviewPanel);
