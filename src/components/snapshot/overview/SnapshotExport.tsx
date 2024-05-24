import React from 'react';
import { connect } from 'react-redux';
import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
} from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { exportSnapshot, resetSnapshotExport } from '../../../actions';
import { TdrState } from '../../../reducers';
import { AppDispatch } from '../../../store';
import { CloudPlatform, SnapshotExportResponseModel, SnapshotModel } from '../../../generated/tdr';
import { SnapshotRoles } from '../../../constants';

const styles = (theme: CustomTheme) =>
  createStyles({
    card: {
      display: 'inline-block',
      padding: theme.spacing(4),
      width: '100%',
    },
    exportButton: {
      marginTop: '0.5rem',
      height: '36px',
    },
    centered: {
      textAlign: 'center',
    },
    labelRight: {
      paddingLeft: '10px',
    },
    section: {
      paddingBottom: theme.spacing(1),
    },
  });

type SnapshotExportProps = {
  classes: ClassNameMap;
  dispatch: AppDispatch;
  exportResponse: SnapshotExportResponseModel;
  isDone: boolean;
  isProcessing: boolean;
  of: SnapshotModel;
  terraUrl: string | undefined;
  userRoles: Array<string>;
};

const formatExportUrl = (
  terraUrl: string,
  window: string,
  snapshot: SnapshotModel,
  manifest: string,
  tdrSyncPermissions: boolean,
) =>
  `${terraUrl}#import-data?url=${window}&snapshotId=${snapshot.id}&format=tdrexport&snapshotName=${
    snapshot.name
  }&tdrmanifest=${encodeURIComponent(manifest)}&tdrSyncPermissions=${tdrSyncPermissions}`;

function SnapshotExport(props: SnapshotExportProps) {
  const {
    classes,
    dispatch,
    exportResponse,
    isDone,
    isProcessing,
    of,
    terraUrl,
    userRoles,
  } = props;
  const exportResponseManifest = exportResponse?.format?.parquet?.manifest;

  const [exportGsPaths, setExportGsPaths] = React.useState(false);
  const handleExportGsPathsChanged = () => {
    setExportGsPaths(!exportGsPaths);
  };

  const canSyncPermissions = userRoles.includes(SnapshotRoles.STEWARD);
  const [tdrSyncPermissions, setTdrSyncPermissions] = React.useState(canSyncPermissions);
  const handleTdrSyncPermissionsChanged = () => {
    setTdrSyncPermissions(!tdrSyncPermissions);
  };

  const exportToWorkspaceCopy = () => {
    const validatePrimaryKeyUniqueness = of.cloudPlatform === CloudPlatform.Gcp;
    dispatch(exportSnapshot(of.id, exportGsPaths, validatePrimaryKeyUniqueness));
  };

  const resetExport = () => {
    dispatch(resetSnapshotExport());
  };

  return (
    <div>
      <Typography variant="h6" className={classes.section}>
        Export to Terra
      </Typography>
      {of.cloudPlatform === CloudPlatform.Azure && (
        <Typography variant="h6" className={classes.section} data-cy="azure-warning-note">
          Note: Azure snapshot import into Terra is not yet fully supported.
        </Typography>
      )}
      <Typography variant="body1" className={classes.section}>
        Export a copy of the snapshot metadata to a new or existing Terra workspace
      </Typography>
      {of.cloudPlatform === CloudPlatform.Gcp && (
        <FormGroup>
          <FormControlLabel
            data-cy="gs-paths-checkbox"
            control={
              <Checkbox
                checked={exportGsPaths}
                onChange={handleExportGsPathsChanged}
                disabled={isProcessing}
              />
            }
            label="Convert DRS URLs to Google Cloud Storage Paths (gs://...)"
          />
        </FormGroup>
      )}
      <FormGroup>
        <FormControlLabel
          data-cy="tdr-sync-permissions-checkbox"
          control={
            <Checkbox
              checked={tdrSyncPermissions}
              onChange={handleTdrSyncPermissionsChanged}
              disabled={!canSyncPermissions || isProcessing}
            />
          }
          label="Add workspace policy groups to snapshot readers"
        />
        <FormHelperText>
          <i>This will grant workspace members read access to the snapshot's tables and files</i>
        </FormHelperText>
      </FormGroup>
      {!isProcessing && !isDone && (
        <Button
          data-cy="export-snapshot-button"
          onClick={exportToWorkspaceCopy}
          className={classes.exportButton}
          variant="outlined"
          color="primary"
        >
          Export snapshot
        </Button>
      )}
      {isProcessing && !isDone && (
        <Button
          data-cy="preparing-snapshot-button"
          className={classes.exportButton}
          variant="outlined"
          color="primary"
        >
          <CircularProgress size={25} />
          <div className={classes.labelRight}>Preparing snapshot</div>
        </Button>
      )}
      {!isProcessing && isDone && terraUrl && exportResponseManifest && (
        <Button
          data-cy="snapshot-export-ready-button"
          onClick={resetExport}
          className={classes.exportButton}
          variant="contained"
          color="primary"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={formatExportUrl(
              terraUrl,
              window.location.origin,
              of,
              exportResponseManifest,
              tdrSyncPermissions,
            )}
          >
            Snapshot ready - continue
          </a>
        </Button>
      )}
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    isProcessing: state.snapshots.exportIsProcessing,
    isDone: state.snapshots.exportIsDone,
    exportResponse: state.snapshots.exportResponse,
    terraUrl: state.configuration.configObject.terraUrl,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotExport));
