import React, {useState} from 'react';
import Header from './components/Header';
import RecordPlayer from './components/RecordPlayer'
import './App.css';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  const checkAccess = () => {
    if (code !== null) {
      let accessToken = localStorage.getItem('access_token');
      if (accessToken !== null) {
        return true;
      } else return 'auth';
    } else return false;
  }

  async function getToken(code) {

    const codeVerifier = localStorage.getItem('code_verifier');
    const clientId = 'a1eeb89897404526bb54efd92df7a6f2';
    const redirectUri = 'https://gorgeous-bombolone-0ba30e.netlify.app';
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      })
    }

    const response = await fetch(url, payload);
    console.log(response)  
    if (!response.ok) {
        throw new Error('No Response From Spotify Network. Please Try Again.')
      }   

      localStorage.setItem('access_token', response.access_token);
  }
  
  if (checkAccess() !== loggedIn) {setLoggedIn(checkAccess)};

  if (loggedIn === 'auth') {
    
    
    try {
      getToken(code);
      
      setLoggedIn(true);
    } catch {

    }
  };   
  
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
