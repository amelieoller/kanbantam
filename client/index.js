import React from 'react';
import ReactDOM, { render } from 'react-dom';
import WebFont from 'webfontloader';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import history from '_client/history';
import store from '_client/store';
import Root from '_environment/Root';

WebFont.load({
  google: {
    families: ['Roboto:100,400,500', 'Pacifico'],
  },
});

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe');
//   axe(React, ReactDOM, 1000);
// }

render(<Root history={history} store={store} />, document.getElementById('app'));
