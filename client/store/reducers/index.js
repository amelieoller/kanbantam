import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { reducer as alerts } from 'react-notification-system-redux';
import user from './user';
import todos from './todos';
import boards from './boards';
import board from './board';
import lists from './lists';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    alerts,
    user,
    todos,
    boards,
    board,
    lists,
  });

export default createRootReducer;
