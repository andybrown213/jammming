import React, {useEffect} from 'react';
import spinningRecord from '../spinning-record.png';
import recordPlayer from '../record-player.png'

function RecordPlayer(props) {
    
    //const [isPlaying, setIsPlaying ] = useState(false);

    
    useEffect(() => {
        if (props.loggedIn) {

            console.log('record playing use effect');

        }
    }, [props.loggedIn])
    
    return (

        <div className="record-player">

            <img src={recordPlayer} id='record-player' alt='record player' />

            <img src={spinningRecord} id="spinning-record" alt="spinning record" />

            <div id='now-playing'>

                <h5>Current Song</h5>
                <h6>Artist</h6>
                <h6>Album</h6>

            </div>

        </div>

    )
}

export default RecordPlayer;



