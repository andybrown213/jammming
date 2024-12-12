import React, {useState, useEffect} from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

async function getPlayerState () {

    const accessToken = localStorage.getItem('access token');

    let json;
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}
        })

        json = await response.json();         

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('There was a Syntax Error with your request: ', error);
        } else {console.log('There was an error with your request: ', error)}
    };

    if (json.isPlaying !== true) {json.isPlaying = false};
    if (json.trackInfo === undefined | null) {json.trackInfo = {item: {name: 'Find a Song!', artist: '', album: ''}}};
    
    return json;
}

export default function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackInfo, setTrackInfo] = useState({item: {name: 'Find a Song!', artist: '', album: ''}})

    function playHandler() {setIsPlaying(true)};

    function pauseHandler() {setIsPlaying(false)};

    useEffect(() => {

        getPlayerState()
            .then((response) => {
                if (response.is_playing && (isPlaying !== response.is_playing)) {setIsPlaying(response.isPlaying)};
                if (response.is_playing && (trackInfo.id !== response.item.id)) {setTrackInfo(response.item)};
            })
            .catch((error) => console.log(`Error retrieving player status: ${error}`));

        let interval;
        
        if (isPlaying) {

            interval = setInterval(() => {
                getPlayerState()
                .then((response) => {
                    if (isPlaying !== response.is_playing) {setIsPlaying(response.isPlaying)};
                    if (trackInfo.id !== response.item.id) {setTrackInfo(response.item.id)};
                })
                .catch((error) => console.log(`Error retrieving player status: ${error}`));
            }, 3000);

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

