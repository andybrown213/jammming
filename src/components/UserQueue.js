import React, {useState} from 'react';

export default function UserQueue (props) {

    const [currentSong, setCurrentSong] = useState({name: '', artists: [{name: ''}]});
    const [queuedSongs, setQueuedSongs] = useState([{name: '', artists: [{name: ''}]}])
    
    if ((props.userQueue) && (props.loggedIn)) {
        
        if (props.userQueue.currently_playing !== null) {
            setCurrentSong({
                name: props.userQueue.currently_playing.name, 
                artists: props.userQueue[0].artists.map(artists => {return artists.name}).toString(' ')});
        }

        if (props.userQueue.queue) {setQueuedSongs(props.userQueue.queue)};

        return (

            <div className='user-queue'>

                <h3>User Queue</h3>

                <div id='current-song'>
                    <h4>{currentSong.name}</h4>
                    <h5>{currentSong.artists}</h5>
                </div>

                {queuedSongs.map((item) => (
                    <div id='queued-song'>
                        <h4>{item.name}</h4>
                        <h5>{item.artists.map(artists => {return artists.name}).toString(' ')}</h5>
                    </div>
                ))}           

            </div>
        )
    }
}