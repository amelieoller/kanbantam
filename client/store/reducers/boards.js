import update from 'immutability-helper';

import {
  SET_BOARDS,
  ADD_BOARD,
  UPDATE_BOARD,
  REMOVE_BOARD,
  UPDATE_BOARD_ID,
} from '_actions/boards';

import { CLEAR_DATA } from '_actions/user';
import { byIdReplaceAtIndex } from '_utils/filtering';

export default function boards(state = [], action) {
  switch (action.type) {
    case SET_BOARDS:
      return update(state, { $set: action.payload });
    case ADD_BOARD:
      return [...state, action.payload];
    case UPDATE_BOARD:
      return byIdReplaceAtIndex(state, action.payload.id, action.payload);
    case UPDATE_BOARD_ID:
      return byIdReplaceAtIndex(state, action.payload.oldId, action.payload.board);
    case REMOVE_BOARD:
      return state.filter((todo) => todo.id !== action.payload.id);
    case CLEAR_DATA:
      return [];
    default:
      return state;
  }
}
