import request from 'superagent';

import { handleSuccess, handleError, dispatchError } from '_utils/api';
import { updateTodoId } from '_actions/todos';

export const postTodo = (dispatch) => (todo) =>
  request
    .post('/api/todos')
    .send(todo)
    .then((res) => {
      dispatch(updateTodoId(todo.id, res.body.data._id));

      return handleSuccess(res);
    })
    .catch(dispatchError(dispatch));

export const getTodos = (boardId) =>
  request.get(`/api/todos?boardId=${boardId}`).then(handleSuccess).catch(handleError);

export const putTodo = (dispatch) => ({ id, ...todo }) =>
  request.put(`/api/todos/${id}`).send(todo).then(handleSuccess).catch(dispatchError(dispatch));

export const deleteTodo = (dispatch) => (id) =>
  request.delete(`/api/todos/${id}`).then(handleSuccess).catch(dispatchError(dispatch));
