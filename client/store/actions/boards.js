export const SET_BOARDS = 'SET_BOARDS';
export const ADD_BOARD = 'ADD_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';

export const setBoards = (boards) => ({
  type: SET_BOARDS,
  boards,
});

export const addBoard = (board) => ({
  type: ADD_BOARD,
  id: board.id,
  board,
});

export const updateBoard = (board) => ({
  type: UPDATE_BOARD,
  id: board.id,
  board,
});

export const removeBoard = (id) => ({
  type: REMOVE_BOARD,
  id,
});
