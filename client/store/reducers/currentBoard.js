import { SET_CURRENT_BOARD, CLEAR_CURRENT_BOARD } from '_actions/currentBoard';
import { LOGOUT_USER } from '_actions/user';

function currentBoard(state = {}, action) {
  switch (action.type) {
    case SET_CURRENT_BOARD:
      return action.board;
    case CLEAR_CURRENT_BOARD:
      return {};
    case LOGOUT_USER:
      return {};
    default:
      return state;
  }
}

export default currentBoard;
