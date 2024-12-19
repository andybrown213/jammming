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
      
      console.log(`Recently Played Fetch Request Status Code: ${response.status}`);
    
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
    
    const recentlyPlayed = await recentlyPlayedResponse.items;

    const queueResponse = await userQueueResponse.queue;

    const currentSongResponse = await userQueueResponse.currently_playing;

    //console.log('Responses for the queue back? :', recentlyPlayedResponse, userQueueResponse);

    if (current.recentSongs !== recentlyPlayed) {
        updatedQueue.recentSongs = recentlyPlayed;
        //console.log('Recent Songs returned and saved:');
        //console.dir(updatedQueue.recentSongs);
    } else {updatedQueue.recentSongs = current.recentSongs};

    if (current.queuedSongs !== queueResponse) {
        updatedQueue.queuedSongs = queueResponse;
    } else {updatedQueue.queuedSongs = current.queuedSongs};

    if (current.currentSong !== currentSongResponse) {
        if (current.lastSong.length > 0) {updatedQueue.lastSong = [...current.lastSong]};        
        if (Object.values(current.currentSong).length > 0) {
            updatedQueue.lastSong.push(current.currentSong);
        };
        updatedQueue.currentSong = currentSongResponse;
        if (updatedQueue.lastSong.length > 0) {
            //console.log('queue right before using remove duplicate function:');
            //console.dir(updatedQueue);
            updatedQueue = removeDuplicates(updatedQueue)
        };        
    }

    console.log('Updating Queue. New Queue information:');
    console.dir(updatedQueue);

    updater.setRecentSongs(updatedQueue.recentSongs);
    updater.setLastSong(updatedQueue.lastSong);
    updater.setCurrentSong(updatedQueue.currentSong);
    updater.setQueuedSongs(updatedQueue.queuedSongs);

}

function removeDuplicates (queue) {
    
    const duplicateIds = [] , queuedSongIds = [], lastSongIds = [], recentSongIds = [];


    //console.log('preparing the following queue for duplication removal:');
    //console.dir(queue);

    queue.lastSong.forEach(song => lastSongIds.push(song.id));
    queue.queuedSongs.forEach(song => queuedSongIds.push(song.id));
    queue.recentSongs.forEach(song => recentSongIds.push(song.track.id));

    lastSongIds.forEach(trackId => {
        const queueMatches = queuedSongIds.filter(id => id === trackId);
        const recentMatches = recentSongIds.filter(id => id === trackId);
        if (trackId === queue.currentSong.id) {duplicateIds.push(trackId)};
        if (queueMatches.length > 0) {
            console.log(`Queue matches found in last songs.`)
            duplicateIds.push(...queueMatches);
        };
        if (recentMatches.length > 0) {
            console.log(`Recent song matches found in last songs.`)
            duplicateIds.push(...recentMatches)};
    })

    console.log(`duplicate Ids found: ${JSON.stringify(duplicateIds)}`);
    //console.log('lastSong before duplicate removal:', queue.lastSong);
    
    
    if (duplicateIds.length > 0) {
        const duplicateIndexes = [];
        duplicateIds.forEach(id => {
            duplicateIndexes.push(lastSongIds.indexOf(id));
        })
        duplicateIndexes.sort(function(a,b){ return b - a; });
        duplicateIndexes.forEach(index => {
            console.log(`Removing duplicate ${queue.lastSong[index].name} from last songs.`);
            queue.lastSong.splice(index, 1);
        })
    }

    lastSongIds.splice(0);
    queue.lastSong.forEach(song => lastSongIds.push(song.id));

    
    //console.log('lastSong after duplicate removal:', queue.lastSong);

    console.log('removing duplicates from recent songs. Recent Songs Before:')
    console.dir(queue.recentSongs);

    const recentSongDuplicates = [];
    queue.recentSongs.forEach(song => {        
        let instanceCounter = 0;
        recentSongIds.forEach(id => {
            //console.log(`comparing id: ${id} to song ${song.track.name} with id ${song.track.id}`);
            if (id === song.track.id) {
                instanceCounter++;
                console.log(`increasing instance counter. counter now at ${instanceCounter}`);
            }
        })
        if (instanceCounter > 1) {
            console.log(`${instanceCounter} instances of ${song.track.id} found.`);
            recentSongDuplicates.push(song.track.id);
            console.log(`duplicate added: ${song.track.name}`);
            instanceCounter = 0;
        } else instanceCounter = 0;
    })
    if (recentSongDuplicates.length > 0) {
        const matchIndex = [];
        recentSongDuplicates.forEach(duplicate => matchIndex.push(recentSongIds.indexOf(duplicate)));
        console.log(`indexes of duplicates in recent songs. checking for redundancy. ${matchIndex}`);
        matchIndex.sort(function(a,b){ return b - a; });
        matchIndex.forEach(index => {
            console.log(`Removing duplicate ${queue.recentSongs[index].track.name} from recent songs.`);
            queue.recentSongs.splice(index, 1);
        })
    }

    recentSongIds.splice(0);
    queue.recentSongs.forEach(song => recentSongIds.push(song.track.id));
    
    
    //console.log('Recent Songs After:')
    //console.dir(queue.recentSongs);

    const currentMatchWithRecent = queue.recentSongs.filter(song => song.track.id.includes(queue.currentSong.id))
    if (currentMatchWithRecent.length > 0) {
        const matchIndex = [];
        matchIndex.push(recentSongIds.indexOf(queue.currentSong.id));
        console.log(`Removing duplicate ${queue.recentSongs[matchIndex].track.name} from recent songs.`);
        queue.recentSongs.splice(matchIndex, 1);
        recentSongIds.splice(0);
        queue.recentSongs.forEach(song => recentSongIds.push(song.track.id));
    }

    const currentMatchWithQueue = queue.queuedSongs.filter(song => song.id.includes(queue.currentSong.id))
    if (currentMatchWithQueue.length > 0) {
        const matchIndex = [];
        matchIndex.push(queuedSongIds.indexOf(queue.currentSong.id));
        console.log(`Removing duplicate ${queue.queuedSongs[matchIndex].name} from queued songs.`);
        queue.queuedSongs.splice(matchIndex, 1);
        queuedSongIds.splice(0);
        queue.queuedSongs.forEach(song => queuedSongIds.push(song.id));
    }

    
    //checking recent songs against queued songs
    
    recentSongIds.forEach(trackId => {
        const matches = queuedSongIds.filter(id => id === trackId);
        if (matches.length > 0) {
            const matchIndex =[];
            matches.forEach(match => matchIndex.push(recentSongIds.indexOf(match)));
            matchIndex.sort(function(a,b){ return b - a; });
            matchIndex.forEach(index => {
                console.log(`duplicate found in recent and queue. Removing ${queue.recentSongs[index].track.name} from recent songs.`);
                queue.recentSongs.splice(index, 1);
            })
        }
    })

    return queue;
}

