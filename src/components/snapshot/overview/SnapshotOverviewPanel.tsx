import React from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import { CustomTheme } from '@mui/material/styles';
import { patchSnapshot } from 'actions';
import EditableFieldView from 'components/EditableFieldView';
import GoogleSheetExport from 'components/common/overview/GoogleSheetExport';
import { Link } from 'react-router-dom';
import { renderStorageResources } from '../../../libs/render-utils';
import SnapshotAccess from '../SnapshotAccess';
import SnapshotWorkspace from './SnapshotWorkspace';
import TabPanel from '../../common/TabPanel';
import SnapshotExport from './SnapshotExport';
import { SnapshotModel } from '../../../generated/tdr';
import { SnapshotRoles } from '../../../constants';
import { AppDispatch } from '../../../store';

const styles = (theme: CustomTheme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    accordionWorkspaces: {
      padding: theme.spacing(2),
      paddingLeft: '0px',
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
    datasetText: {
      ...theme.mixins.ellipsis,
    },
    jadeLink: {
      ...theme.mixins.jadeLink,
    },
  });

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface SnapshotOverviewPanelProps extends WithStyles<typeof styles> {
  dispatch: AppDispatch;
  snapshot: SnapshotModel;
  userRoles: Array<string>;
}

function SnapshotOverviewPanel(props: SnapshotOverviewPanelProps) {
  const [value, setValue] = React.useState(0);
  const { classes, dispatch, snapshot, userRoles } = props;
  const isSteward = userRoles.includes(SnapshotRoles.STEWARD);
  // @ts-ignore
  const sourceDataset = snapshot.source[0].dataset;
  const linkToBq = snapshot.cloudPlatform === 'gcp';

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
        {isSteward && (
          <Tab
            label="Roles & memberships"
            classes={{ selected: classes.tabSelected }}
            disableFocusRipple
            disableRipple
            {...a11yProps(2)}
          />
        )}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EditableFieldView
              fieldValue={snapshot.description}
              fieldName="Description"
              canEdit={isSteward}
              updateFieldValueFn={(text: string | undefined) =>
                dispatch(patchSnapshot(snapshot.id, { description: text }))
              }
              useMarkdown={true}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Root dataset:</Typography>
            <Typography data-cy="snapshot-source-dataset" className={classes.datasetText}>
              <Link to={`/datasets/${sourceDataset.id}`}>
                <span className={classes.jadeLink} title={sourceDataset.name}>
                  {sourceDataset.name}
                </span>
              </Link>
            </Typography>
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
          {sourceDataset.phsId && (
            <Grid item xs={4}>
              <Typography variant="h6">PHS ID:</Typography>
              {sourceDataset.phsId}
            </Grid>
          )}
          <Grid item xs={4}>
            <EditableFieldView
              fieldValue={snapshot.consentCode}
              fieldName="Consent Code"
              canEdit={isSteward}
              updateFieldValueFn={(text: string | undefined) => {
                dispatch(patchSnapshot(snapshot.id, { consentCode: text }));
              }}
              useMarkdown={false}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Billing Profile Id:</Typography>
            {snapshot.profileId}
          </Grid>
          {snapshot.dataProject && (
            <Grid item xs={4}>
              <Typography variant="h6">Google Data Project:</Typography>
              {snapshot.dataProject}
            </Grid>
          )}
          <Grid item xs={4}>
            <Typography variant="h6">Creation Information:</Typography>
            {snapshot.creationInformation?.mode}
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <SnapshotExport of={snapshot} />
          </Grid>
          {linkToBq && (
            <Grid item xs={6}>
              <GoogleSheetExport
                buttonLabel="Export Snapshot to Google Sheets"
                bigQueryAccessInfo={snapshot?.accessInformation?.bigQuery}
              />
            </Grid>
          )}
        </Grid>
        {isSteward && (
          <Grid item xs={12} className={classes.accordionWorkspaces}>
            <SnapshotWorkspace />
          </Grid>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <SnapshotAccess />
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
}

export default withStyles(styles)(SnapshotOverviewPanel);
