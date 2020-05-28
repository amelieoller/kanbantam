import update from 'immutability-helper';
import * as R from 'ramda';

import { SET_BOARDS, ADD_BOARD, UPDATE_BOARD, REMOVE_BOARD } from '_actions/boards';

import { LOGOUT_USER } from '_actions/user';

export function board(state = {}, action) {
  switch (action.type) {
    case ADD_BOARD:
      return action.board;
    case UPDATE_BOARD:
      return { ...state, ...action.board };
    default:
      return state;
  }
}

export default function boards(state = [], action) {
  const index = R.findIndex(R.propEq('id', action.id), state);
  const updatedAtIndex = { $splice: [[index, 1, board(state[index], action)]] };

  switch (action.type) {
    case SET_BOARDS:
      return update(state, { $set: action.boards });
    case ADD_BOARD:
      return update(state, { $push: [board(undefined, action)] });
    case UPDATE_BOARD:
      return update(state, updatedAtIndex);
    case REMOVE_BOARD:
      return update(state, { $splice: [[index, 1]] });
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
