import { push } from 'connected-react-router';
import Notifications from 'react-notification-system-redux';

import { logout } from '_actions/user';

export const handleSuccess = (resp) => resp.body;

export const handleError = (error) => {
  if (error.response) {
    throw error.response;
  } else {
    const response = {
      status: 500,
      body: { message: 'Internal Server error' },
    };
    throw response;
  }
};

export const dispatchError = (dispatch) => (res) => {
  if (res.status === 401) {
    dispatch(logout());
    dispatch(push('/'));
  }

  const message =
    res.body && res.body.message ? res.body.message : 'An error has ocurred';
  const status = res.status ? res.status : 'Status unknown';

  dispatch(
    Notifications.error({
      title: `Error: ${status}`,
      message: message,
      position: 'tr',
      autoDismiss: 5,
    }),
  );

  throw res;
};
