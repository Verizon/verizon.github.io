import { createBrowserHistory } from "history";

//  const history = typeof window !== 'undefined' ? createBrowserHistory({forceRefresh:true}) : null;

const history = createBrowserHistory({forceRefresh:true});

export default history;