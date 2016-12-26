import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// TODO: clean this up to properly include semantic ui css into the public folder
import '../node_modules/semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
