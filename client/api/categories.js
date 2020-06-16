import request from 'superagent';

import { handleSuccess, handleError, dispatchError } from '_utils/api';
import { updateCategoryId } from '_actions/categories';

export const postCategory = (dispatch) => (category) =>
  request
    .post('/api/categories')
    .send(category)
    .then((res) => {
      dispatch(updateCategoryId(category.id, res.body.data._id));

      return handleSuccess(res);
    })
    .catch(dispatchError(dispatch));

export const getCategories = (boardId) =>
  request.get(`/api/categories?boardId=${boardId}`).then(handleSuccess).catch(handleError);

export const putCategory = (dispatch) => ({ id, ...category }) =>
  request
    .put(`/api/categories/${id}`)
    .send(category)
    .then(handleSuccess)
    .catch(dispatchError(dispatch));

export const deleteCategory = (dispatch) => (id) =>
  request.delete(`/api/categories/${id}`).then(handleSuccess).catch(dispatchError(dispatch));
