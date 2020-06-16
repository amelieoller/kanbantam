import update from 'immutability-helper';

import { SET_TODOS, ADD_TODO, UPDATE_TODO, REMOVE_TODO, UPDATE_TODO_ID } from '_actions/todos';
import { LOGOUT_USER } from '_actions/user';
import { byIdReplaceAtIndex } from '_utils/filtering';

export default function todos(state = [], action) {
  switch (action.type) {
    case SET_TODOS:
      return update(state, { $set: action.payload });
    case ADD_TODO:
      return [...state, action.payload];
    case UPDATE_TODO:
      return byIdReplaceAtIndex(state, action.payload.id, action.payload);
    case UPDATE_TODO_ID:
      return byIdReplaceAtIndex(state, action.payload.id, { id: action.newId });
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.payload.id);
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
