import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { JournalEntryModel } from 'generated/tdr';

import { ActionTypes } from '../constants';

export interface JournalState {
  journalEntries: Array<JournalEntryModel>;
  journalEntriesLoading: boolean;
  journalEntriesRefreshCnt: number;
}

export const initialJournalState: JournalState = {
  journalEntries: [],
  journalEntriesLoading: false,
  journalEntriesRefreshCnt: 0,
};

export default {
  journals: handleActions(
    {
      [ActionTypes.GET_JOURNAL_ENTRIES]: (state) =>
        immutable(state, {
          journalEntriesLoading: { $set: true },
        }),
      [ActionTypes.GET_JOURNAL_ENTRIES_FAILURE]: (state) =>
        immutable(state, {
          journalEntries: { $set: [] },
          journalEntriesLoading: { $set: false },
        }),
      [ActionTypes.GET_JOURNAL_ENTRIES_SUCCESS]: (state, action: any) =>
        immutable(state, {
          journalEntries: { $set: action.journalEntries.data.data },
          journalEntriesLoading: { $set: false },
        }),
      [ActionTypes.REFRESH_JOURNAL_ENTRIES]: (state) =>
        immutable(state, {
          journalEntriesRefreshCnt: { $set: state.journalEntriesRefreshCnt + 1 },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialJournalState,
    },
    initialJournalState,
  ),
};
