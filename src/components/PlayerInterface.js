import React, {useState, useEffect} from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

async function getPlayerState () {

    const accessToken = localStorage.getItem('access token');

    let json;
    
    try {
        const response = fetch('https://api.spotify.com/v1/me/player', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}
        })

        json = await response.json();         

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
        }
    } catch (error) {console.log(error)};

    return json;
}

export default function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying ] = useState(false);

    function playHandler() {setIsPlaying(true)};

    function pauseHandler() {setIsPlaying(false)};

    useEffect(() => {

        console.log(getPlayerState());

        let interval;
        
        if (isPlaying) {

            interval = setInterval(() => {console.log(getPlayerState())}, 3000);

        }

        return () => {if (interval) clearInterval(interval)};

    }, [isPlaying])

    
    if (props.loggedIn) {

        return (

            <div className="player-interface">
    
                <RecordPlayer isPlaying={isPlaying} />
    
                <NowPlaying />

                <div id='player-controls'>

                    <button>Previous</button>
                    <button onClick={isPlaying ? pauseHandler : playHandler}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button>Next</button>

                </div>    
    
            </div>
    
        )
    } 
}

