import { deleteUser } from '../../api/user';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const CLEAR_DATA = 'CLEAR_DATA';

export const login = (user) => {
  return {
    type: LOGIN_USER,
    user,
  };
};

export const logout = () => {
  return {
    type: LOGOUT_USER,
  };
};

export const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    user,
  };
};

export const attemptDeleteUser = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_USER,
    payload: { id },
    meta: {
      promise: deleteUser(dispatch)(id),
      optimist: true,
    },
  });
};

export const clearData = () => {
  return {
    type: CLEAR_DATA,
  };
};
