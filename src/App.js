import React, {useState} from 'react';
import Header from './components/Header';
import RecordPlayer from './components/RecordPlayer'
import './App.css';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  console.log(`loading.. current logged in status is ${loggedIn}`);

  const checkAccess = () => {
    let accessToken = localStorage.getItem('access token');
    console.log(accessToken);
    if (accessToken !== null) {
      console.log('we found a token!');
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
