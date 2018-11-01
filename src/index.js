import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// The semantic.min.css file is manually being modified
// to load the fonts from /fonts, e.g. in first line we have:
//           @import url(/fonts/Raleway-Regular.ttf); /*!
// TODO: change the config files so this gets added automatically when
// building it with "gulp build"
// TODO: customise it so it includes only the components being used by the app
import './semantic/dist/semantic.min.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
