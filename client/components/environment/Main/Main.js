import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import Notifications from 'react-notification-system-redux';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import { attemptGetUser } from '_thunks/user';

import LoginPage from '_pages/LoginPage';
import RegisterPage from '_pages/RegisterPage';
import BoardPage from '_pages/BoardPage';
import BoardsPage from '_pages/BoardsPage';
import SettingsPage from '_pages/SettingsPage';
import LostPage from '_pages/LostPage';
import Navigation from '_organisms/Navigation';
import WelcomePage from '_pages/WelcomePage/WelcomePage';

function Main({ location }) {
  const dispatch = useDispatch();
  const { alerts } = useSelector(R.pick(['alerts']));
  const { user } = useSelector(R.pick(['user']));

  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(!R.isEmpty(user));

  useEffect(() => {
    setAuth(!R.isEmpty(user));
  }, [user]);

  useEffect(() => {
    dispatch(attemptGetUser())
      .then(() => setLoading(false))
      .catch(R.identity);
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    !loading && (
      <>
        <Notifications notifications={alerts} />

        {!auth ? (
          <>
            <Switch>
              <Route path="/" component={WelcomePage} />
              <Redirect to="/" />
            </Switch>
          </>
        ) : (
          <>
            <Navigation pathname={location.pathname} />
            <Switch>
              <Route exact path="/" component={BoardsPage} />
              <Route path="/boards/:id" component={BoardPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="*" component={LostPage} />
            </Switch>
          </>
        )}
      </>
    )
  );
}

Main.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default Main;
