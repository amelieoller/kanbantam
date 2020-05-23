export const SET_TODOS = 'SET_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_COMPLETE_TODO = 'TOGGLE_COMPLETE_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const INCREMENT_TODO_ID = 'INCREMENT_TODO_ID';

export const setTodos = (todos) => ({
  type: SET_TODOS,
  todos,
});

export const addTodo = ({ id, text, createdAt, board, list }) => ({
  type: ADD_TODO,
  createdAt,
  id,
  text,
  board,
  list,
});

export const toggleCompleteTodo = (id) => ({
  type: TOGGLE_COMPLETE_TODO,
  id,
});

export const updateTodo = ({ id, text, updatedAt, list }) => ({
  type: UPDATE_TODO,
  updatedAt,
  id,
  text,
  list,
});

export const removeTodo = (id) => ({
  type: REMOVE_TODO,
  id,
});
