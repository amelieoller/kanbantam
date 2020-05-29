import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const postCategory = (info) =>
  request.post('/api/categories').send(info).then(handleSuccess).catch(handleError);

export const getCategories = (boardId) =>
  request
    .get(`/api/categories?boardId=${boardId}`)
    .then(handleSuccess)
    .catch(handleError);

export const putCategory = ({ id, ...rest }) =>
  request.put(`/api/categories/${id}`).send(rest).then(handleSuccess).catch(handleError);

export const deleteCategory = ({ id }) =>
  request.delete(`/api/categories/${id}`).then(handleSuccess).catch(handleError);
