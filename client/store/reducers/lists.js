import update from 'immutability-helper';

import { SET_LISTS, ADD_LIST, UPDATE_LIST, REMOVE_LIST, UPDATE_LIST_ID } from '_actions/lists';
import { LOGOUT_USER } from '_actions/user';
import { byIdReplaceAtIndex } from '_utils/filtering';

export default function lists(state = [], action) {
  switch (action.type) {
    case SET_LISTS:
      return update(state, { $set: action.payload });
    case ADD_LIST:
      return [...state, action.payload];
    case UPDATE_LIST:
      return byIdReplaceAtIndex(state, action.payload.id, action.payload);
    case UPDATE_LIST_ID:
      return byIdReplaceAtIndex(state, action.payload.id, { id: action.newId });
    case REMOVE_LIST:
      return state.filter((todo) => todo.id !== action.payload.id);
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
