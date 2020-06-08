import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { push } from 'connected-react-router';

import Register from '_templates/RegisterSection';

function RegisterPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/'));
    }
  }, []);

  return (
    <div className="register-page page">
      <Register />
    </div>
  );
}

export default RegisterPage;
