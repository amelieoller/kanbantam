import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';

import {
  getLists,
  postList,
  putToggleCompleteList,
  putList,
  deleteList,
} from '_api/lists';
import {
  setLists,
  addList,
  toggleCompleteList,
  updateList,
  removeList,
} from '_actions/lists';

import { dispatchError } from '_utils/api';

export const attemptGetLists = (boardId) => (dispatch) =>
  getLists(boardId)
    .then((data) => {
      const lists = R.map(
        (list) => R.omit(['Id'], R.assoc('id', list._id, snakeToCamelCase(list))),
        data.lists,
      );

      dispatch(setLists(lists));
      return data.lists;
    })
    .catch(dispatchError(dispatch));

export const attemptAddList = (title, board) => (dispatch) =>
  postList({ title, board })
    .then((data) => {
      const list = R.omit(
        ['Id'],
        R.assoc('id', data.list._id, snakeToCamelCase(data.list)),
      );

      dispatch(addList(list));
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptToggleCompleteList = (id) => (dispatch) =>
  putToggleCompleteList({ id })
    .then((data) => {
      dispatch(toggleCompleteList(id));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateList = (id, title) => (dispatch) =>
  putList({ id, title })
    .then((data) => {
      dispatch(updateList({ id, title, updatedAt: data.list.updated_at }));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteList = (id) => (dispatch) =>
  deleteList({ id })
    .then((data) => {
      dispatch(removeList(id));
      return data;
    })
    .catch(dispatchError(dispatch));
