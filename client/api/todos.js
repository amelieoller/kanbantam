import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postTodo = (info) =>
  request.post('/api/todos').send(info).then(handleSuccess).catch(handleError);

export const getTodos = (boardId) =>
  request.get(`/api/todos?boardId=${boardId}`).then(handleSuccess).catch(handleError);

export const putToggleCompleteTodo = (info) =>
  request.put('/api/todos/complete').send(info).then(handleSuccess).catch(handleError);

export const putTodo = ({ id, ...rest }) =>
  request.put(`/api/todos/${id}`).send(rest).then(handleSuccess).catch(handleError);

export const deleteTodo = ({ id }) =>
  request.delete(`/api/todos/${id}`).then(handleSuccess).catch(handleError);
