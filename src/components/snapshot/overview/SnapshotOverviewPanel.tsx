import React, { useState, SyntheticEvent } from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import { CustomTheme } from '@mui/material/styles';
import { patchSnapshot } from 'actions';
import EditableFieldView from 'components/EditableFieldView';
import GoogleSheetExport from 'components/common/overview/GoogleSheetExport';
import { Link } from 'react-router-dom';
import TextContent from 'components/common/TextContent';
import { IamResourceTypeEnum } from 'generated/tdr';
import { renderStorageResources, renderTextFieldValue } from '../../../libs/render-utils';
import SnapshotAccess from '../SnapshotAccess';
import SnapshotWorkspace from './SnapshotWorkspace';
import TabPanel from '../../common/TabPanel';
import SnapshotExport from './SnapshotExport';
import { SnapshotModel } from '../../../generated/tdr';
import { SnapshotRoles } from '../../../constants';
import { AppDispatch } from '../../../store';
import JournalEntriesView from '../../JournalEntriesView';

const styles = (theme: CustomTheme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    accordionWorkspaces: {
      padding: theme.spacing(2),
      paddingLeft: '0px',
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
  const [value, setValue] = useState(0);
  const { classes, dispatch, snapshot, userRoles } = props;
  const isSteward = userRoles.includes(SnapshotRoles.STEWARD);
  const canViewJournalEntries = userRoles.includes(SnapshotRoles.STEWARD);
  // @ts-ignore
  const sourceDataset = snapshot.source[0].dataset;
  const linkToBq = snapshot.cloudPlatform === 'gcp';

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab
          data-cy="snapshot-summary-tab"
          label="Snapshot Summary"
          disableFocusRipple
          disableRipple
          {...a11yProps(0)}
        />
        <Tab
          data-cy="snapshot-export-tab"
          label="Export Snapshot"
          disableFocusRipple
          disableRipple
          {...a11yProps(1)}
        />
        {canViewJournalEntries && (
          <Tab label="Snapshot activity" disableFocusRipple disableRipple {...a11yProps(2)} />
        )}
        {isSteward && (
          <Tab label="Roles & memberships" disableFocusRipple disableRipple {...a11yProps(3)} />
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
          <Grid item xs={12}>
            <Grid item xs={4}>
              {renderTextFieldValue(
                'DUOS ID',
                snapshot.duosFirecloudGroup?.duosId,
                'Link with a DUOS dataset ID to automatically add DAC approved users as snapshot readers',
              )}
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Root dataset:</Typography>
            <Typography
              data-cy="snapshot-source-dataset"
              className={classes.datasetText}
              component="span"
            >
              <Link to={`/datasets/${sourceDataset.id}`}>
                <span className={classes.jadeLink} title={sourceDataset.name}>
                  <TextContent text={sourceDataset.name} />
                </span>
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {renderTextFieldValue('Snapshot ID', snapshot.id)}
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
          <Grid item xs={4}>
            {renderTextFieldValue(
              'PHS ID',
              sourceDataset.phsId,
              'PHS ID is editable on the parent dataset.',
            )}
          </Grid>
          <Grid item xs={4}>
            <EditableFieldView
              fieldValue={snapshot.consentCode}
              fieldName="Consent Code"
              canEdit={isSteward}
              infoButtonText="The Consent Code is used in conjunction with the PHS ID to determined if a user is authorized to view a snapshot based on their RAS Passport."
              updateFieldValueFn={(text: string | undefined) => {
                dispatch(patchSnapshot(snapshot.id, { consentCode: text }));
              }}
              useMarkdown={false}
            />
          </Grid>
          <Grid item xs={4}>
            {renderTextFieldValue('Billing Profile Id', snapshot.profileId)}
          </Grid>
          {snapshot.dataProject && (
            <Grid item xs={4}>
              {renderTextFieldValue('Google Data Project', snapshot.dataProject)}
            </Grid>
          )}
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
      {canViewJournalEntries && (
        <TabPanel value={value} index={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <JournalEntriesView
                id={snapshot.id}
                resourceType={IamResourceTypeEnum.Datasnapshot}
              />
            </Grid>
          </Grid>
        </TabPanel>
      )}
      <TabPanel value={value} index={3}>
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
