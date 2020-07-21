import { SET_CURRENT_BOARD, CLEAR_CURRENT_BOARD } from '_actions/currentBoard';
import { CLEAR_DATA } from '_actions/user';

function currentBoard(state = {}, action) {
  switch (action.type) {
    case SET_CURRENT_BOARD:
      return action.board;
    case CLEAR_CURRENT_BOARD:
      return {};
    case CLEAR_DATA:
      return {};
    default:
      return state;
  }
}

export default currentBoard;
