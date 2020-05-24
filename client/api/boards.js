import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postBoard = (info) =>
  request.post('/api/boards').send(info).then(handleSuccess).catch(handleError);

export const getBoards = () =>
  request.get('/api/boards').then(handleSuccess).catch(handleError);

export const putBoard = ({ id, ...rest }) =>
  request.put(`/api/boards/${id}`).send(rest).then(handleSuccess).catch(handleError);

export const deleteBoard = ({ id }) =>
  request.delete(`/api/boards/${id}`).then(handleSuccess).catch(handleError);
