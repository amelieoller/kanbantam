import update from 'immutability-helper';
import * as R from 'ramda';

import {
  SET_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
} from '_actions/categories';

import { LOGOUT_USER } from '_actions/user';

export function category(
  state = {
    completed: false,
  },
  action,
) {
  switch (action.type) {
    case ADD_CATEGORY:
      return action.category;
    case UPDATE_CATEGORY:
      return { ...state, ...action.category };
    default:
      return state;
  }
}

export default function categories(state = [], action) {
  const index = R.findIndex(R.propEq('id', action.id), state);
  const updatedAtIndex = { $splice: [[index, 1, category(state[index], action)]] };

  switch (action.type) {
    case SET_CATEGORIES:
      return update(state, { $set: action.categories });
    case ADD_CATEGORY:
      return update(state, { $push: [category(undefined, action)] });
    case UPDATE_CATEGORY:
      return update(state, updatedAtIndex);
    case REMOVE_CATEGORY:
      return update(state, { $splice: [[index, 1]] });
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
