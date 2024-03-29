import React, { useState, SyntheticEvent } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Autocomplete, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import { CustomTheme } from '@mui/material/styles';
import { patchSnapshot, updateDuosDataset } from 'actions';
import EditableFieldView from 'components/EditableFieldView';
import GoogleSheetExport from 'components/common/overview/GoogleSheetExport';
import { Link } from 'react-router-dom';
import TextContent from 'components/common/TextContent';
import InfoHoverButton from 'components/common/InfoHoverButton';
import { IamResourceTypeEnum } from 'generated/tdr';
import { TdrState } from 'reducers';
import {
  renderCloudPlatforms,
  renderStorageResources,
  renderTextFieldValue,
} from '../../../libs/render-utils';
import SnapshotAccess from '../SnapshotAccess';
import SnapshotWorkspace from './SnapshotWorkspace';
import TabPanel from '../../common/TabPanel';
import SnapshotExport from './SnapshotExport';
import { SnapshotModel } from '../../../generated/tdr';
import { SnapshotRoles } from '../../../constants';
import { AppDispatch } from '../../../store';
import JournalEntriesView from '../../JournalEntriesView';
import { SnapshotPendingSave } from '../../../reducers/snapshot';
import { DuosDatasetModel } from '../../../reducers/duos';
import DataAccessControlGroup from '../DataAccessControlGroup';

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
    duosDropdown: {
      '& .MuiAutocomplete-popper': {
        backgroundColor: 'red',
      },
    },
  });

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function getDuosDatasetValue(option?: DuosDatasetModel) {
  return option ? `${option.identifier} - ${option.name}` : '';
}

interface SnapshotOverviewPanelProps extends WithStyles<typeof styles> {
  authDomains: Array<string>;
  dispatch: AppDispatch;
  pendingSave: SnapshotPendingSave;
  snapshot: SnapshotModel;
  userRoles: Array<string>;
  duosDatasets: Array<DuosDatasetModel>;
  duosDatasetsLoading: boolean;
}

function SnapshotOverviewPanel(props: SnapshotOverviewPanelProps) {
  const [value, setValue] = useState(0);
  const {
    authDomains,
    classes,
    dispatch,
    duosDatasets,
    duosDatasetsLoading,
    pendingSave,
    snapshot,
    userRoles,
  } = props;
  const isSteward = userRoles.includes(SnapshotRoles.STEWARD);
  const canViewJournalEntries = isSteward;
  // @ts-ignore
  const sourceDataset = snapshot.source[0].dataset;
  const linkToBq = snapshot.cloudPlatform === 'gcp';
  const duosDatasetsLoaded = !_.isEmpty(duosDatasets);

  const selectedDuosDataset = duosDatasets.find(
    (ds) => ds.identifier === snapshot.duosFirecloudGroup?.duosId,
  );
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let duosInfoButtonText =
    'Link with a DUOS dataset ID to automatically sync DAC approved users as snapshot readers.';
  if (isSteward && duosDatasetsLoaded) {
    duosInfoButtonText += ' Modifying this link may take several seconds to save.';
  } else if (!duosDatasetsLoaded) {
    duosInfoButtonText +=
      ' You do not appear to have access to any DUOS datasets.  You must have access to at least one in order to link a snapshot to a DUOS dataset.';
  }

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
              isPendingSave={pendingSave.description}
              updateFieldValueFn={(text: string | undefined) =>
                dispatch(patchSnapshot(snapshot.id, { description: text }))
              }
              useMarkdown={true}
            />
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
            {!(duosDatasetsLoaded || duosDatasetsLoading) &&
              renderTextFieldValue(
                'DUOS Dataset',
                snapshot.duosFirecloudGroup?.duosId,
                duosInfoButtonText,
              )}
            {duosDatasetsLoaded && !duosDatasetsLoading && (
              <>
                <Typography variant="h6">
                  DUOS Dataset:
                  <InfoHoverButton infoText={duosInfoButtonText} fieldName="DUOS ID" />
                </Typography>
                <Autocomplete
                  data-cy="duos-id-editable-field-view"
                  disabled={pendingSave?.duosDataset}
                  className={classes.duosDropdown}
                  componentsProps={{
                    popper: {
                      style: { width: '600px' },
                      placement: 'bottom-start',
                    },
                  }}
                  options={duosDatasets}
                  // Setting to null instead of undefined if unset to make sure that this is always a controlled component
                  value={selectedDuosDataset ?? null}
                  isOptionEqualToValue={(option, val) => option?.identifier === val?.identifier}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        value: pendingSave?.duosDataset ? 'Saving...' : params.inputProps.value,
                      }}
                      placeholder="DUOS ID"
                    />
                  )}
                  getOptionLabel={getDuosDatasetValue}
                  onChange={(_event: any, change) => {
                    dispatch(updateDuosDataset(snapshot.id, change?.identifier));
                  }}
                  title={
                    pendingSave?.duosDataset
                      ? 'Saving...'
                      : getDuosDatasetValue(selectedDuosDataset)
                  }
                  disablePortal
                />
              </>
            )}
          </Grid>
          <Grid item xs={4}>
            {snapshot.duosFirecloudGroup && (
              <>
                <Typography variant="h6">DUOS Users Last Synced:</Typography>
                <Typography data-cy="snapshot-duos-last-synced">
                  {snapshot.duosFirecloudGroup.lastSynced
                    ? moment(snapshot.duosFirecloudGroup.lastSynced).fromNow()
                    : 'Never'}
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Storage:</Typography>
            {renderStorageResources(sourceDataset)}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Cloud Platform:</Typography>
            {renderCloudPlatforms(sourceDataset)}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Secure Monitoring Enabled?</Typography>
            {sourceDataset.secureMonitoringEnabled ? 'Yes' : 'No'}
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
              isPendingSave={pendingSave.consentCode}
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
          {authDomains.length > 0 && (
            <Grid item xs={9}>
              <DataAccessControlGroup />
            </Grid>
          )}
          <Grid item xs={9}>
            <SnapshotAccess />
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    authDomains: state.snapshots.snapshotAuthDomains,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotOverviewPanel));
