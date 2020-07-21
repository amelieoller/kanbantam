import React from 'react';
import ReactDOM, { render } from 'react-dom';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import history from '_client/history';
import store from '_client/store';

import Root from '_environment/Root';

if (process.env.NODE_ENV !== 'production') {
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}

render(<Root history={history} store={store} />, document.getElementById('app'));
