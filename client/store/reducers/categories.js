import update from 'immutability-helper';

import {
  SET_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  UPDATE_CATEGORY_ID,
} from '_actions/categories';
import { LOGOUT_USER } from '_actions/user';
import { byIdReplaceAtIndex } from '_utils/filtering';

export default function categories(state = [], action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return update(state, { $set: action.payload });
    case ADD_CATEGORY:
      return [...state, action.payload];
    case UPDATE_CATEGORY:
      return byIdReplaceAtIndex(state, action.payload.id, action.payload);
    case UPDATE_CATEGORY_ID:
      return byIdReplaceAtIndex(state, action.payload.id, { id: action.newId });
    case REMOVE_CATEGORY:
      return state.filter((category) => category.id !== action.payload.id);
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
