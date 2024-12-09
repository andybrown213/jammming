import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import UserPlaylists from './components/UserPlaylists';
import RecordPlayer from './components/RecordPlayer';
import './App.css';

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [userPlaylists, setUserPlaylists] = useState();

  const checkAccess = () => {
    let accessToken = localStorage.getItem('access token');
    if (accessToken !== null) {return true} else return false;
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

    if (!userProfile) {
        getProfile(accessToken)
          .then(response => setUserProfile(response))
          .catch(error => console.log(`Error fetching user profile data: ${error}`));
    }

    getPlaylists(accessToken)
      .then(response => setUserPlaylists(response))
      .catch(error => console.log(`Error fetching user playlist data: ${error}`));

  }

  if (checkAccess() !== loggedIn) {setLoggedIn(checkAccess)};

  useEffect(() => {if (loggedIn === true) {populateUI()}});

  return (
    <div className="app">

        <Header loggedIn={loggedIn} userProfile={userProfile} />

        <UserPlaylists loggedIn={loggedIn} userPlaylists={userPlaylists} />

        <RecordPlayer />

        <div className="right-navigation">

        </div>

    </div>
  );
}

export default App;
