import React, {useState, useEffect} from 'react';
import {playHandler} from './PlayerInterface';

async function getUserQueue(accessToken) {

    let json;
  
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/queue`, {
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
  
async function getRecentlyPlayed(accessToken) {
  
    let json;
  
    const params = new URLSearchParams('limit=20&before=' + Date.now() + 5000).toString();
    const url = new URL(`https://api.spotify.com/v1/me/player/recently-played?${params}`);
  
    try {
      const response = await fetch(url, {
        method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
      });
    
      json = await response.json();         
    
      if ((!response.ok) || (response.status !== 200)) {
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

    let updatedQueue = {
            recentSongs: [],
            lastSong: [],
            currentSong: {},
            queuedSongs: []
    }

    const recentlyPlayedResponse = await getRecentlyPlayed(accessToken);

    const userQueueResponse = await getUserQueue(accessToken);

    if (current.recentSongs !== recentlyPlayedResponse.items) {
        updatedQueue.recentSongs = recentlyPlayedResponse.items;
    } else {updatedQueue.recentSongs = current.recentSongs};

    if (current.queuedSongs !== userQueueResponse.queue) {
        updatedQueue.queuedSongs = userQueueResponse.queue;
    } else {updatedQueue.queuedSongs = current.queuedSongs};

    if (current.currentSong !== userQueueResponse.currently_playing) {
        if (current.lastSong.length > 0) {updatedQueue.lastSong = [...current.lastSong]};        
        updatedQueue.lastSong.push(current.currentSong);
        const duplicates = updatedQueue.recentSongs.filter((track) => updatedQueue.lastSong.includes(track));
        if (duplicates.length > 0) {
            const duplicateIndexes = duplicates.forEach(duplicate => updatedQueue.lastSong.indexOf(duplicate));
            duplicateIndexes.forEach(duplicateIndex => updatedQueue.lastSong.splice(duplicateIndex));
        }
        updatedQueue.currentSong = userQueueResponse.currently_playing;
    }

    updater.setRecentSongs(updatedQueue.recentSongs);
    updater.setLastSong(updatedQueue.lastSong);
    updater.setCurrentSong(updatedQueue.currentSong);
    updater.setQueuedSongs(updatedQueue.queuedSongs); 

}


export default function UserQueue (props) {

    const [recentSongs, setRecentSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [lastSong, setLastSong] = useState([]);
    const [queuedSongs, setQueuedSongs] = useState([]);
    
    useEffect(() => { 
        
        console.log(`useeffect running. Trackinfo: ${props.trackInfo} currentSong: ${currentSong}`);
        

        if ((!currentSong) && (props.loggedIn)) {
            const current = {recentSongs, currentSong, lastSong, queuedSongs};
            const updater = {setRecentSongs, setCurrentSong, setLastSong, setQueuedSongs};
            refreshQueue(current, updater);
        } else if ((props.loggedIn) && (props.trackInfo.id !== currentSong.id)) {
            const current = {recentSongs, currentSong, lastSong, queuedSongs};
            const updater = {setRecentSongs, setCurrentSong, setLastSong, setQueuedSongs};
            refreshQueue(current, updater);
        }

    }, [props.trackInfo, props.loggedIn, recentSongs, currentSong, lastSong, queuedSongs]);    
    
    
    if ((props.loggedIn)) {

        let recentSongsDisplay, lastSongDisplay, currentSongDisplay, queuedSongsDisplay;
        
        if (recentSongs.length > 0) {
            const recentSongsReversed = recentSongs.toReversed();
            recentSongsDisplay =    recentSongsReversed.map((item) => (
                                        <div id='recent-song'>
                                            <h5>{item.track.name}</h5>
                                            <h6>{item.track.artists.map(artist => {return artist.name}).toString(' ')}</h6>
                                            <button onClick={() => playHandler(item.track.uri)}>Play</button>
                                        </div>
                                    ));
        }else {
            recentSongsDisplay =    <div id='recent-song' style={{gridTemplateColumns: '100%', textAlign: 'center'}}>
                                        <h5>No Recent Songs</h5>
                                    </div>;
        }
        
        if (lastSong.length > 0) {    
            lastSongDisplay =   <div id='recent-song'>
                                    <h5>{lastSong.name}</h5>
                                    <h6>{lastSong.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                                    <button onClick={() => playHandler(lastSong.uri)}>Play</button>
                                </div>;
        } else {lastSongDisplay = <></>}

        
        if (currentSong) {
            currentSongDisplay =    <div id='current-song'>
                                        <h5>{currentSong.name}</h5>
                                        <h6>{currentSong.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                                    </div>;
        } else {currentSongDisplay =    <div id='current-song' style={{gridTemplateColumns: '100%', textAlign: 'center'}}>
                                            <h5>Get JAMMMING</h5>
                                        </div>;
        }

        if (queuedSongs.length > 0) {
            queuedSongsDisplay =    queuedSongs.map((track) => (
                                        <div id='queued-song'>
                                            <h5>{track.name}</h5>
                                            <h6>{track.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                                            <button onClick={() => playHandler(track.uri)}>Play</button>
                                        </div>
                                    ));
        } else {queuedSongsDisplay = <></>}    

        return (

                <div className='right-side-container'>

                    <h3 id='user-queue-header'>Queue</h3>

                    <div className='user-queue'> 

                        {recentSongsDisplay}
                        {lastSongDisplay}
                        {currentSongDisplay}
                        {queuedSongsDisplay}      

                    </div>
                </div>
        )
    }
}