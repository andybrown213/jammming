import React, {useState} from 'react';
import Header from './components/Header';
import spinningRecord from './spinning-record.png';
import './App.css';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  console.log(loggedIn);

  const checkAccess = () => {
    console.log('checking Access')
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    if (code !== null) {
      let accessToken = localStorage.getItem('access_token');
      if (accessToken !== null) {
        return true;
      } else return 'auth';
    } else return false;
  }

  if (checkAccess() !== loggedIn) {setLoggedIn(checkAccess)};
  
  return (
    <div className="app">

        <Header loggedIn={loggedIn} />

        <div className="left-navigation">

        </div>

        <img src={spinningRecord} className="spinning-record" alt="spinning record" />

        <div className="right-navigation">

        </div>

    </div>
  );
}

export default App;
