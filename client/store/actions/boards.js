import * as R from 'ramda';
import uniqid from 'uniqid';

import { getBoards, postBoard, putBoard, deleteBoard } from '_api/boards';
import { dispatchError } from '_utils/api';

export const SET_BOARDS = 'SET_BOARDS';
export const ADD_BOARD = 'ADD_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';
export const UPDATE_BOARD_ID = 'UPDATE_BOARD_ID';

export const setBoards = (payload) => ({
  type: SET_BOARDS,
  payload,
});

export const updateBoardId = (oldId, board) => ({
  type: UPDATE_BOARD_ID,
  payload: { oldId, board },
});

export const attemptGetBoards = (boardId) => (dispatch) =>
  getBoards(boardId)
    .then(({ data }) => {
      const boards = R.map((board) => R.omit(['Id', '_v'], R.assoc('id', board._id, board)), data);

      dispatch(setBoards(boards));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddBoard = (newBoard) => (dispatch) => {
  const tempId = uniqid();
  const payload = {
    ...newBoard,
    id: tempId,
  };

  dispatch({
    type: ADD_BOARD,
    payload,
    meta: {
      promise: postBoard(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptUpdateBoard = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_BOARD,
    payload,
    meta: {
      promise: putBoard(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptDeleteBoard = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_BOARD,
    payload: { id },
    meta: {
      promise: deleteBoard(dispatch)(id),
      optimist: true,
    },
  });
};
