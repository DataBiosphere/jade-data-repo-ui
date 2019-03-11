import { handleActions } from 'redux-actions';
import _ from 'lodash';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const studies = _.times(5, i => ({
  id: `9c2fb58b-a165-444e-9d60-f96942e85e09${i}`,
  name: 'Evaluation protocol for predicting cancer using GATK 4 predictive blah...',
  description:
    'Research purpose lorem ipsum dolor sit amet consectetur iscing velit. Ube soluta nobis eleifend.',
  modifiedDate: '2019-03-09',
  createdDate: `2019-03-0${i + 1}`,
}));

export default {
  studies: handleActions(
    {
      [ActionTypes.GET_STUDIES_SUCCESS]: (state, action) =>
        immutable(state, {
          studies: { $set: action.payload },
        }),
    },
    studies,
  ),
};
