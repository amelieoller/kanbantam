import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import Notifications from 'react-notification-system-redux';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { withTheme } from 'styled-components';

import { attemptGetUser } from '_thunks/user';

import LoginPage from '_pages/LoginPage';
import RegisterPage from '_pages/RegisterPage';
import BoardPage from '_pages/BoardPage';
import BoardsPage from '_pages/BoardsPage';
import SettingsPage from '_pages/SettingsPage';
import LostPage from '_pages/LostPage';
import Navigation from '_organisms/Navigation';
import WelcomePage from '_pages/WelcomePage/WelcomePage';

function Main({ location, theme: { colors } }) {
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

  var style = {
    NotificationItem: {
      success: {
        color: colors.onSuccess,
        borderTop: '2px solid ' + colors.success,
        backgroundColor: colors.lighter(5, 'success'),
      },
      error: {
        color: colors.onError,
        borderTop: '2px solid ' + colors.error,
        backgroundColor: colors.lighter(5, 'error'),
      },
      warning: {
        color: colors.onWarning,
        borderTop: '2px solid ' + colors.warning,
        backgroundColor: colors.lighter(5, 'warning'),
      },
      info: {
        color: colors.onInfo,
        borderTop: '2px solid ' + colors.info,
        backgroundColor: colors.lighter(5, 'info'),
      },
    },
    Dismiss: {
      success: {
        color: colors.lighter(6, 'success'),
        backgroundColor: colors.lighter(3, 'success'),
      },
      error: {
        color: colors.lighter(6, 'error'),
        backgroundColor: colors.lighter(3, 'error'),
      },
      warning: {
        color: colors.lighter(6, 'warning'),
        backgroundColor: colors.lighter(3, 'warning'),
      },
      info: {
        color: colors.lighter(6, 'info'),
        backgroundColor: colors.lighter(3, 'info'),
      },
    },
  };

  return (
    !loading && (
      <>
        <Notifications notifications={alerts} style={style} />

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
              <Route
                path="/boards/:id"
                render={(routerProps) => {
                  return <BoardPage boardId={routerProps.match.params.id} />;
                }}
              />
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
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      success: PropTypes.string,
      onSuccess: PropTypes.string,
      error: PropTypes.string,
      onError: PropTypes.string,
      warning: PropTypes.string,
      onWarning: PropTypes.string,
      info: PropTypes.string,
      onInfo: PropTypes.string,
      lighter: PropTypes.func,
    }),
  }),
};

export default withTheme(Main);
