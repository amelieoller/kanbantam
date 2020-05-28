export const SET_LISTS = 'SET_LISTS';
export const ADD_LIST = 'ADD_LIST';
export const UPDATE_LIST = 'UPDATE_LIST';
export const REMOVE_LIST = 'REMOVE_LIST';
export const INCREMENT_LIST_ID = 'INCREMENT_LIST_ID';

export const setLists = (lists) => ({
  type: SET_LISTS,
  lists,
});

export const addList = (list) => ({
  type: ADD_LIST,
  list,
});

export const updateList = (list) => ({
  type: UPDATE_LIST,
  id: list.id,
  list,
});

export const removeList = (id) => ({
  type: REMOVE_LIST,
  id,
});
