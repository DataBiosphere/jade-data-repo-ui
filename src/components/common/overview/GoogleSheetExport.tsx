import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
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

export const ExportButton = styled(Button)(() => ({
  marginTop: '0.5rem',
  height: '36px',
}));

export const ButtonTextLink = styled('a')(({ theme }) => ({
  color: theme.palette.common.white,
}));

type GoogleSheetProps = {
  buttonLabel: string;
  bigQueryAccessInfo: AccessInfoBigQueryModel | undefined;
  token: string;
};

function GoogleSheetExport(props: GoogleSheetProps) {
  const { buttonLabel, bigQueryAccessInfo, token } = props;
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
      <Typography
        variant="h6"
        sx={{
          paddingBottom: (theme) => theme.spacing(1),
        }}
      >
        Export to Google Connected Sheets
      </Typography>
      <Typography
        variant="body1"
        sx={{
          paddingBottom: (theme) => theme.spacing(1),
        }}
      >
        With Connected Sheets, you can access, analyze, visualize and share many rows of BigQuery
        data from your Sheets spreadsheet. The Google Sheet will be saved to your Google drive.
      </Typography>
      {!isSheetProcessing && !isSheetDone && (
        <ExportButton
          data-cy="export-google-sheet-button"
          onClick={handleCreateGoogleSheet}
          variant="outlined"
          color="primary"
        >
          {buttonLabel}
        </ExportButton>
      )}
      {isSheetProcessing && !isSheetDone && (
        <ExportButton data-cy="preparing-google-sheet-button" variant="outlined" color="primary">
          <CircularProgress size={25} />
          <div style={{ paddingLeft: '10px' }}>Preparing Google Sheet</div>
        </ExportButton>
      )}
      {!isSheetProcessing && isSheetDone && (
        <ExportButton
          data-cy="google-sheet-export-ready-button"
          color="primary"
          onClick={resetCreate}
          variant="contained"
        >
          <ButtonTextLink href={sheetUrl} target="_blank">
            Google Sheet ready - continue
          </ButtonTextLink>
        </ExportButton>
      )}
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    token: state.user.delegateToken,
  };
}

export default connect(mapStateToProps)(GoogleSheetExport);
