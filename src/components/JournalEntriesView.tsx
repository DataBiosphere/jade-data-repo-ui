import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { TdrState } from 'reducers';
import { JournalEntryModel, IamResourceTypeEnum } from 'generated/tdr';
import { getJournalEntries } from 'actions/index';
import JournalEntryTable from './table/JournalEntryTable';

const styles = () =>
  createStyles({
    className: {
      color: 'red',
    },
  } as const);

interface JournalEntriesViewProps extends WithStyles<typeof styles> {
  id: string;
  resourceType: IamResourceTypeEnum;
  journalEntries: JournalEntryModel[];
  loading: boolean;
  refreshCnt: number;
  dispatch: Dispatch<Action>;
}

function JournalEntriesView({
  id,
  resourceType,
  journalEntries,
  loading,
  refreshCnt,
  dispatch,
}: JournalEntriesViewProps) {
  const handleFilterJournalEntries = (limit: number, offset: number) => {
    dispatch(getJournalEntries({ id, resourceType, limit, offset }));
  };

  return (
    <JournalEntryTable
      journalEntries={journalEntries}
      handleFilterJournalEntries={handleFilterJournalEntries}
      loading={loading}
      refreshCnt={refreshCnt}
    />
  );
}

function mapStateToProps(state: TdrState) {
  return {
    journalEntries: state.journals.journalEntries,
    loading: state.journals.journalEntriesLoading,
    refreshCnt: state.journals.journalEntriesRefreshCnt,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JournalEntriesView));
