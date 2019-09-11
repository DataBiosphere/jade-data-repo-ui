// @flow
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

import qs from 'qs';

const history = createBrowserHistory();

history.location = {
  ...history.location,
  query: qs.parse(history.location.search.substr(1)),
  state: {},
};

ReactGA.initialize('UA-147471357-1');

history.listen(() => {
  history.location = {
    ...history.location,
    query: qs.parse(history.location.search.substr(1)),
    state: history.location.state || {},
  };
  ReactGA.pageview(history.location.pathname);
});

const { go, goBack, push, replace } = history;

export { go, goBack, push, replace };
export default history;
