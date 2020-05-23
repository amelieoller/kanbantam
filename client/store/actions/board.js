export const SET_BOARD = 'SET_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';

export const setBoard = (board) => ({
  type: SET_BOARD,
  board,
});

export const removeBoard = () => ({
  type: REMOVE_BOARD,
});
