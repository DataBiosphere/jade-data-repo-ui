import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { JournalEntryModel } from 'generated/tdr';

import { ActionTypes } from '../constants';

export interface JournalState {
  journals: Array<JournalEntryModel>;
  journalsLoading: boolean;
}

export interface JournalResultError {
  message?: string;
  detail?: string[];
}

export const initialJournalState: JournalState = {
  journals: [],
  journalsLoading: false,
};

export default {
  journals: handleActions(
    {
      [ActionTypes.GET_JOURNALS]: (state) =>
        immutable(state, {
          journalsLoading: { $set: true },
        }),
      [ActionTypes.GET_JOURNALS_FAILURE]: (state) =>
        immutable(state, {
          journals: { $set: [] },
          journalsLoading: { $set: false },
        }),
      [ActionTypes.GET_JOURNALS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          journals: { $set: action.journals.data.data },
          journalsLoading: { $set: false },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialJournalState,
    },
    initialJournalState,
  ),
};
