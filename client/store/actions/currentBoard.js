export const SET_BOARD = 'SET_BOARD';
export const CLEAR_BOARD = 'CLEAR_BOARD';

export const setBoard = (board) => ({
  type: SET_BOARD,
  board,
});

export const clearBoard = () => ({
  type: CLEAR_BOARD,
});
