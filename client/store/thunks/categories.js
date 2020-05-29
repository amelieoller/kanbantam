import { snakeToCamelCase } from 'json-style-converter/es5';
import * as R from 'ramda';
import uniqid from 'uniqid';

import {
  getCategories,
  postCategory,
  putCategory,
  deleteCategory,
} from '_api/categories';
import {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
} from '_actions/categories';

import { dispatchError } from '_utils/api';

export const attemptGetCategories = (boardId) => (dispatch) =>
  getCategories(boardId)
    .then(({ data }) => {
      const categories = R.map(
        (category) =>
          R.omit(['Id', '_v'], R.assoc('id', category._id, snakeToCamelCase(category))),
        data,
      );

      dispatch(setCategories(categories));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptAddCategory = (newCategory) => (dispatch) => {
  const tempId = uniqid();
  const tempCategory = {
    ...newCategory,
    id: tempId,
    createdAt: new Date().toJSON(),
  };

  dispatch(addCategory(tempCategory));

  return postCategory(newCategory)
    .then(({ data }) => {
      const category = R.omit(
        ['Id', '_v'],
        R.assoc('id', data._id, snakeToCamelCase(data)),
      );

      dispatch(updateCategory(category));

      return data.user;
    })
    .catch((res) => {
      // Remove category from redux if it wasn't successfully added to the database
      dispatch(removeCategory(tempId));
      return dispatchError(dispatch)(res);
    });
};

export const attemptUpdateCategory = (category) => (dispatch) =>
  putCategory(category)
    .then(({ data }) => {
      const newCategory = R.omit(
        ['Id', '_v'],
        R.assoc('id', data._id, snakeToCamelCase(data)),
      );

      dispatch(updateCategory(newCategory));
      return data;
    })
    .catch(dispatchError(dispatch));

export const attemptDeleteCategory = (id) => (dispatch) => {
  return deleteCategory({ id })
    .then(({ data, data: { _id } }) => {
      dispatch(removeCategory(_id));

      return data;
    })
    .catch((resp) => {
      return dispatchError(dispatch)(resp);
    });
};
