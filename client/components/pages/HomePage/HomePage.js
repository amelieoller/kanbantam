import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { push } from 'connected-react-router';

function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/'));
    }
  }, []);

  return (
    <div className="home-page page">
      <div className="section">
        <div className="container">
          <h1 className="title is-1">Home Page</h1>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
