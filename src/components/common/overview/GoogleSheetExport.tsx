import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import { Button, CircularProgress, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { AccessInfoBigQueryModel } from 'generated/tdr';
import {
  addBQSources,
  cleanupSheet,
  createSheet,
  deleteSpreadsheetOnFailure,
  SheetInfo,
  SpreadsheetInfo,
} from 'modules/googlesheets';
import { TdrState } from '../../../reducers';

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
    buttonText: {
      color: theme.palette.common.white,
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

type GoogleSheetProps = {
  classes: ClassNameMap;
  buttonLabel: string;
  bigQueryAccessInfo: AccessInfoBigQueryModel | undefined;
  token: string;
};

function GoogleSheetExport(props: GoogleSheetProps) {
  const { classes, buttonLabel, bigQueryAccessInfo, token } = props;
  const [isSheetProcessing, setIsSheetProcessing] = useState(false);
  const [isSheetDone, setIsSheetDone] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');

  const resetCreate = () => {
    setIsSheetProcessing(false);
    setIsSheetDone(false);
  };

  const handleCreateGoogleSheet = async () => {
    if (bigQueryAccessInfo) {
      setIsSheetProcessing(true);
      const response: SpreadsheetInfo = await createSheet(bigQueryAccessInfo.datasetName, token);
      if (response?.spreadsheetId == null) {
        resetCreate();
      } else {
        setSheetUrl(response.spreadsheetUrl);
        const sheets: SheetInfo[] = await addBQSources(
          response.spreadsheetId,
          bigQueryAccessInfo,
          token,
        );
        // If no BQ sources added to sheets object, then something errored.
        if (sheets.length > 0) {
          await cleanupSheet(response.spreadsheetId, sheets, token);
          setIsSheetProcessing(false);
          setIsSheetDone(true);
        } else {
          deleteSpreadsheetOnFailure(response.spreadsheetId, token);
          resetCreate();
        }
      }
    }
  };

  return (
    <div>
      <Typography variant="h6" className={classes.section}>
        Export to Google Connected Sheets
      </Typography>
      <Typography variant="body1" className={classes.section}>
        With Connected Sheets, you can access, analyze, visualize and share many rows of BigQuery
        data from your Sheets spreadsheet. The Google Sheet will be saved to your Google drive.
      </Typography>
      {!isSheetProcessing && !isSheetDone && (
        <Button
          data-cy="export-google-sheet-button"
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
          data-cy="preparing-google-sheet-button"
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
          data-cy="google-sheet-export-ready-button"
          className={classes.exportButton}
          color="primary"
          href={sheetUrl}
          onClick={resetCreate}
          target="_blank"
          variant="contained"
        >
          <span className={classes.buttonText}> Google Sheet ready - continue</span>
        </Button>
      )}
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    token: state.user.delegateToken,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(GoogleSheetExport));
