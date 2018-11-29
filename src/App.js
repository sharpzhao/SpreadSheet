import React, { Component } from 'react';
import './App.css';

import SpreadSheet from './components/js/SpreadSheetContainer';


class App extends Component {
  render() {
    return (
      <SpreadSheet
        width={26}
        length={5}
      ></SpreadSheet>
    );
  }
}

export default App;
