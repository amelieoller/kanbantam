import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postBoard = (info) =>
  request.post('/api/boards').send(info).then(handleSuccess).catch(handleError);

export const getBoards = () =>
  request.get('/api/boards').then(handleSuccess).catch(handleError);

export const getBoard = (boardId) =>
  request.get(`/api/boards/${boardId}`).then(handleSuccess).catch(handleError);

export const putBoard = (info) =>
  request.put('/api/boards').send(info).then(handleSuccess).catch(handleError);

export const deleteBoard = (info) =>
  request.delete('/api/boards').send(info).then(handleSuccess).catch(handleError);
