import React, {useState, useEffect} from 'react';
import {playHandler} from './PlayerInterface';

async function getUserQueue(accessToken) {

    let json;
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/queue`, {
        method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
      });
    
      json = await response.json();         
    
      if (!response.ok) {
        throw new Error(`status code: ${response.status} Error: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log('There was a Syntax Error with your request: ', error);
      } else {console.log('There was an error with your request: ', error)}
    }
    
    return json;
}
  
async function getRecentlyPlayed(accessToken) {
  
    let json;
  
    const params = new URLSearchParams('limit=20&before=' + Date.now() + 5000).toString();
    const url = new URL(`https://api.spotify.com/v1/me/player/recently-played?${params}`);
  
    try {
      const response = await fetch(url, {
        method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
      });
    
      json = await response.json();         
    
      if (!response.ok) {
        throw new Error(`status code: ${response.status} Error: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log('There was a Syntax Error with your request: ', error);
      } else {console.log('There was an error with your request: ', error)};
    }
    
    return json;
}


async function refreshQueue(current, updater) {

    let accessToken = localStorage.getItem('access token');

    getUserQueue(accessToken)
        .then(response => {
            if (current.queuedSongs !== response.queue) {updater.setQueuedSongs(response.queue)};
            if (current.currentSong !== response.currently_playing) {
                updater.setLastSong(current.currentSong); 
                updater.setCurrentSong(response.currently_playing);
            };
        }).catch(error => console.log(`Error fetching user queue data: ${error}`));

    getRecentlyPlayed(accessToken)
        .then(response => {
            if (current.recentSongs !== response.items) {updater.setRecentSongs(response.items)};
        }).catch(error => console.log(`Error fetching user recently played data: ${error}`));
}


export default function UserQueue (props) {

    const [recentSongs, setRecentSongs] = useState([{track: {name: '', artists: [{name: ''}]}}]);
    const [currentSong, setCurrentSong] = useState({name: '', artists: [{name: ''}]});
    const [lastSong, setLastSong] = useState({name: '', artists: [{name: ''}]});
    const [queuedSongs, setQueuedSongs] = useState([{name: '', artists: [{name: ''}]}]);
    
    useEffect(() => {        

        if ((props.loggedIn) && (props.trackInfo.id !== currentSong.id)) {
            const current = {recentSongs, currentSong, lastSong, queuedSongs};
            const updater = {setRecentSongs, setCurrentSong, setLastSong, setQueuedSongs};
            refreshQueue(current, updater);
        }

    }, [props.trackInfo, props.loggedIn, recentSongs, currentSong, lastSong, queuedSongs]);    

    console.log(recentSongs);
    const recentSongsReversed = recentSongs.toReversed();
    console.log(recentSongsReversed);
    
    if ((props.loggedIn)) {

        return (

                <div className='right-side-container'>
                
                <h3 id='user-queue-header'>Queue</h3>

                <div className='user-queue'>                

                {recentSongsReversed.map((item) => (
                    <div id='recent-song'>
                        <h5>{item.track.name}</h5>
                        <h6>{item.track.artists.map(artist => {return artist.name}).toString(' ')}</h6>
                        <button onClick={() => playHandler(item.track.uri)}>Play</button>
                    </div>
                ))}

                <div id='recent-song'>
                    <h5>{lastSong.name}</h5>
                    <h6>{lastSong.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                    <button onClick={() => playHandler(lastSong.uri)}>Play</button>
                </div>

                <div id='current-song'>
                    <h5>{currentSong.name}</h5>
                    <h6>{currentSong.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                </div>

                {queuedSongs.map((track) => (
                    <div id='queued-song'>
                        <h5>{track.name}</h5>
                        <h6>{track.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                        <button onClick={() => playHandler(track.uri)}>Play</button>
                    </div>                
                ))}          

                </div>
                </div>
        )
    }
}