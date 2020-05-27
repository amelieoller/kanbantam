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
  updateTodoId,
} from '_actions/todos';
import {
  addTodoToBoard,
  removeTodoFromBoard,
  updateTodoIdOnBoard,
} from '_actions/boards';

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

export const attemptAddTodo = (newTodo) => (dispatch) => {
  const tempId = uniqid();

  dispatch(addTodoToBoard({ id: tempId, ...newTodo }));
  dispatch(addTodo({ ...newTodo, id: tempId, createdAt: new Date().toJSON() }));

  return postTodo(newTodo)
    .then(({ data }) => {
      const todo = R.omit(['Id'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(
        updateTodoIdOnBoard({
          oldId: tempId,
          newId: todo.id,
          listId: todo.list,
          id: todo.board,
        }),
      );
      dispatch(updateTodoId({ id: tempId, newId: todo.id }));

      return data.user;
    })
    .catch((res) => {
      // Remove todo from redux
      dispatch(
        removeTodoFromBoard({ todoId: tempId, id: newTodo.board, listId: newTodo.list }),
      );
      dispatch(removeTodo(tempId));

      dispatchError(dispatch)(res);
    });
};

export const attemptToggleCompleteTodo = (id) => (dispatch) =>
  putToggleCompleteTodo({ id })
    .then((data) => {
      dispatch(toggleCompleteTodo(id));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateTodo = (todo) => (dispatch) =>
  putTodo(todo)
    .then(({ data }) => {
      const newTodo = R.omit(['Id'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(updateTodo(newTodo));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteTodo = (id) => (dispatch) =>
  deleteTodo({ id })
    .then(({ data, data: { _id } }) => {
      dispatch(
        removeTodoFromBoard({ listId: data.list, todoId: data._id, id: data.board }),
      );
      dispatch(removeTodo(_id));

      return data;
    })
    .catch(dispatchError(dispatch));
