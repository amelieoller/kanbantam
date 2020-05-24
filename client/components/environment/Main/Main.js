import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
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

function Main({ location }) {
  const dispatch = useDispatch();
  const { alerts } = useSelector(R.pick(['alerts']));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(attemptGetUser())
      .then(() => setLoading(false))
      .catch(R.identity);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    !loading && (
      <div>
        <Notifications notifications={alerts} />
        <Navigation />
        <div>
          <Switch>
            <Route exact path="/" component={BoardsPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/boards/:id" component={BoardPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="*" component={LostPage} />
          </Switch>
        </div>
      </div>
    )
  );
}

Main.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default Main;
