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
        
        if (response.status === 204) {
            console.log(`No response from player status. Default Response: ${JSON.stringify(response)}`);
            return json;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            json = await response.json();
        } else {throw new Error('Response is not a JSON. Response: ', response)}       

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${JSON.stringify(json)}`)
        }

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('There was a Syntax Error with your request: ', error);
        } else {console.log('There was an error with your request: ', error)}
    }
    
    console.log(`Player Status Retrieved: ${JSON.stringify(json)}`);
    return json;
    
}

async function getDevices() {

    let accessToken = localStorage.getItem('access token');

    let json;

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}
        })

        json = await response.json();

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${JSON.stringify(json)}`)
        }

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('There was a Syntax Error with your request: ', error);
        } else {console.log('There was an error with your request: ', error)}
    }

    console.log(json);
}

function syncInterface(current, updater) {

    getPlayerState()
    .then((response) => {
        if (current.isPlaying !== response.is_playing) {updater.setIsPlaying(response.is_playing)};
        if (current.trackInfo.id !== response.item.id) {updater.setTrackInfo(response.item)};
    })
    .catch((error) => console.log(`Error retrieving player status: ${error}`));
}

export default function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackInfo, setTrackInfo] = useState({name: 'Find a Song!', artists: [{name: ''}], album: {name: ''}});

    function playHandler() {setIsPlaying(true)};

    function pauseHandler() {setIsPlaying(false)};


    useEffect(() => {
        
        let interval;
        
        if (props.loggedIn) {

            const current = {isPlaying, trackInfo}, updater = {setIsPlaying, setTrackInfo};
            syncInterface(current, updater);
        
            if (isPlaying) {interval = setInterval(() => {syncInterface(current, updater)}, 3000)};

            console.log(isPlaying, trackInfo);
        }   

        return () => {if (interval) clearInterval(interval)};

    }, [isPlaying, trackInfo, props.loggedIn])

    
    if (props.loggedIn) {

        return (

            <div className="player-interface">
    
                <RecordPlayer isPlaying={isPlaying} />
    
                <NowPlaying trackInfo={trackInfo} />

                <div id='player-controls'>

                    <button onClick={getDevices}>Get Devices</button>
                    <button>Previous</button>
                    <button onClick={isPlaying ? pauseHandler : playHandler}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button>Next</button>

                </div>    
    
            </div>
    
        )
    } 
}

