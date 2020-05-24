import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';

import {
  getTodos,
  postTodo,
  putToggleCompleteTodo,
  putTodo,
  deleteTodo,
} from '_api/todos';
import {
  setTodos,
  addTodo,
  toggleCompleteTodo,
  updateTodo,
  removeTodo,
} from '_actions/todos';

import { dispatchError } from '_utils/api';

export const attemptGetTodos = (boardId) => (dispatch) =>
  getTodos(boardId)
    .then(({ data }) => {
      const todos = R.map(
        (todo) => R.omit(['Id'], R.assoc('id', todo._id, snakeToCamelCase(todo))),
        data,
      );

      dispatch(setTodos(todos));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddTodo = (text, board, list) => (dispatch) =>
  postTodo({ text, board, list })
    .then(({ data }) => {
      const todo = R.omit(['Id'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(addTodo(todo));
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptToggleCompleteTodo = (id) => (dispatch) =>
  putToggleCompleteTodo({ id })
    .then((data) => {
      dispatch(toggleCompleteTodo(id));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateTodo = (id, text) => (dispatch) =>
  putTodo({ id, text })
    .then(({ data, data: { _id, text, list, updated_at } }) => {
      dispatch(updateTodo({ id: _id, text, updatedAt: updated_at, list }));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteTodo = (id) => (dispatch) =>
  deleteTodo({ id })
    .then(({ data, data: { _id } }) => {
      dispatch(removeTodo(_id));
      return data;
    })
    .catch(dispatchError(dispatch));
