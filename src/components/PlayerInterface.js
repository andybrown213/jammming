import React from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

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

export async function playHandler(uri) {

    console.log(`Attempting to play song with uri: `, uri);
    
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

        if (!response.ok) {
            throw new Error(`status code: ${response.status}`);
        }

    } catch (error) {console.log(`playback error: ${error}`)};
}

export async function pauseHandler() {

    const accessToken = localStorage.getItem('access token');

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'put', headers: {Authorization: `Bearer ${accessToken}`}});

        if (!response.ok) {
            throw new Error(`status code: ${response.status}`);
        }
        
    } catch (error) {console.log(`pause error: ${error}`)};
}

async function nextHandler() {

    const accessToken = localStorage.getItem('access token');

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'post', headers: {Authorization: `Bearer ${accessToken}`}});

        if (!response.ok) {
            throw new Error(`status code: ${response.status}`);
        }
        
    } catch (error) {console.log(`Skip to next error: ${error}`)};
}

async function prevHandler() {

    const accessToken = localStorage.getItem('access token');

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'post', headers: {Authorization: `Bearer ${accessToken}`}});

        if (!response.ok) {
            throw new Error(`status code: ${response.status}`);
        }
        
    } catch (error) {console.log(`Skip to previous error: ${error}`)};
}

export default function PlayerInterface(props) {
    
    if (props.loggedIn) {

        return (

            <div className="player-interface">
    
                <RecordPlayer isPlaying={props.isPlaying} />
    
                <NowPlaying trackInfo={props.trackInfo} />

                <div className='player-controls'>

                    <button onClick={getDevices}>Devices</button>
                    <button onClick={prevHandler}>Previous</button>
                    <button onClick={props.isPlaying ? pauseHandler : () => {playHandler('')}}>{props.isPlaying ? 'Pause' : 'Play'}</button>
                    <button onClick={nextHandler}>Next</button>

                </div>    
    
            </div>
    
        )
    } 
}