function scrollToCurrentSong (recentSongsCount, lastSongCount) {     

    console.log(`scrolling to current song. There are ${recentSongsCount} recent songs and ${lastSongCount} last songs.`);  
    const userQueueWindow = document.getElementsByClassName('user-queue')[0];
    const recentSongHeight = document.getElementById('recent-song').offsetHeight;
    const currentSongPosition = (recentSongsCount + lastSongCount) * recentSongHeight;
    const currentScrollPosition = userQueueWindow.scrollTop;
    const queueWindowHeight = userQueueWindow.offsetHeight;
    const queueWindowBottom = queueWindowHeight + currentScrollPosition;

    console.log(`Queue is ${queueWindowHeight}px tall. Current scroll position is ${currentScrollPosition}. Current song is located ${currentSongPosition} down.`);

    if (queueWindowBottom < currentSongPosition) {
        console.log(`current song is located off the screen to the bottom. Scrolling to current song.`);
        userQueueWindow.scrollTop += (currentSongPosition - currentScrollPosition);
    }

    if (currentScrollPosition > currentSongPosition) {
        console.log(`current song is located off the screen to the top. Scrolling to current song.`);
        userQueueWindow.scrollTop -= (currentScrollPosition - currentSongPosition);
    }
}


export default function UserQueue (props) {

    const [recentSongs, setRecentSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState({});
    const [lastSong, setLastSong] = useState([]);
    const [queuedSongs, setQueuedSongs] = useState([]);
    
    useEffect(() => { 
        
        //console.log('useEffect running.');
        //console.log('Trackinfo:');
        //console.dir(props.trackInfo)
        //console.log('currentSong:');
        //console.dir(currentSong);
        

        if ((Object.values(currentSong) < 1) && (props.loggedIn)) {
            const current = {recentSongs, currentSong, lastSong, queuedSongs};
            const updater = {setRecentSongs, setCurrentSong, setLastSong, setQueuedSongs};
            refreshQueue(current, updater);
        } else if ((props.loggedIn) && (props.trackInfo.id !== currentSong.id)) {
            const current = {recentSongs, currentSong, lastSong, queuedSongs};
            const updater = {setRecentSongs, setCurrentSong, setLastSong, setQueuedSongs};
            refreshQueue(current, updater);
        }

    }, [props.trackInfo, props.loggedIn, recentSongs, currentSong, lastSong, queuedSongs]); 
    
    useEffect(() => {

        scrollToCurrentSong(recentSongs.length, lastSong.length);

    }, [recentSongs.length, lastSong.length])
    
    
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

        
        if (Object.values(currentSong).length > 0) {
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

                        {scrollToCurrentSong}

                    </div>
                </div>
        )
    }
}