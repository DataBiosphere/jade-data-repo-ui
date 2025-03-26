import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Drawer,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, Close } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { connect } from 'react-redux';
import moment from 'moment';
import { patchDataset } from 'actions';
import GoogleSheetExport from 'components/common/overview/GoogleSheetExport';
import { IamResourceTypeEnum, CloudPlatform } from 'generated/tdr';
import FullViewSnapshotButton from 'components/common/FullViewSnapshotButton';
import {
  renderCloudPlatforms,
  renderStorageResources,
  renderTextFieldValue,
} from '../../../libs/render-utils';
import InfoViewDatasetAccess from '../data/sidebar/panels/InfoViewDatasetAccess';
import DatasetSnapshotsTable from '../../table/DatasetSnapshotsTable';
import EditableFieldView from '../../EditableFieldView';
import TabPanel from '../../common/TabPanel';
import { DatasetRoles } from '../../../constants';
import JournalEntriesView from '../../JournalEntriesView';
import { getCloudPlatform } from '../../../libs/utilsTs';

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !['isVisible'].includes(prop),
})(({ theme, isVisible }) => ({
  top: '112px',
  bottom: '0px',
  flexShrink: 0,
  height: 'initial',
  zIndex: 10,
  minWidth: '300px',
  position: 'absolute',
  width: isVisible ? '40%' : 0,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration[isVisible ? 'enteringScreen' : 'leavingScreen'],
  }),
  overflowX: 'hidden',
  '& .MuiDrawer-paper': {
    top: '112px',
    bottom: '0px',
    flexShrink: 0,
    height: 'initial',
    zIndex: 10,
    minWidth: isVisible ? '300px' : '0px',
    width: isVisible ? '40%' : 0,
    position: 'absolute',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration[isVisible ? 'enteringScreen' : 'leavingScreen'],
    }),
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function DatasetOverviewPanel(props) {
  const [value, setValue] = React.useState(0);
  const [isHelpVisible, setIsHelpVisible] = React.useState(false);
  const [helpTitle, setHelpTitle] = React.useState();
  const [helpContent, setHelpContent] = React.useState();
  const { dataset, dispatch, pendingSave, userRoles } = props;
  const linkToBq = dataset.accessInformation?.bigQuery !== undefined;

  const isSteward = userRoles.includes(DatasetRoles.STEWARD);
  const isCustodian = userRoles.includes(DatasetRoles.CUSTODIAN);
  const canViewJournalEntries = isSteward || isCustodian;
  const canManageUsers = isSteward || isCustodian;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeHelpOverlay = () => {
    setIsHelpVisible(false);
  };

  const toggleHelpOverlay = (title, content) => {
    setIsHelpVisible(!isHelpVisible);
    setHelpTitle(title);
    setHelpContent(content);
  };

  const inheritStewardStringified = (!!dataset.inheritSteward).toString();
  const inheritStewardDisplayText =
    inheritStewardStringified.charAt(0).toUpperCase() + inheritStewardStringified.slice(1);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Dataset Summary" disableFocusRipple disableRipple {...a11yProps(0)} />
        <Tab label="Snapshots" disableFocusRipple disableRipple {...a11yProps(1)} />
        {linkToBq && (
          <Tab label="Export Dataset" disableFocusRipple disableRipple {...a11yProps(2)} />
        )}
        {canViewJournalEntries && (
          <Tab
            data-cy="activity-tab"
            label="Dataset activity"
            disableFocusRipple
            disableRipple
            {...a11yProps(3)}
          />
        )}
        {canManageUsers && (
          <Tab
            data-cy="roles-tab"
            label="Roles & memberships"
            disableFocusRipple
            disableRipple
            {...a11yProps(4)}
          />
        )}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EditableFieldView
              fieldValue={dataset.description}
              fieldName="Description"
              canEdit={isSteward}
              isPendingSave={pendingSave.description}
              updateFieldValueFn={(text) =>
                dispatch(patchDataset(dataset.id, { description: text }))
              }
              useMarkdown={true}
            />
          </Grid>
          <Grid item xs={4}>
            {renderTextFieldValue('Dataset ID', dataset.id)}
          </Grid>
          <Grid item xs={4}>
            {renderTextFieldValue('Default Billing Profile ID', dataset.defaultProfileId)}
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
            <Typography variant="h6">Cloud Platform:</Typography>
            {renderCloudPlatforms(dataset)}
          </Grid>
          <Grid item xs={4}>
            {getCloudPlatform(dataset) === CloudPlatform.Gcp &&
              renderTextFieldValue('Google Data Project', dataset.dataProject)}
            {getCloudPlatform(dataset) === CloudPlatform.Azure &&
              renderTextFieldValue(
                'Azure Storage Account',
                `${dataset.accessInformation?.parquet?.datasetId}`.split('.')[0],
              )}
          </Grid>
          {getCloudPlatform(dataset) === CloudPlatform.Gcp && (
            <Grid item xs={4}>
              {renderTextFieldValue('Ingest Service Account', dataset.ingestServiceAccount)}
            </Grid>
          )}
          <Grid item xs={4}>
            <Typography variant="h6">Secure Monitoring Enabled?</Typography>
            {dataset.secureMonitoringEnabled ? 'Yes' : 'No'}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Self Hosted?</Typography>
            {dataset.selfHosted ? 'Yes' : 'No'}
          </Grid>
          <Grid item xs={4}>
            <EditableFieldView
              fieldValue={dataset.phsId}
              fieldName="PHS ID"
              canEdit={isSteward}
              isPendingSave={pendingSave.phsId}
              infoButtonText="PHS IDs are set for the dataset and are inherited by all child snapshots. The PHS ID is used in conjunction with a consent code, which is set at a snapshot level, to determined if a user is authorized to view a snapshot based on their RAS Passport."
              updateFieldValueFn={(text) => dispatch(patchDataset(dataset.id, { phsId: text }))}
              useMarkdown={false}
            />
          </Grid>
          {dataset.schema.relationships.length > 0 && (
            <Grid item xs={8}>
              <Accordion defaultExpanded={false}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                  sx={{
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: '600',
                    color: 'primary.main',
                  }}
                >
                  Relationships ({dataset.schema.relationships.length ?? 0})
                </AccordionSummary>
                <AccordionDetails data-cy="relationship">
                  {dataset.schema.relationships.length === 0 && (
                    <Typography
                      sx={{
                        fontStyle: 'italic',
                        color: 'error.contrastText',
                      }}
                    >
                      (None)
                    </Typography>
                  )}
                  {dataset.schema.relationships.map((rel, i) => (
                    <div key={rel.name}>
                      <Typography variant="h6">{rel.name}</Typography>
                      <dl>
                        <dt>
                          <Typography variant="h6">From</Typography>
                          <dd>Table: {rel.from.table}</dd>
                          <dd>Column:{rel.from.column}</dd>
                        </dt>
                        <dt>
                          <Typography variant="h6">To</Typography>
                          <dd>
                            Table:
                            {rel.to.table}
                          </dd>
                          <dd>Column: {rel.to.column}</dd>
                        </dt>
                      </dl>
                      {i < dataset.schema.relationships.length - 1 && (
                        <Divider sx={{ marginTop: '14px', marginBottom: '14px' }} />
                      )}
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
          <Grid item xs={4}>
            {renderTextFieldValue(
              'Custodians Inherit Steward roles on Snapshots',
              inheritStewardDisplayText,
              'Custodians added to this dataset will be Stewards on all snapshots created from this dataset',
            )}
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid sx={{ paddingBottom: '14px' }}>
          Use the dataset as is to create a full view snapshot
          <Box component="span" sx={{ marginLeft: 2 }}>
            <FullViewSnapshotButton dataset={dataset} dispatch={dispatch} />
          </Box>
        </Grid>
        <DatasetSnapshotsTable />
      </TabPanel>
      {linkToBq && (
        <TabPanel value={value} index={2}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <GoogleSheetExport
                buttonLabel="Export Dataset to Google Sheets"
                bigQueryAccessInfo={dataset.accessInformation.bigQuery}
              />
            </Grid>
          </Grid>
        </TabPanel>
      )}
      {canViewJournalEntries && (
        <TabPanel value={value} index={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <JournalEntriesView id={dataset.id} resourceType={IamResourceTypeEnum.Dataset} />
            </Grid>
          </Grid>
        </TabPanel>
      )}
      <TabPanel value={value} index={4}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <InfoViewDatasetAccess helpOverlayToggle={toggleHelpOverlay} />
          </Grid>
        </Grid>
      </TabPanel>
      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={isHelpVisible}
        isVisible={isHelpVisible}
      >
        <Grid container spacing={1} sx={{ padding: '30px' }}>
          <Grid item xs={11}>
            {helpTitle}
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={closeHelpOverlay} sx={{ color: 'common.link' }}>
              <Close />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            {helpContent}
          </Grid>
        </Grid>
      </StyledDrawer>
    </Box>
  );
}

DatasetOverviewPanel.propTypes = {
  dataset: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  pendingSave: PropTypes.object,
  userRoles: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    dispatch: state.dispatch,
    pendingSave: state.datasets.pendingSave,
    userRoles: state.datasets.userRoles,
  };
}

export default connect(mapStateToProps)(DatasetOverviewPanel);
