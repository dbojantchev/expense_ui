import React from "react";
import ShowTime from './components/ShowTime'
import ShowInfo from './components/ShowInfo'
import ShowInfoClass from './components/ShowInfoClass'

import './App.css';

function App() {
  return (
    <div className="App">
      <ShowTime/>
      <ShowInfo/>
      <ShowInfoClass/>
    </div>
  );
}

export default App;
