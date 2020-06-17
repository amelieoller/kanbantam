import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';
import uniqid from 'uniqid';

import { getTodos, postTodo, putTodo, deleteTodo } from '_api/todos';
import { dispatchError } from '_utils/api';

export const SET_TODOS = 'SET_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const UPDATE_TODO_ID = 'UPDATE_TODO_ID';

export const setTodos = (payload) => ({
  type: SET_TODOS,
  payload,
});

export const updateTodoId = (oldId, newId) => ({
  type: UPDATE_TODO_ID,
  payload: { id: oldId },
  newId: newId,
});

export const attemptGetTodos = (boardId) => (dispatch) =>
  getTodos(boardId)
    .then(({ data }) => {
      const todos = R.map(
        (todo) => R.omit(['Id', '_v'], R.assoc('id', todo._id, snakeToCamelCase(todo))),
        data,
      );

      dispatch(setTodos(todos));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddTodo = (newTodo) => (dispatch) => {
  const tempId = uniqid();
  const payload = {
    ...newTodo,
    id: tempId,
  };

  dispatch({
    type: ADD_TODO,
    payload,
    meta: {
      promise: postTodo(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptUpdateTodo = (todo) => (dispatch) => {
  const updatedAt = new Date();
  const payload = { ...todo, updatedAt };

  dispatch({
    type: UPDATE_TODO,
    payload,
    meta: {
      promise: putTodo(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptDeleteTodo = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_TODO,
    payload: { id },
    meta: {
      promise: deleteTodo(dispatch)(id),
      optimist: true,
    },
  });
};
