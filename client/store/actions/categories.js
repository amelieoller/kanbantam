export const SET_CATEGORIES = 'SET_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const TOGGLE_COMPLETE_CATEGORY = 'TOGGLE_COMPLETE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const INCREMENT_CATEGORY_ID = 'INCREMENT_CATEGORY_ID';

export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  categories,
});

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  id: category.id,
  category,
});

export const toggleCompleteCategory = (id) => ({
  type: TOGGLE_COMPLETE_CATEGORY,
  id,
});

export const updateCategory = (category) => ({
  type: UPDATE_CATEGORY,
  id: category.id,
  category,
});

export const removeCategory = (id) => ({
  type: REMOVE_CATEGORY,
  id,
});
