import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import UserPlaylists from './components/UserPlaylists';
import PlayerInterface from './components/PlayerInterface';
import './App.css';

async function reAuth() {

  const refreshToken = localStorage.getItem('refresh token');
  const clientId = 'a1eeb89897404526bb54efd92df7a6f2';
  let json = {};

  try {

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'post', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
      })
    })

    json = response.json();

    if (!response.ok) {
      throw new Error(`Error during ReAuth process. Status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
    }

    localStorage.setItem('access token', json.access_token);
    localStorage.setItem('access expiration', Date.now() + (json.expires_in * 1000));
    localStorage.setItem('refresh token', json.refresh_token);

    console.log('reAuth process completed');


  } catch (error) {console.log(error)};
}



function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [userPlaylists, setUserPlaylists] = useState();

  useEffect(() => { 
    
    let interval;
    
    if (loggedIn) {
      
      populateUI();

      interval = setInterval(() => {

        let tokenExpiration = localStorage.getItem('access expiration');
        if ((tokenExpiration - Date.now()) < 60000) {reAuth()};

      }, 30000);

    }
  }, [loggedIn])

  const checkAccess = () => {
    let accessToken = localStorage.getItem('access token');
    let tokenExpiration = localStorage.getItem('access expiration');
    if ((accessToken !== null) && (tokenExpiration > Date.now())) {return true} else return false;
  }

  async function populateUI () {

    const accessToken = localStorage.getItem('access token');

    async function getProfile(accessToken) {

        let json;

        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
            });
            json = await response.json();         
    
            if (!response.ok) {
                throw new Error(`status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
            }
        } catch (error) {console.log(error)};

        return json;
    }

    async function getPlaylists(accessToken) {

      let json;

      try {
          const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
              method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
          });
          json = await response.json();         
  
          if (!response.ok) {
              throw new Error(`status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
          }
      } catch (error) {console.log(error)};

      return json;
    }

    
    getProfile(accessToken)
      .then(response => setUserProfile(response))
      .catch(error => console.log(`Error fetching user profile data: ${error}`));
    

    getPlaylists(accessToken)
      .then(response => setUserPlaylists(response))
      .catch(error => console.log(`Error fetching user playlist data: ${error}`));

  }

  if (checkAccess() !== loggedIn) {setLoggedIn(checkAccess)};

  return (
    <div className="app">

        <Header loggedIn={loggedIn} userProfile={userProfile} />

        <UserPlaylists loggedIn={loggedIn} userPlaylists={userPlaylists} />

        <PlayerInterface loggedIn={loggedIn} />

        <div className="right-navigation">

        </div>

    </div>
  );
}

export default App;
