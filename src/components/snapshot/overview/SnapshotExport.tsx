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
import TerraTooltip from '../../common/TerraTooltip';
import { exportSnapshot, resetSnapshotExport } from '../../../actions';
import { TdrState } from '../../../reducers';
import { AppDispatch } from '../../../store';
import { SnapshotExportResponseModel, SnapshotModel } from '../../../generated/tdr';

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
      width: '100%',
    },
    centered: {
      textAlign: 'center',
    },
    labelRight: {
      paddingLeft: '10px',
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
};

const formatExportUrl = (
  terraUrl: string,
  window: string,
  snapshot: SnapshotModel,
  manifest: string,
) => `${terraUrl}#import-data?url=${window}
    &snapshotId=${snapshot.id}
    &format=tdrexport
    &snapshotName=${snapshot.name}
    &tdrmanifest=${manifest}`;

function SnapshotExport(props: SnapshotExportProps) {
  const [exportGsPaths, setExportGsPaths] = React.useState(false);
  const { classes, dispatch, exportResponse, isDone, isProcessing, of, terraUrl } = props;
  const exportResponseManifest =
    exportResponse &&
    exportResponse.format &&
    exportResponse.format.parquet &&
    exportResponse.format.parquet.manifest;

  const handleExportGsPathsChanged = () => {
    setExportGsPaths(!exportGsPaths);
  };

  const exportToWorkspaceCopy = () => {
    dispatch(exportSnapshot(of.id, exportGsPaths));
  };

  const resetExport = () => {
    dispatch(resetSnapshotExport());
  };

  const gsPathsCheckbox = !isProcessing ? (
    <Checkbox checked={exportGsPaths} onChange={handleExportGsPathsChanged} />
  ) : (
    <Checkbox checked={exportGsPaths} disabled />
  );

  return (
    <div>
      <Typography variant="h6" className={classes.section}>
        Export a copy of the snapshot metadata to an existing or new Terra workspace
      </Typography>
      <FormGroup>
        <FormControlLabel
          data-cy="gs-paths-checkbox"
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
            data-cy="export-snapshot-button"
            onClick={exportToWorkspaceCopy}
            className={classes.exportButton}
            variant="outlined"
            color="primary"
          >
            Export snapshot
          </Button>
        </TerraTooltip>
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
            href={formatExportUrl(terraUrl, window.location.origin, of, exportResponseManifest)}
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
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotExport));
