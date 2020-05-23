import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postList = (info) =>
  request.post('/api/lists').send(info).then(handleSuccess).catch(handleError);

export const getLists = (boardId) =>
  request.get(`/api/lists?boardId=${boardId}`).then(handleSuccess).catch(handleError);

export const putToggleCompleteList = (info) =>
  request.put('/api/lists/complete').send(info).then(handleSuccess).catch(handleError);

export const putList = (info) =>
  request.put('/api/lists').send(info).then(handleSuccess).catch(handleError);

export const deleteList = (info) =>
  request.delete('/api/lists').send(info).then(handleSuccess).catch(handleError);
