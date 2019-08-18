import React from 'react';
import { render } from 'react-dom';

import Main from './components/main';

window.onload = function() {
  render(<Main env={process.env.NODE_ENV} />, document.getElementById('app'));
};
