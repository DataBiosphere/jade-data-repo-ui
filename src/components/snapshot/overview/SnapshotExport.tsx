import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
} from '@mui/material';
import { exportSnapshot, resetSnapshotExport } from '../../../actions';
import { TdrState } from '../../../reducers';
import { AppDispatch } from '../../../store';
import { CloudPlatform, SnapshotExportResponseModel, SnapshotModel } from '../../../generated/tdr';
import { SnapshotRoles } from '../../../constants';

interface SnapshotExportProps {
  readonly dispatch: AppDispatch;
  readonly exportResponse: SnapshotExportResponseModel;
  readonly isDone: boolean;
  readonly isProcessing: boolean;
  readonly of: SnapshotModel;
  readonly terraUrl: string | undefined;
  readonly userRoles: Array<string>;
}

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

function SnapshotExport({
  dispatch,
  exportResponse,
  isDone,
  isProcessing,
  of,
  terraUrl,
  userRoles,
}: SnapshotExportProps) {
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
    <Box
      sx={{
        display: 'inline-block',
        width: '100%',
      }}
    >
      <Typography variant="h6" sx={{ paddingBottom: 1 }}>
        Export to Terra
      </Typography>
      {of.cloudPlatform === CloudPlatform.Azure && (
        <Typography variant="h6" sx={{ paddingBottom: 1 }} data-cy="azure-warning-note">
          Note: Azure snapshot import into Terra is not yet fully supported.
        </Typography>
      )}
      <Typography variant="body1" sx={{ paddingBottom: 1 }}>
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
          sx={{ marginTop: '0.5rem', height: '36px' }}
          variant="outlined"
          color="primary"
        >
          Export snapshot
        </Button>
      )}
      {isProcessing && !isDone && (
        <Button
          data-cy="preparing-snapshot-button"
          sx={{ marginTop: '0.5rem', height: '36px' }}
          variant="outlined"
          color="primary"
        >
          <CircularProgress size={25} />
          <Box sx={{ paddingLeft: '10px' }}>Preparing snapshot</Box>
        </Button>
      )}
      {!isProcessing && isDone && terraUrl && exportResponseManifest && (
        <Button
          data-cy="snapshot-export-ready-button"
          onClick={resetExport}
          sx={{ marginTop: '0.5rem', height: '36px' }}
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
    </Box>
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

export default connect(mapStateToProps)(SnapshotExport);
