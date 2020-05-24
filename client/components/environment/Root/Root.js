import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';

import { light, dark } from '_styles/Theme';
import GlobalStyles from '_styles/GlobalStyles';

import Main from '_environment/Main';

export default function Root({ history, store }) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={light}>
          <GlobalStyles />
          <Main />
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
