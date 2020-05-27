export const SET_BOARDS = 'SET_BOARDS';
export const ADD_BOARD = 'ADD_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';
export const ADD_LIST_TO_BOARD = 'ADD_LIST_TO_BOARD';
export const ADD_TODO_TO_BOARD = 'ADD_TODO_TO_BOARD';
export const REMOVE_LIST_FROM_BOARD = 'REMOVE_LIST_FROM_BOARD';
export const REMOVE_TODO_FROM_BOARD = 'REMOVE_TODO_FROM_BOARD';
export const UPDATE_TODO_ID_ON_BOARD = 'UPDATE_TODO_ID_ON_BOARD';

export const setBoards = (boards) => ({
  type: SET_BOARDS,
  boards,
});

export const addBoard = ({ id, title, createdAt }) => ({
  type: ADD_BOARD,
  createdAt,
  id,
  title,
  orderedTodos: {},
  orderedLists: [],
});

export const updateBoard = ({ id, title, updatedAt, orderedTodos, orderedLists }) => ({
  type: UPDATE_BOARD,
  updatedAt,
  id,
  title,
  orderedTodos,
  orderedLists,
});

export const removeBoard = (id) => ({
  type: REMOVE_BOARD,
  id,
});

export const addListToBoard = (listId, id) => ({
  type: ADD_LIST_TO_BOARD,
  listId,
  id,
});

export const addTodoToBoard = ({ list, id, board }) => ({
  type: ADD_TODO_TO_BOARD,
  listId: list,
  todoId: id,
  id: board,
});

export const removeListFromBoard = (listId, id) => ({
  type: REMOVE_LIST_FROM_BOARD,
  listId,
  id,
});

export const removeTodoFromBoard = ({ listId, todoId, id }) => ({
  type: REMOVE_TODO_FROM_BOARD,
  listId,
  todoId,
  id,
});

export const updateTodoIdOnBoard = ({ newId, id, listId, oldId }) => ({
  type: UPDATE_TODO_ID_ON_BOARD,
  newId,
  id,
  listId,
  oldId,
});
