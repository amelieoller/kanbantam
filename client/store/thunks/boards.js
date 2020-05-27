import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';

import { getBoards, postBoard, putBoard, deleteBoard } from '_api/boards';
import { setBoards, addBoard, updateBoard, removeBoard } from '_actions/boards';

import { dispatchError } from '_utils/api';

export const attemptGetBoards = () => (dispatch) =>
  getBoards()
    .then(({ data }) => {
      const boards = R.map(
        (board) => R.omit(['Id'], R.assoc('id', board._id, snakeToCamelCase(board))),
        data,
      );

      dispatch(setBoards(boards));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddBoard = (title) => (dispatch) =>
  postBoard({ title, orderedTodos: {}, orderedLists: [] })
    .then(({ data }) => {
      const board = R.omit(['Id'], R.assoc('id', data._id, snakeToCamelCase(data)));

      dispatch(addBoard(board));
      return data.user;
    })
    .catch(dispatchError(dispatch));

export const attemptUpdateBoard = (id, title, orderedTodos, orderedLists) => (dispatch) =>
  putBoard({ id, title, orderedTodos, orderedLists })
    .then(({ data, data: { _id, title, updated_at, orderedTodos, orderedLists } }) => {
      dispatch(
        updateBoard({
          id: _id,
          title,
          updatedAt: updated_at,
          orderedTodos,
          orderedLists,
        }),
      );
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteBoard = (id) => (dispatch) =>
  deleteBoard({ id })
    .then(({ data, data: { _id } }) => {
      dispatch(removeBoard(_id));
      return data;
    })
    .catch(dispatchError(dispatch));
