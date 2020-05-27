import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';

import { getLists, postList, putList, deleteList } from '_api/lists';
import { setLists, addList, updateList, removeList } from '_actions/lists';
import { addListToBoard, removeListFromBoard } from '_actions/boards';

import { dispatchError } from '_utils/api';

export const attemptGetLists = (boardId) => (dispatch) =>
  getLists(boardId)
    .then(({ data }) => {
      const lists = R.map(
        (list) => R.omit(['Id'], R.assoc('id', list._id, snakeToCamelCase(list))),
        data,
      );

      dispatch(setLists(lists));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddList = (title, board) => (dispatch) =>
  postList({ title, board })
    .then(({ data }) => {
      const list = R.omit(['Id'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(addList(list));
      dispatch(addListToBoard(list.id, board));

      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateList = (id, title) => (dispatch) =>
  putList({ id, title })
    .then(({ data, data: { _id, title, updated_at } }) => {
      dispatch(updateList({ id: _id, title, updatedAt: updated_at }));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteList = (id) => (dispatch) =>
  deleteList({ id })
    .then(({ data, data: { _id } }) => {
      dispatch(removeListFromBoard(data._id, data.board));
      dispatch(removeList(_id));

      return data;
    })
    .catch(dispatchError(dispatch));
