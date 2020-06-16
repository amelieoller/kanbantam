import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';
import uniqid from 'uniqid';

import { getCategories, postCategory, putCategory, deleteCategory } from '_api/categories';
import { dispatchError } from '_utils/api';

export const SET_CATEGORIES = 'SET_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const UPDATE_CATEGORY_ID = 'UPDATE_CATEGORY_ID';

export const setCategories = (payload) => ({
  type: SET_CATEGORIES,
  payload,
});

export const updateCategoryId = (oldId, newId) => ({
  type: UPDATE_CATEGORY_ID,
  payload: { id: oldId },
  newId: newId,
});

export const attemptGetCategories = (boardId) => (dispatch) =>
  getCategories(boardId)
    .then(({ data }) => {
      const categories = R.map(
        (category) => R.omit(['Id', '_v'], R.assoc('id', category._id, snakeToCamelCase(category))),
        data,
      );

      dispatch(setCategories(categories));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddCategory = (newCategory) => (dispatch) => {
  const tempId = uniqid();
  const payload = {
    ...newCategory,
    id: tempId,
  };

  dispatch({
    type: ADD_CATEGORY,
    payload,
    meta: {
      promise: postCategory(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptUpdateCategory = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_CATEGORY,
    payload,
    meta: {
      promise: putCategory(dispatch)(payload),
      optimist: true,
    },
  });
};

export const attemptDeleteCategory = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_CATEGORY,
    payload: { id },
    meta: {
      promise: deleteCategory(dispatch)(id),
      optimist: true,
    },
  });
};
