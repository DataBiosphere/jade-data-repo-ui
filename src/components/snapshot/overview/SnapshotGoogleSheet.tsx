import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import { Button, CircularProgress, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import {
  createSheet,
  addBQSources,
  cleanupSheet,
  SpreadsheetInfo,
  SheetInfo,
} from 'modules/googlesheets';
import TerraTooltip from '../../common/TerraTooltip';
import { SnapshotModel } from '../../../generated/tdr';
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
    <div>
      <Typography variant="h6" className={classes.section}>
        Create a new Google Sheet and connect to Big Query Views for Snapshot
      </Typography>
      {!isSheetProcessing && !isSheetDone && (
        <TerraTooltip title="Create new google with connected to big query">
          <Button
            data-cy="export-snapshot-button"
            onClick={handleCreateGoogleSheet}
            className={classes.exportButton}
            variant="outlined"
            color="primary"
          >
            Create Google Sheet
          </Button>
        </TerraTooltip>
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

function mapStateToProps(state: TdrState) {
  return {
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotGoogleSheet));
