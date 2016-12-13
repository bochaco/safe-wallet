import React, { Component } from 'react';
import MainGrid from './MainGrid.js';
import '../css/App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MainGrid />
    );
  }
}

export default App;
