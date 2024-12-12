import React, {useState, useEffect} from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

async function getPlayerState () {

    const accessToken = localStorage.getItem('access token');

    let json = {is_playing: false, item: {name: 'Find a Song!', artist: '', album: ''}};
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}
        })

        if (!response) {console.log('no response from player status'); return json};

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            json = await response.json();
        } else {throw new Error('Response is not a JSON. Response: ', response)}       

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${JSON.stringify(json.error)}`)
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('There was a Syntax Error with your request: ', error);
        } else {console.log('There was an error with your request: ', error)}
    }
    
    return json;
    
}

export default function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackInfo, setTrackInfo] = useState({item: {name: 'Find a Song!', artist: '', album: ''}})

    function playHandler() {setIsPlaying(true)};

    function pauseHandler() {setIsPlaying(false)};

    function syncInterface() {
        getPlayerState()
        .then((response) => {
            if (response.is_playing && (isPlaying !== response.is_playing)) {setIsPlaying(response.is_playing)};
            if (response.item && (trackInfo.id !== response.item.id)) {setTrackInfo(response.item)};
        })
        .catch((error) => console.log(`Error retrieving player status: ${error}`));
    }

    useEffect(() => {
        
        let interval;
        
        if (props.loggedIn) {

            syncInterface();
        
            if (isPlaying) {interval = setInterval(() => {syncInterface()}, 3000)};

        }   

        return () => {if (interval) clearInterval(interval)};

    }, [isPlaying, trackInfo])

    
    if (props.loggedIn) {

        return (

            <div className="player-interface">
    
                <RecordPlayer isPlaying={isPlaying} />
    
                <NowPlaying trackInfo={trackInfo} />

                <div id='player-controls'>

                    <button>Previous</button>
                    <button onClick={isPlaying ? pauseHandler : playHandler}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button>Next</button>

                </div>    
    
            </div>
    
        )
    } 
}

