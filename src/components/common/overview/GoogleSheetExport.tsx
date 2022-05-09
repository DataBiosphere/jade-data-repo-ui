import React from 'react';
import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import { Button, CircularProgress, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';

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

type SnapshotGoogleSheetProps = {
  classes: ClassNameMap;
  buttonLabel: string;
  handleCreateGoogleSheet: () => void;
  isSheetProcessing: boolean;
  isSheetDone: boolean;
  resetCreate: () => void;
  sheetUrl: string;
};

function GoogleSheetExport(props: SnapshotGoogleSheetProps) {
  const {
    classes,
    buttonLabel,
    handleCreateGoogleSheet,
    isSheetProcessing,
    isSheetDone,
    resetCreate,
    sheetUrl,
  } = props;

  return (
    <div>
      <Typography variant="h6" className={classes.section}>
        With Connected Sheets, you can access, analyze, visualize and share many rows of BigQuery
        data from your Sheets spreadsheet. The Google Sheet will be saved to your Google drive.
      </Typography>
      {!isSheetProcessing && !isSheetDone && (
        <Button
          data-cy="export-snapshot-button"
          onClick={handleCreateGoogleSheet}
          className={classes.exportButton}
          variant="outlined"
          color="primary"
        >
          {buttonLabel}
        </Button>
      )}
      {isSheetProcessing && !isSheetDone && (
        <Button
          data-cy="preparing-snapshot-button"
          className={classes.exportButton}
          variant="outlined"
          color="primary"
        >
          <CircularProgress size={25} />
          <div className={classes.labelRight}>Preparing Google Sheet</div>
        </Button>
      )}
      {!isSheetProcessing && isSheetDone && (
        <Button
          data-cy="snapshot-export-ready-button"
          onClick={resetCreate}
          className={classes.exportButton}
          variant="contained"
          color="primary"
        >
          <a target="_blank" rel="noopener noreferrer" href={sheetUrl}>
            Google Sheet ready - continue
          </a>
        </Button>
      )}
    </div>
  );
}

export default withStyles(styles)(GoogleSheetExport);
