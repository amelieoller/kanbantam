import request from 'superagent';

import { handleSuccess, handleError, dispatchError } from '_utils/api';
import { updateListId } from '_actions/lists';

export const postList = (dispatch) => (list) =>
  request
    .post('/api/lists')
    .send(list)
    .then((res) => {
      dispatch(updateListId(list.id, res.body.data._id));

      return handleSuccess(res);
    })
    .catch(dispatchError(dispatch));

export const getLists = (boardId) =>
  request.get(`/api/lists?boardId=${boardId}`).then(handleSuccess).catch(handleError);

export const putList = (dispatch) => ({ id, ...list }) =>
  request.put(`/api/lists/${id}`).send(list).then(handleSuccess).catch(dispatchError(dispatch));

export const deleteList = (dispatch) => (id) =>
  request.delete(`/api/lists/${id}`).then(handleSuccess).catch(dispatchError(dispatch));
