import React, {useState} from 'react';
import Header from './components/Header';
import RecordPlayer from './components/RecordPlayer'
import './App.css';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);



  const checkAccess = () => {
    let accessToken = localStorage.getItem('access token');
    if (accessToken !== null) {
      return true;
    } else return false;
  }

   
  if (checkAccess() !== loggedIn) {setLoggedIn(checkAccess)};

  
  return (
    <div className="app">

        <Header loggedIn={loggedIn} />

        <div className="left-navigation">

        </div>

        <RecordPlayer />

        <div className="right-navigation">

        </div>

    </div>
  );
}

export default App;
