import { handleActions } from 'redux-actions';

//import { ActionTypes } from 'constants/index';

export const studies = _.times(5, () => {
  return {
    id: '9c2fb58b-a165-444e-9d60-f96942e85e09',
    name: 'Evaluation protocol for predicting cancer using GATK 4 predictive blah...',
    description:
      'Research purpose lorem ipsum dolor sit amet consectetur iscing velit. Ube soluta nobis eleifend.',
    modifiedDate: '2019-03-09',
    createdDate: '2019-03-04',
  };
});

export default {
  studies: handleActions({}, studies),
};
