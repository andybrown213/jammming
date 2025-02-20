import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import UserPlaylists from './components/UserPlaylists';
import PlayerInterface from './components/PlayerInterface';
import UserQueue from './components/UserQueue.js';
import './App.css';



async function reAuth() {

  //console.log('ReAuthorizing...');

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

    json = await response.json();

    if ((!response.ok) || (response.status !== 200)) {
      throw new Error(`Error during ReAuth process. Status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
    }

    localStorage.setItem('access token', json.access_token);
    localStorage.setItem('access expiration', Date.now() + (json.expires_in * 1000));
    localStorage.setItem('refresh token', json.refresh_token);

    //console.log('reAuth process completed');


  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('There was a Syntax Error with your request: ', error);
    } else {console.log('There was an error with your request: ', error)}
  }
}

async function getProfile(accessToken) {

  let json;

  try {
      const response = await fetch('https://api.spotify.com/v1/me', {
          method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
      });
      
      json = await response.json();         

      if ((!response.ok) || (response.status !== 200)) {
          throw new Error(`status code: ${response.status} Error: ${JSON.stringify(json)}`);
      }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('There was a Syntax Error with your request: ', error);
    } else {console.log('There was an error with your request: ', error)}
  }

  return json;
}

async function getPlaylists(accessToken) {

  let json;

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
      method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
    });
  
    json = await response.json();         
  
    if ((!response.ok) || (response.status !== 200)) {
      throw new Error(`status code: ${response.status} Error: ${JSON.stringify(response)}`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('There was a Syntax Error with your request: ', error);
    } else {console.log('There was an error with your request: ', error)}
  }
  
  return json;
}

async function getPlayerState (accessToken) {

  let json = {};
  
  try {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
          method: 'get', headers: {Authorization: `Bearer ${accessToken}`}
      })
      
      if (response.status === 204) {
          console.log(`No response from player status. Default Response: ${JSON.stringify(response)}`);
          return json;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
          json = await response.json();
      } else {throw new Error('Response is not a JSON. Response: ', response)}       

      if ((!response.ok) || (response.status !== 200)) {
          throw new Error(`status code: ${response.status} Error: ${JSON.stringify(json)}`)
      }

  } catch (error) {
      if (error instanceof SyntaxError) {
          console.log('There was a Syntax Error with your request: ', error);
      } else {console.log('There was an error with your request: ', error)}
  }
  
  //console.log(`Player Status Retrieved: ${JSON.stringify(json)}`);
  return json;
  
}

async function syncInterface(current, updater) {

  const accessToken = localStorage.getItem('access token');

  getPlayerState(accessToken)
    .then((response) => {
      if (current.isPlaying !== response.is_playing) {updater.setIsPlaying(response.is_playing)};
      if (Object.values(current.trackInfo).length < 1) {updater.setTrackInfo(response.item)}
      else if (current.trackInfo.id !== response.item.id) {updater.setTrackInfo(response.item)};
  })
  .catch((error) => console.log(`Error retrieving player status: ${error}`));
}

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [userPlaylists, setUserPlaylists] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInfo, setTrackInfo] = useState({});

  useEffect(() => {
      
      let interval;
      
      if (loggedIn) {

          const current = {isPlaying, trackInfo}
          const updater = {setIsPlaying, setTrackInfo};
          syncInterface(current, updater);
      
          interval = setInterval(() => {syncInterface(current, updater)}, 1000);

          console.log(`Playing music? ${isPlaying}. Track Info:`)
          console.dir(trackInfo);
      }   

      return () => {if (interval) clearInterval(interval)};

  }, [isPlaying, trackInfo, loggedIn])

  useEffect(() => { 
    
    let interval;

    if (loggedIn) {
      
      populateUI();

      interval = setInterval(() => {

        let tokenExpiration = localStorage.getItem('access expiration');
        const refreshTimer = (tokenExpiration - Date.now());
        const oneMinute = 60000;
        if (refreshTimer < (oneMinute*5)) {reAuth()};

      }, 120000);
    }
    return () => {if (interval) {clearInterval(interval)}};
  }, [loggedIn])

  const checkAccess = () => {
    let accessToken = localStorage.getItem('access token');
    let tokenExpiration = localStorage.getItem('access expiration');
    if ((accessToken !== null) && (tokenExpiration > Date.now())) {return true} else return false;
  }

  async function populateUI () {

    const accessToken = localStorage.getItem('access token');
 
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

        <PlayerInterface loggedIn={loggedIn} trackInfo={trackInfo} isPlaying={isPlaying}/>

        <UserQueue loggedIn={loggedIn} trackInfo={trackInfo} />

    </div>
  );
}

export default App;
