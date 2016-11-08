import React, { Component } from 'react';
import MainGrid from './MainGrid.js';
import './App.css';

class App extends Component {
  render() {
    const data = [
      /* type: 0=Credit Card, 1=Password, 2=Priv/Pub Key, 3=2FA Codes */
      {type: 0, index: 1, label: "My VISA card from Bank A"},
      {type: 1, index: 2, label: "Bank A Homebanking"},
      {type: 2, index: 3, label: "Bitcoin private key"},
      {type: 2, index: 4, label: "Ethereum private key"},
      {type: 3, index: 5, label: "Bank A 2FA emergency codes"},
    ];
    return (
      <MainGrid data={data}/>
    );
  }
}

export default App;
