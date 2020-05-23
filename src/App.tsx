import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DevTools from 'mobx-react-devtools';
import FreeSolo from './FreeSolo';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <FreeSolo />
        </header>
        <DevTools />
      </div>
    );
  }
}

export default App;
