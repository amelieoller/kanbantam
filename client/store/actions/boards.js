export const SET_BOARDS = 'SET_BOARDS';
export const ADD_BOARD = 'ADD_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';
export const INCREMENT_BOARD_ID = 'INCREMENT_BOARD_ID';

export const setBoards = (boards) => ({
  type: SET_BOARDS,
  boards,
});

export const addBoard = ({ id, title, createdAt }) => ({
  type: ADD_BOARD,
  createdAt,
  id,
  title,
});

export const updateBoard = ({ id, title, updatedAt }) => ({
  type: UPDATE_BOARD,
  updatedAt,
  id,
  title,
});

export const removeBoard = (id) => ({
  type: REMOVE_BOARD,
  id,
});
