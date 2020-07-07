import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';
import optimistPromiseMiddleware from 'redux-optimist-promise';

export default function configureStore(history, initialState = {}) {
  const middlewares = [
    routerMiddleware(history),
    thunk,
    optimistPromiseMiddleware({
      throwOnReject: true, // wether to throw when there is an error or not
    }),
  ];

  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({ collapsed: true, diff: true });
    middlewares.push(logger);
  }

  return createStore(
    createRootReducer(history),
    initialState,
    compose(
      applyMiddleware(...middlewares),
      // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // comment out devtools, otherwise app does not work in any browser without the extension installed
    ),
  );
}
