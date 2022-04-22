import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@mui/styles';
import { exportSnapshot, resetSnapshotExport } from 'actions/index';
import { connect } from 'react-redux';
import {
  Card,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import UserList from './UserList';
import TerraTooltip from './common/TerraTooltip';
import { SnapshotRoles } from '../constants';

const styles = (theme) => ({
  pageTitle: { ...theme.mixins.pageTitle },
  title: {
    color: theme.palette.primary.main,
    fontSize: '44px',
    paddingBottom: theme.spacing(4),
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing(4),
    width: '100%',
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  exportButton: {
    marginTop: '0.5rem',
    height: '36px',
    width: '100%',
  },
  centered: {
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing(2),
  },
  labelRight: {
    paddingLeft: '10px',
  },
  separator: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  viewSnapshotButton: {
    width: '100%',
    marginBottom: '12px',
  },
});

export class OverviewHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exportGsPaths: false,
      isSheetProcessing: false,
      isSheetDone: false,
      sheetUrl: '',
    };
  }

  static propTypes = {
    addReader: PropTypes.func,
    addSteward: PropTypes.func,
    canReadPolicies: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    exportResponse: PropTypes.object,
    isDone: PropTypes.bool,
    isProcessing: PropTypes.bool,
    of: PropTypes.object,
    readers: PropTypes.arrayOf(PropTypes.string),
    removeReader: PropTypes.func,
    removeSteward: PropTypes.func,
    snapshot: PropTypes.object,
    stewards: PropTypes.arrayOf(PropTypes.string).isRequired,
    terraUrl: PropTypes.string,
    user: PropTypes.object,
    userRoles: PropTypes.arrayOf(PropTypes.string),
  };

  exportToWorkspaceCopy = () => {
    const { dispatch, of } = this.props;
    const { exportGsPaths } = this.state;
    dispatch(exportSnapshot(of.id, exportGsPaths));
  };

  resetExport = () => {
    const { dispatch } = this.props;
    dispatch(resetSnapshotExport());
  };

  handleExportGsPathsChanged = () => {
    const { exportGsPaths } = this.state;
    this.setState({
      exportGsPaths: !exportGsPaths,
    });
  };

  createSpreadsheet = async () => {
    const { snapshot } = this.props;
    this.setState({
      isSheetProcessing: true,
    });
    const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
    await window.gapi.client.init({ discoveryDocs: DISCOVERY_DOCS });
    console.log('createSpreadsheet request');
    window.gapi.client.sheets.spreadsheets
      .create({
        properties: {
          title: snapshot.accessInformation.bigQuery.datasetName,
        },
      })
      .then((response) => {
        console.log('Response: ' + response.result.spreadsheetUrl);
        this.setState({
          sheetUrl: response.result.spreadsheetUrl,
        });
        let requests = [];
        // Connect to datasource
        snapshot.accessInformation.bigQuery.tables.forEach((table) => {
          requests.push({
            addDataSource: {
              dataSource: {
                spec: {
                  bigQuery: {
                    projectId: snapshot.accessInformation.bigQuery.projectId,
                    querySpec: {
                      rawQuery: table.sampleQuery, // Need to build own query so not limited to 1k rows
                    },
                  },
                },
              },
            },
          });
        });
        const batchUpdateRequest = { requests: requests };

        window.gapi.client.sheets.spreadsheets
          .batchUpdate({
            spreadsheetId: response.result.spreadsheetId,
            resource: batchUpdateRequest,
          })
          .then((response2) => {
            console.log('after batch update');
          });
        this.setState({
          isSheetProcessing: false,
          isSheetDone: true,
        });
      });
    // TODO: Handle error case
  };

  resetSpreadsheet = () => {
    this.setState({
      isSheetProcessing: false,
      isSheetDone: false,
      spreadsheetUrl: '',
    });
  };

  render() {
    const {
      addSteward,
      addReader,
      canReadPolicies,
      classes,
      isProcessing,
      isDone,
      exportResponse,
      of,
      readers,
      removeSteward,
      removeReader,
      stewards,
      terraUrl,
      userRoles,
      user,
    } = this.props;
    const { exportGsPaths, isSheetDone, isSheetProcessing, sheetUrl } = this.state;
    const loading = _.isNil(of) || _.isEmpty(of);
    const canManageUsers = userRoles.includes(SnapshotRoles.STEWARD);

    const linkToBq = of.accessInformation?.bigQuery !== undefined;
    const consoleLink = linkToBq
      ? `${of.accessInformation.bigQuery.link}&authuser=${user?.email}`
      : '';
    const gsPathsCheckbox = !isProcessing ? (
      <Checkbox checked={exportGsPaths} onChange={this.handleExportGsPathsChanged} />
    ) : (
      <Checkbox checked={exportGsPaths} disabled />
    );

    return (
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item zeroMinWidth xs={6}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Fragment>
              <Typography noWrap variant="h3" className={classes.pageTitle}>
                {of.name}
              </Typography>
              <Typography>{of.description}</Typography>
            </Fragment>
          )}
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container>
                <Grid item xs={6}>
                  <span className={classes.header}> Date Created:</span>
                  <span className={classes.values}> {moment(of.createdDate).fromNow()}</span>
                  <p className={classes.header}> Storage:</p>
                  <ul>
                    {of.source[0].dataset.storage.map((storageResource) => (
                      <li key={storageResource.cloudResource}>
                        {storageResource.cloudResource}: {storageResource.region}
                      </li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={6}>
                  {linkToBq && (
                    <TerraTooltip title="Click to navigate to the Google BigQuery console where you can perform more advanced queries against your snapshot tables">
                      <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        className={classes.button}
                        endIcon={<Launch />}
                      >
                        <a target="_blank" rel="noopener noreferrer" href={consoleLink}>
                          View in Google Console
                        </a>
                      </Button>
                    </TerraTooltip>
                  )}
                </Grid>
                <Link to={`/snapshots/${of.id}/data`}>
                  <Button
                    className={classes.viewSnapshotButton}
                    color="primary"
                    variant="outlined"
                    disableElevation
                  >
                    View Snapshot
                  </Button>
                </Link>
              </Grid>
            )}
            {stewards && canReadPolicies && (
              <UserList
                typeOfUsers="Stewards"
                users={stewards}
                addUser={addSteward}
                removeUser={removeSteward}
                canManageUsers={canManageUsers}
              />
            )}
            {readers && canReadPolicies && (
              <UserList
                typeOfUsers="Readers"
                users={readers}
                addUser={addReader}
                removeUser={removeReader}
                canManageUsers={canManageUsers}
              />
            )}
            <Divider className={classes.separator} />
            <Typography variant="h6" className={classes.section}>
              Create a Google Sheet linked to BQ Dataset
            </Typography>
            {!isSheetProcessing && !isSheetDone && (
              <TerraTooltip title="Creating a google sheet means that you will get a read-only copy of Tabular data in a google sheet">
                <Button
                  onClick={this.createSpreadsheet}
                  className={classes.exportButton}
                  variant="outlined"
                  color="primary"
                >
                  Create Google Sheet
                </Button>
              </TerraTooltip>
            )}
            {isSheetProcessing && !isSheetDone && (
              <Button className={classes.exportButton} variant="outlined" color="primary">
                <CircularProgress size={25} />
                <div className={classes.labelRight}>Preparing Google Sheet</div>
              </Button>
            )}
            {!isSheetProcessing && isSheetDone && (
              <Button
                className={classes.exportButton}
                onClick={this.resetSpreadsheet}
                variant="contained"
                color="primary"
                endIcon={<Launch />}
                disableElevation
              >
                <a target="_blank" rel="noopener noreferrer" href={sheetUrl}>
                  Open Google Sheet
                </a>
              </Button>
            )}
            <Divider className={classes.separator} />
            <Typography variant="h6" className={classes.section}>
              Export a copy of the snapshot metadata to an existing or new Terra workspace
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={gsPathsCheckbox}
                label="Convert DRS URLs to Google Cloud Storage Paths (gs://...)"
              />
              <FormHelperText>
                <i>
                  <b>Note: </b> gs-paths can change over time
                </i>
              </FormHelperText>
            </FormGroup>
            {!isProcessing && !isDone && (
              <TerraTooltip title="Exporting a snapshot to a workspace means that all members of your workspace will be able to have read only access to the tables and files in the snapshot">
                <Button
                  onClick={this.exportToWorkspaceCopy}
                  className={classes.exportButton}
                  variant="outlined"
                  color="primary"
                >
                  Export snapshot
                </Button>
              </TerraTooltip>
            )}
            {isProcessing && !isDone && (
              <Button className={classes.exportButton} variant="outlined" color="primary">
                <CircularProgress size={25} />
                <div className={classes.labelRight}>Preparing snapshot</div>
              </Button>
            )}
            {!isProcessing && isDone && (
              <Button
                onClick={this.resetExport}
                className={classes.exportButton}
                variant="contained"
                color="primary"
                disableElevation
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${terraUrl}#import-data?url=${window.location.origin}&snapshotId=${of.id}&format=tdrexport&snapshotName=${of.name}&tdrmanifest=${exportResponse.format.parquet.manifest}`}
                >
                  Snapshot ready - continue
                </a>
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    isProcessing: state.snapshots.exportIsProcessing,
    isDone: state.snapshots.exportIsDone,
    exportResponse: state.snapshots.exportResponse,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(OverviewHeader));
