export const SET_CURRENT_TODO = 'SET_CURRENT_TODO';
export const CLEAR_CURRENT_TODO = 'CLEAR_CURRENT_TODO';

export const setCurrentTodo = (todo) => ({
  type: SET_CURRENT_TODO,
  todo,
});

export const clearCurrentTodo = () => ({
  type: CLEAR_CURRENT_TODO,
});
