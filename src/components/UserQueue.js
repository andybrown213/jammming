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
        if (current.currentSong) {
            updatedQueue.lastSong.push(current.currentSong);
        };
        updatedQueue.currentSong = userQueueResponse.currently_playing;
        if (updatedQueue.lastSong.length > 0) {updatedQueue = removeDuplicates(updatedQueue)};        
    }

    console.log('Updating Queue. New Queue information:');
    console.dir(updatedQueue);

    updater.setRecentSongs(updatedQueue.recentSongs);
    updater.setLastSong(updatedQueue.lastSong);
    updater.setCurrentSong(updatedQueue.currentSong);
    updater.setQueuedSongs(updatedQueue.queuedSongs); 
}

function removeDuplicates (queue) {
    
    const duplicateIds = [];
    const lastSongIds = [];

    console.log('preparing the following queue for duplication removal:');
    console.dir(queue);

    queue.lastSong.forEach(track => lastSongIds.push(track.id));

    lastSongIds.forEach(trackId => {
        const queueMatches = queue.queuedSongs.filter(song => song.id.includes(trackId));
        const recentMatches = queue.recentSongs.filter(song => song.track.id.includes(trackId));
        if (queueMatches.length > 0) {
            const queueMatchIds = [];
            queueMatches.forEach(match => queueMatchIds.push(match.id))
            duplicateIds.push(...queueMatchIds)
        };
        if (recentMatches.length > 0) {
            const recentMatchIds = [];
            recentMatches.forEach(match => recentMatchIds.push(match.track.id))
            duplicateIds.push(...recentMatchIds)};
    })

    console.log(`duplicate Ids found: ${JSON.stringify(duplicateIds)}`);
    console.log('lastSong before duplicate removal:', queue.lastSong);
    
    
    if (duplicateIds.length > 0) {
        duplicateIds.forEach(id => {
            const duplicates = queue.lastSong.filter(song => song.id.includes(id));
            console.log(`Duplicate Information:`)
            console.dir(duplicates)
            const duplicateIndexes = duplicates.forEach(duplicate => queue.lastSong.indexOf(duplicate));
            duplicateIndexes.forEach(duplicateIndex => queue.lastSong.splice(duplicateIndex));
    })}

    console.log('lastSong after duplicate removal:', queue.lastSong);

    return queue;
}


export default function UserQueue (props) {

    const [recentSongs, setRecentSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [lastSong, setLastSong] = useState([]);
    const [queuedSongs, setQueuedSongs] = useState([]);
    
    useEffect(() => { 
        
        console.log('useEffect running.');
        console.log('Trackinfo:');
        console.dir(props.trackInfo)
        console.log('currentSong:');
        console.dir(currentSong);
        

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
            lastSongDisplay =   lastSong.map((track) => (
                                    <div id='recent-song' style={{backgroundColor: 'green'}}>
                                        <h5>{track.name}</h5>
                                        <h6>{track.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                                        <button onClick={() => playHandler(track.uri)}>Play</button>
                                    </div>
                                 ));
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