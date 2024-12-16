import React, {useState, useEffect} from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

async function getPlayerState () {

    const accessToken = localStorage.getItem('access token');

    let json = {is_playing: false, item: {name: 'Find a Song!', artists: [{name: ''}], album: {name: ''}}};
    
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

function syncInterface(current, updater) {

    getPlayerState()
    .then((response) => {
        if (current.isPlaying !== response.is_playing) {updater.setIsPlaying(response.is_playing)};
        if (current.trackInfo.id !== response.item.id) {updater.setTrackInfo(response.item)};
    })
    .catch((error) => console.log(`Error retrieving player status: ${error}`));
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

export async function playHandler(uri, setIsPlaying) {

    try{
        const accessToken = localStorage.getItem('access token')

        let response;

        if (uri) {
    
            let reqBody = JSON.stringify({context_uri: uri});

            response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=346b6f8e191335c432116dc4ed9829adbfe95ba8', {
                method: 'put', headers: {Authorization: `Bearer ${accessToken}`},
                body: reqBody
            })

        } else {
            response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=346b6f8e191335c432116dc4ed9829adbfe95ba8', {
                method: 'put', headers: {Authorization: `Bearer ${accessToken}`}});
        }
        
        setIsPlaying(true);

        if (!response.ok) {
            throw new Error(`status code: ${response.status}`);
        }

    } catch (error) {console.log(`playback error: ${error}`)};
}

export async function pauseHandler(setIsPlaying) {

    const accessToken = localStorage.getItem('access token');

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'put', headers: {Authorization: `Bearer ${accessToken}`}});

        if (!response.ok) {
            throw new Error(`status code: ${response.status}`);
        }
        
    } catch (error) {console.log(`pause error: ${error}`)};
}

const blankTrack = {name: 'Find a Song!', artists: [{name: ''}], album: {name: ''}};

export default function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackInfo, setTrackInfo] = useState(blankTrack);

    useEffect(() => {
        
        let interval;
        
        if (props.loggedIn) {

            const current = {isPlaying, trackInfo}, updater = {setIsPlaying, setTrackInfo};
            syncInterface(current, updater);
        
            interval = setInterval(() => {syncInterface(current, updater)}, 1000);

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

                    <button onClick={getDevices}>Devices</button>
                    <button>Previous</button>
                    <button onClick={isPlaying ? () => {pauseHandler(setIsPlaying)}
                        : () => {playHandler('', setIsPlaying)}}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button>Next</button>

                </div>    
    
            </div>
    
        )
    } 
}

