import request from 'superagent';

import { handleSuccess, handleError, dispatchError } from '_utils/api';
import { updateBoardId } from '_actions/boards';
import { attemptAddList } from '_actions/lists';

export const postBoard = (dispatch) => (board) =>
  request
    .post('/api/boards')
    .send(board)
    .then((res) => {
      const newBoardId = res.body.data._id;

      dispatch(updateBoardId(board.id, { ...res.body.data, id: newBoardId }));
      dispatch(attemptAddList({ title: 'complete', board: newBoardId, special: true }));

      return handleSuccess(res);
    })
    .catch(dispatchError(dispatch));

export const getBoards = () => request.get('/api/boards').then(handleSuccess).catch(handleError);

export const putBoard = (dispatch) => ({ id, ...board }) =>
  request.put(`/api/boards/${id}`).send(board).then(handleSuccess).catch(dispatchError(dispatch));

export const deleteBoard = (dispatch) => (id) =>
  request.delete(`/api/boards/${id}`).then(handleSuccess).catch(dispatchError(dispatch));
