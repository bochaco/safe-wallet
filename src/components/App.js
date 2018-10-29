import React, { Component } from 'react';
import MainGrid from './MainGrid.js';
// import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onClick
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();

class App extends Component {
  componentWillMount() {
      document.body.style.backgroundColor = "#00bcd4";
  }

  componentWillUnmount() {
      document.body.style.backgroundColor = null;
  }

  render() {
    return (
      <MainGrid />
    );
  }
}

export default App;
