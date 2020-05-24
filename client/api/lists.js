import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postList = (info) =>
  request.post('/api/lists').send(info).then(handleSuccess).catch(handleError);

export const getLists = (boardId) =>
  request.get(`/api/lists?boardId=${boardId}`).then(handleSuccess).catch(handleError);

export const putList = ({ id, ...rest }) =>
  request.put(`/api/lists/${id}`).send(rest).then(handleSuccess).catch(handleError);

export const deleteList = ({ id }) =>
  request.delete(`/api/lists/${id}`).then(handleSuccess).catch(handleError);
