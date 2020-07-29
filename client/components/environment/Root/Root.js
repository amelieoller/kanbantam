import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import Main from '_environment/Main';
import GlobalStyles from '_styles/GlobalStyles';
import { light } from '_styles/Theme';

function Root({ history, store }) {
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

export default Root;

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
