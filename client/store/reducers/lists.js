import update from 'immutability-helper';
import * as R from 'ramda';

import { SET_LISTS, ADD_LIST, UPDATE_LIST, REMOVE_LIST } from '_actions/lists';

import { LOGOUT_USER } from '_actions/user';

export function list(state = {}, action) {
  switch (action.type) {
    case ADD_LIST:
      return update(state, {
        id: { $set: action.id },
        title: { $set: action.title },
        createdAt: { $set: action.createdAt },
      });
    case UPDATE_LIST:
      return update(state, {
        title: { $set: action.title },
        updatedAt: { $set: action.updatedAt },
      });
    default:
      return state;
  }
}

export default function lists(state = [], action) {
  const index = R.findIndex(R.propEq('id', action.id), state);
  const updatedAtIndex = { $splice: [[index, 1, list(state[index], action)]] };

  switch (action.type) {
    case SET_LISTS:
      return update(state, { $set: action.lists });
    case ADD_LIST:
      return update(state, { $push: [list(undefined, action)] });
    case UPDATE_LIST:
      return update(state, updatedAtIndex);
    case REMOVE_LIST:
      return update(state, { $splice: [[index, 1]] });
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
