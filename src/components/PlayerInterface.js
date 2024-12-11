import React, {useState} from 'react';
import RecordPlayer from './RecordPlayer'
import NowPlaying from './NowPlaying'

function PlayerInterface(props) {
    
    const [isPlaying, setIsPlaying ] = useState(false);

    
    if (props.loggedIn) {

        function playHandler() {setIsPlaying(true)};

        function pauseHandler() {setIsPlaying(false)};

        console.log('render record player and now playing info');

        return (

            <div className="player-interface">
    
                <RecordPlayer isPlaying={isPlaying} />;
    
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

export default RecordPlayer;