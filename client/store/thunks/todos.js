import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';
import uniqid from 'uniqid';

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
        (todo) => R.omit(['Id', '_v'], R.assoc('id', todo._id, snakeToCamelCase(todo))),
        data,
      );

      dispatch(setTodos(todos));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddTodo = (newTodo) => (dispatch) => {
  const tempId = uniqid();
  const tempTodo = {
    ...newTodo,
    id: tempId,
    createdAt: new Date().toJSON(),
    completed: false,
  };

  dispatch(addTodo(tempTodo));

  return postTodo(newTodo)
    .then(({ data }) => {
      const todo = R.omit(['Id', '_v'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(updateTodo(todo));

      return data.user;
    })
    .catch((res) => {
      // Remove todo from redux if it wasn't successfully added to the database
      dispatch(removeTodo(tempId));
      return dispatchError(dispatch)(res);
    });
};

export const attemptToggleCompleteTodo = (id) => (dispatch) =>
  putToggleCompleteTodo({ id })
    .then(({ data }) => {
      const newTodo = R.omit(
        ['Id', '_v'],
        R.assoc('id', data._id, snakeToCamelCase(data)),
      );

      dispatch(toggleCompleteTodo(newTodo));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateTodo = (todo) => (dispatch) =>
  putTodo(todo)
    .then(({ data }) => {
      const newTodo = R.omit(
        ['Id', '_v'],
        R.assoc('id', data._id, snakeToCamelCase(data)),
      );

      dispatch(updateTodo(newTodo));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteTodo = (id) => (dispatch) => {
  return deleteTodo({ id })
    .then(({ data, data: { _id } }) => {
      dispatch(removeTodo(_id));

      return data;
    })
    .catch((resp) => {
      return dispatchError(dispatch)(resp);
    });
};
