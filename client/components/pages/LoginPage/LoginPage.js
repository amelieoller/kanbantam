import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { push } from 'connected-react-router';

import LoginSection from '_templates/LoginSection';

function LoginPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/'));
    }
  }, []);

  return (
    <div className="login-page page">
      <LoginSection />
    </div>
  );
}

export default LoginPage;
