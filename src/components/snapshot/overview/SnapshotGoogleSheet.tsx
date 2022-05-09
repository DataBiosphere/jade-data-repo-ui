import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ClassNameMap } from '@mui/styles';
import {
  createSheet,
  addBQSources,
  cleanupSheet,
  // deleteSpreadsheetOnFailure,
  SpreadsheetInfo,
  SheetInfo,
} from 'modules/googlesheets';
import GoogleSheetExport from '../../common/overview/GoogleSheetExport';
import { SnapshotModel } from '../../../generated/tdr';
import { TdrState } from '../../../reducers';

type SnapshotGoogleSheetProps = {
  classes: ClassNameMap;
  of: SnapshotModel;
  token: string;
};

function SnapshotGoogleSheet(props: SnapshotGoogleSheetProps) {
  const { classes, of, token } = props;
  const [isSheetProcessing, setIsSheetProcessing] = useState(false);
  const [isSheetDone, setIsSheetDone] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');

  const handleCreateGoogleSheet = async () => {
    setIsSheetProcessing(true);
    const response: SpreadsheetInfo = await createSheet(of?.name ?? '', token);
    setSheetUrl(response.spreadsheetUrl);
    const sheets: SheetInfo[] = await addBQSources(response.spreadsheetId, of, token);
    // If no BQ sources added to sheets object, then something errored.
    if (sheets.length > 0) {
      await cleanupSheet(response.spreadsheetId, sheets, token);
      setIsSheetProcessing(false);
      setIsSheetDone(true);
    } else {
      // await deleteSpreadsheetOnFailure(response.spreadsheetId, token);
      // reset create sheet button if not successful
      setIsSheetProcessing(false);
      setIsSheetDone(false);
    }
  };

  const resetCreate = () => {
    setIsSheetProcessing(false);
    setIsSheetDone(false);
  };

  return (
    <GoogleSheetExport
      buttonLabel="Export Snapshot to Google Sheets"
      classes={classes}
      handleCreateGoogleSheet={handleCreateGoogleSheet}
      isSheetProcessing={isSheetProcessing}
      isSheetDone={isSheetDone}
      resetCreate={resetCreate}
      sheetUrl={sheetUrl}
    />
  );
}

function mapStateToProps(state: TdrState) {
  return {
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(SnapshotGoogleSheet);
