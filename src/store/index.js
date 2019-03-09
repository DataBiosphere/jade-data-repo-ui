import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { createForms } from 'react-redux-form';
import _ from 'lodash';

import rootSaga from 'sagas/index';
import rootReducer from 'reducers/index';
import middleware, { sagaMiddleware } from './middleware';

const initialDatasetState = {
  name: '',
  description: '',
  readers: [],
  study: '',
};

const studies = _.times(10, () => {
  return {
    id: '9c2fb58b-a165-444e-9d60-f96942e85e09',
    name: 'Evaluation protocol for predicting cancer using GATK 4 predictive blah...',
    description:
      'Research purpose lorem ipsum dolor sit amet consectetur iscing velit. Ube soluta nobis eleifend.',
    modifiedDate: new Date('2019-03-09T05:15:00Z'),
    createdDate: new Date('2019-03-04T07:15:00Z'),
  };
});

const state = {
  studies: studies,
};


const reducer = combineReducers({
  ...rootReducer,
  ...createForms({ dataset: initialDatasetState }),
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const configStore = (initialState = {}) => {
  const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(...middleware)));

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(require('reducers/index').default);
    });
  }

  return {
    store,
  };
};

const { store } = configStore();

global.store = store;

export { store };
