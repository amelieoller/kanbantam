import update from 'immutability-helper';
import * as R from 'ramda';

import {
  SET_BOARDS,
  ADD_BOARD,
  UPDATE_BOARD,
  REMOVE_BOARD,
  ADD_LIST_TO_BOARD,
  ADD_TODO_TO_BOARD,
  REMOVE_LIST_FROM_BOARD,
  REMOVE_TODO_FROM_BOARD,
  UPDATE_TODO_ID_ON_BOARD,
} from '_actions/boards';

import { LOGOUT_USER } from '_actions/user';

export function board(state = {}, action) {
  switch (action.type) {
    case ADD_BOARD:
      return update(state, {
        id: { $set: action.id },
        title: { $set: action.title },
        createdAt: { $set: action.createdAt },
      });
    case UPDATE_BOARD:
      return update(state, {
        title: { $set: action.title },
        updatedAt: { $set: action.updatedAt },
        orderedTodos: { $set: action.orderedTodos },
        orderedLists: { $set: action.orderedLists },
      });
    case ADD_LIST_TO_BOARD:
      return {
        ...state,
        orderedTodos: { ...state.orderedTodos, [action.listId]: [] },
        orderedLists: [...state.orderedLists, action.listId],
      };
    case ADD_TODO_TO_BOARD:
      return {
        ...state,
        orderedTodos: {
          ...state.orderedTodos,
          [action.listId]: [...state.orderedTodos[action.listId], action.todoId],
        },
      };
    case REMOVE_LIST_FROM_BOARD:
      const key = action.listId;
      const { [key]: newVal, ...withoutSecond } = state.orderedTodos;

      const index = state.orderedLists.indexOf(key);
      const newArr = [...state.orderedLists];
      if (index !== -1) newArr.splice(index, 1);

      return { ...state, orderedTodos: withoutSecond, orderedLists: newArr };
    case REMOVE_TODO_FROM_BOARD:
      return {
        ...state,
        orderedTodos: {
          ...state.orderedTodos,
          [action.listId]: state.orderedTodos[action.listId].filter(
            (t) => t !== action.todoId,
          ),
        },
      };
    case UPDATE_TODO_ID_ON_BOARD:
      return {
        ...state,
        orderedTodos: {
          ...state.orderedTodos,
          [action.listId]: state.orderedTodos[action.listId].map((t) =>
            t === action.oldId ? action.newId : t,
          ),
        },
      };
    default:
      return state;
  }
}

export default function boards(state = [], action) {
  const index = R.findIndex(R.propEq('id', action.id), state);
  const updatedAtIndex = { $splice: [[index, 1, board(state[index], action)]] };

  switch (action.type) {
    case SET_BOARDS:
      return update(state, { $set: action.boards });
    case ADD_BOARD:
      return update(state, { $push: [board(undefined, action)] });
    case UPDATE_BOARD:
      return update(state, updatedAtIndex);
    case REMOVE_BOARD:
      return update(state, { $splice: [[index, 1]] });
    case ADD_LIST_TO_BOARD:
      return update(state, updatedAtIndex);
    case ADD_TODO_TO_BOARD:
      return update(state, updatedAtIndex);
    case REMOVE_LIST_FROM_BOARD:
      return update(state, updatedAtIndex);
    case REMOVE_TODO_FROM_BOARD:
      return update(state, updatedAtIndex);
    case UPDATE_TODO_ID_ON_BOARD:
      return update(state, updatedAtIndex);
    case LOGOUT_USER:
      return [];
    default:
      return state;
  }
}
