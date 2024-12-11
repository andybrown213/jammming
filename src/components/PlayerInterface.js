import React, {useState} from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

export default function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying ] = useState(false);

    const accessToken = localStorage.getItem('access token');

    async function getPlayerState () {

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

    useEffect(() => {

        console.log(getPlayerState());

        if (isPlaying) {

            let interval = setInterval(() => {console.log(getPlayerState())}, 3000);

        }

        return () => {if (interval) clearInterval(interval)};

    }, [isPlaying])

    
    if (props.loggedIn) {

        function playHandler() {setIsPlaying(true)};

        function pauseHandler() {setIsPlaying(false)};

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

