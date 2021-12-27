import React, { PureComponent } from 'react';
import '../styles/App.css';
import Notepad from './Notepad';

class App extends PureComponent {

  render() {
    return (
      <div> <Notepad></Notepad>
      </div>      

    )
  }
}

export default App;
