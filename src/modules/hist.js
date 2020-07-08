import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const { go, goBack, push, replace } = history;

export { go, goBack, push, replace };
export default history;
