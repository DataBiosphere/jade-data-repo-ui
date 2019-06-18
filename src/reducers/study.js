import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const studyState = {
  studies: [],
  study: {},
  studiesCount: 0,
  studyPolicies: [],
};

export default {
  studies: handleActions(
    {
      [ActionTypes.GET_STUDIES_SUCCESS]: (state, action) =>
        immutable(state, {
          studies: { $set: action.studies.data.data.items },
          studiesCount: { $set: action.studies.data.data.total },
        }),
      [ActionTypes.GET_STUDY_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          study: { $set: action.study.data.data },
        }),
      [ActionTypes.GET_STUDY_POLICY_SUCCESS]: (state, action) =>
        immutable(state, {
          studyPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.ADD_CUSTODIAN_TO_STUDY_SUCCESS]: (state, action) =>
        immutable(state, {
          studyPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.REMOVE_CUSTODIAN_FROM_STUDY_SUCCESS]: (state, action) =>
        immutable(state, {
          studyPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.CREATE_DATASET_JOB]: state =>
        immutable(state, {
          study: { $set: {} },
        }),
    },
    studyState,
  ),
};
