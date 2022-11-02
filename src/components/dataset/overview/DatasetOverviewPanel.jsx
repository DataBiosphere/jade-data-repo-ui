import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Drawer,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { ExpandMore, Close, Info } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { connect } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import { patchDataset } from 'actions';
import GoogleSheetExport from 'components/common/overview/GoogleSheetExport';
import { renderCloudPlatforms, renderStorageResources } from '../../../libs/render-utils';
import InfoViewDatasetAccess from '../data/sidebar/panels/InfoViewDatasetAccess';
import DatasetSnapshotsTable from '../../table/DatasetSnapshotsTable';
import EditableFieldView from '../../EditableFieldView';
import TabPanel from '../../common/TabPanel';
import { DatasetRoles } from '../../../constants';

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
  helpOverlayCloseButton: {
    color: theme.palette.common.link,
  },
  drawer: {
    top: '112px',
    bottom: '0px',
    flexShrink: 0,
    height: 'initial',
    zIndex: 10,
    minWidth: 300,
    width: '40%',
  },
  helpText: {
    padding: 30,
  },
  drawerPosition: {
    position: 'absolute',
  },
  drawerOpen: (props) => ({
    width: props.width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      width: 0,
    },
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    color: theme.palette.primary.main,
  },
  expandIcon: {
    color: theme.palette.primary.main,
  },
  noRelationships: {
    fontStyle: 'italic',
    colorPrimary: theme.palette.error.contrastText,
    color: theme.palette.error.contrastText,
  },
  divider: {
    marginTop: '14px',
    marginBottom: '14px',
  },
});

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
  const { classes, dataset, dispatch, userRoles } = props;
  const linkToBq = dataset.accessInformation?.bigQuery !== undefined;

  const canManageUsers =
    userRoles.includes(DatasetRoles.STEWARD) || userRoles.includes(DatasetRoles.CUSTODIAN);

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
        {linkToBq && (
          <Tab
            label="Export Dataset"
            classes={{ selected: classes.tabSelected }}
            disableFocusRipple
            disableRipple
            {...a11yProps(2)}
          />
        )}
        {canManageUsers && (
          <Tab
            data-cy="roles-tab"
            label="Roles & memberships"
            classes={{ selected: classes.tabSelected }}
            disableFocusRipple
            disableRipple
            {...a11yProps(3)}
          />
        )}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EditableFieldView
              fieldValue={dataset.description}
              fieldName="Description"
              canEdit={userRoles.includes(DatasetRoles.STEWARD)}
              updateFieldValueFn={(text) =>
                dispatch(patchDataset(dataset.id, { description: text }))
              }
              useMarkdown={true}
            />
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
          <Grid item xs={4}>
            <Typography variant="h6">Dataset Id:</Typography>
            <Typography>{dataset.id}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Default Billing Profile Id:</Typography>
            {dataset.defaultProfileId}
          </Grid>
          {dataset.dataProject && (
            <Grid item xs={4}>
              <Typography variant="h6">Google Data Project:</Typography>
              {dataset.dataProject}
            </Grid>
          )}
          {dataset.ingestServiceAccount && (
            <Grid item xs={4}>
              <Typography variant="h6">Ingest Service Account:</Typography>
              <Typography>{dataset.ingestServiceAccount}</Typography>
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
              fieldName="PHS Id"
              canEdit={userRoles.includes(DatasetRoles.STEWARD)}
              updateFieldValueFn={(text) => dispatch(patchDataset(dataset.id, { phsId: text }))}
              useMarkdown={false}
            />
          </Grid>
          {dataset.schema.relationships.length > 0 && (
            <Grid item xs={8}>
              <Accordion defaultExpanded={false}>
                <AccordionSummary
                  expandIcon={<ExpandMore className={classes.expandIcon} />}
                  className={classes.header}
                >
                  Relationships ({dataset.schema.relationships.length ?? 0})
                </AccordionSummary>
                <AccordionDetails data-cy="relationship">
                  {dataset.schema.relationships.length === 0 && (
                    <Typography className={classes.noRelationships}>(None)</Typography>
                  )}
                  {dataset.schema.relationships.map((rel, i) => (
                    <div key={rel.name}>
                      <Typography variant="h6">{rel.name}</Typography>
                      <Typography variant="h6">From</Typography>
                      Table: {rel.from.table}
                      <br />
                      Column: {rel.from.column}
                      <br />
                      <Typography variant="h6">To</Typography>
                      Table: {rel.to.table}
                      <br />
                      Column: {rel.to.column}
                      <br />
                      {i < dataset.schema.relationships.length - 1 && (
                        <Divider className={classes.divider} />
                      )}
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
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
      <TabPanel value={value} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <InfoViewDatasetAccess helpOverlayToggle={toggleHelpOverlay} />
          </Grid>
        </Grid>
      </TabPanel>
      {true && (
        <Drawer
          variant="permanent"
          anchor="right"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isHelpVisible,
            [classes.drawerClose]: !isHelpVisible,
          })}
          classes={{
            paper: clsx(classes.drawer, classes.drawerPosition, {
              [classes.drawerOpen]: isHelpVisible,
              [classes.drawerClose]: !isHelpVisible,
            }),
          }}
          open={isHelpVisible}
        >
          <Grid key="help-drawer" container spacing={1} className={classes.helpText}>
            <Grid item xs={11}>
              {helpTitle}
            </Grid>
            <Grid item xs={1}>
              <IconButton className={classes.helpOverlayCloseButton} onClick={closeHelpOverlay}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              {helpContent}
            </Grid>
          </Grid>
        </Drawer>
      )}
    </div>
  );
}

DatasetOverviewPanel.propTypes = {
  classes: PropTypes.object,
  dataset: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  userRoles: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    dispatch: state.dispatch,
    userRoles: state.datasets.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetOverviewPanel));
