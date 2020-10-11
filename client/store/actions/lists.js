import * as R from 'ramda';
import uniqid from 'uniqid';

import { getLists, postList, putList, deleteList } from '_api/lists';
import { dispatchError } from '_utils/api';

export const SET_LISTS = 'SET_LISTS';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_LIST = 'UPDATE_LIST';
export const REMOVE_LIST = 'REMOVE_LIST';
export const INCREMENT_LIST_ID = 'INCREMENT_LIST_ID';
export const UPDATE_LIST_ID = 'UPDATE_LIST_ID';

export const setLists = (payload) => ({
  type: SET_LISTS,
  payload,
});

export const updateListId = (oldId, newId) => ({
  type: UPDATE_LIST_ID,
  payload: { id: oldId },
  newId: newId,
});

export const attemptGetLists = (boardId) => (dispatch) =>
  getLists(boardId)
    .then(({ data }) => {
      const lists = R.map((list) => R.omit(['Id', '_v'], R.assoc('id', list._id, list)), data);

      dispatch(setLists(lists));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddList = (newList) => (dispatch) => {
  const tempId = uniqid();
  const payload = {
    ...newList,
    id: tempId,
  };

  dispatch({
    type: ADD_LIST,
    payload,
    meta: {
      promise: postList(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptUpdateList = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_LIST,
    payload,
    meta: {
      promise: putList(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptDeleteList = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_LIST,
    payload: { id },
    meta: {
      promise: deleteList(dispatch)(id),
      optimist: true,
    },
  });
};
