export const SET_CURRENT_BOARD = 'SET_CURRENT_BOARD';
export const CLEAR_CURRENT_BOARD = 'CLEAR_CURRENT_BOARD';

export const setCurrentBoard = (board) => ({
  type: SET_CURRENT_BOARD,
  board,
});

export const clearCurrentBoard = () => ({
  type: CLEAR_CURRENT_BOARD,
});
