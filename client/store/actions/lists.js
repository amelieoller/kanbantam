export const SET_LISTS = 'SET_LISTS';
export const ADD_LIST = 'ADD_LIST';
export const TOGGLE_COMPLETE_LIST = 'TOGGLE_COMPLETE_LIST';
export const UPDATE_LIST = 'UPDATE_LIST';
export const REMOVE_LIST = 'REMOVE_LIST';
export const INCREMENT_LIST_ID = 'INCREMENT_LIST_ID';

export const setLists = (lists) => ({
  type: SET_LISTS,
  lists,
});

export const addList = ({ id, title, createdAt }) => ({
  type: ADD_LIST,
  createdAt,
  id,
  title,
});

export const toggleCompleteList = (id) => ({
  type: TOGGLE_COMPLETE_LIST,
  id,
});

export const updateList = ({ id, title, updatedAt }) => ({
  type: UPDATE_LIST,
  updatedAt,
  id,
  title,
});

export const removeList = (id) => ({
  type: REMOVE_LIST,
  id,
});
