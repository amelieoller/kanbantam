import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import optimist from 'redux-optimist';

import { reducer as alerts } from 'react-notification-system-redux';
import user from './user';
import todos from './todos';
import boards from './boards';
import lists from './lists';
import categories from './categories';
import currentBoard from './currentBoard';
import currentTodo from './currentTodo';
import status from './status';

const createRootReducer = (history) =>
  optimist(
    combineReducers({
      router: connectRouter(history),
      alerts,
      user,
      todos,
      boards,
      lists,
      categories,
      currentBoard,
      currentTodo,
      status,
    }),
  );

export default createRootReducer;
