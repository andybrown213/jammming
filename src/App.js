import React from 'react';
import Header from './components/Header';
import spinningRecord from './spinning-record.png';
import './App.css';

function App() {
  

  
  return (
    <div className="app">

        <Header />

        <div className="left-navigation">

        </div>

        <img src={spinningRecord} className="spinning-record" alt="spinning record" />

        <div className="right-navigation">

        </div>

    </div>
  );
}

export default App;
