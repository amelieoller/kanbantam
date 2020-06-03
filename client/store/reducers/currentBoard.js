import { SET_BOARD, CLEAR_BOARD } from '_actions/currentBoard';

function currentBoard(state = {}, action) {
  switch (action.type) {
    case SET_BOARD:
      return action.board;
    case CLEAR_BOARD:
      return {};
    default:
      return state;
  }
}

export default currentBoard;
