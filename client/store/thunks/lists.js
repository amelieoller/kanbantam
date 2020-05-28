import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';
import uniqid from 'uniqid';

import { getLists, postList, putList, deleteList } from '_api/lists';
import { setLists, addList, updateList, removeList } from '_actions/lists';

import { dispatchError } from '_utils/api';

export const attemptGetLists = (boardId) => (dispatch) =>
  getLists(boardId)
    .then(({ data }) => {
      const lists = R.map(
        (list) => R.omit(['Id', '_v'], R.assoc('id', list._id, snakeToCamelCase(list))),
        data,
      );

      dispatch(setLists(lists));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddList = (newList) => (dispatch) => {
  const tempId = uniqid();
  const tempList = {
    ...newList,
    id: tempId,
    createdAt: new Date().toJSON(),
  };

  dispatch(addList(tempList));

  return postList(newList)
    .then(({ data }) => {
      const list = R.omit(['Id', '_v'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(updateList(list));
      return data.user;
    })
    .catch((res) => {
      // Remove list from redux if it wasn't successfully added to the database
      dispatch(removeList(tempId));
      dispatchError(dispatch)(res);
    });
};

export const attemptUpdateList = (listToUpdate) => (dispatch) =>
  putList(listToUpdate)
    .then(({ data }) => {
      const list = R.omit(['Id', '_v'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(updateList(list));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteList = (id) => (dispatch) =>
  deleteList({ id })
    .then(({ data }) => {
      dispatch(removeList(data._id));

      return data;
    })
    .catch(dispatchError(dispatch));
