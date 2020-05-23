import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';

import { getBoards, getBoard, postBoard, putBoard, deleteBoard } from '_api/boards';
import { setBoards, addBoard, updateBoard, removeBoard } from '_actions/boards';
import { setBoard } from '_actions/board';

import { dispatchError } from '_utils/api';

export const attemptGetBoards = () => (dispatch) =>
  getBoards()
    .then((data) => {
      const boards = R.map(
        (board) => R.omit(['Id'], R.assoc('id', board._id, snakeToCamelCase(board))),
        data.boards,
      );

      dispatch(setBoards(boards));
      return data.boards;
    })
    .catch(dispatchError(dispatch));

export const attemptGetBoard = (boardId) => (dispatch) =>
  getBoard(boardId)
    .then((data) => {
      const board = R.omit(
        ['Id'],
        R.assoc('id', data.board._id, snakeToCamelCase(data.board)),
      );

      dispatch(setBoard(board));
      return data.boards;
    })
    .catch(dispatchError(dispatch));

export const attemptAddBoard = (title) => (dispatch) =>
  postBoard({ title })
    .then((data) => {
      const board = R.omit(
        ['Id'],
        R.assoc('id', data.board._id, snakeToCamelCase(data.board)),
      );

      dispatch(addBoard(board));
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateBoard = (id, title) => (dispatch) =>
  putBoard({ id, title })
    .then((data) => {
      dispatch(updateBoard({ id, title, updatedAt: data.board.updated_at }));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteBoard = (id) => (dispatch) =>
  deleteBoard({ id })
    .then((data) => {
      dispatch(removeBoard(id));
      return data;
    })
    .catch(dispatchError(dispatch));
