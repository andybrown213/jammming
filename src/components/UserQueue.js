import React, {useState, useEffect} from 'react';
import {playHandler} from './PlayerInterface';

export default function UserQueue (props) {

    const [currentSong, setCurrentSong] = useState({name: '', artists: [{name: ''}]});
    const [queuedSongs, setQueuedSongs] = useState([{name: '', artists: [{name: ''}]}]);
    
    useEffect(() => {

        console.log(props.userQueue);

        if (props.userQueue) {

            if (props.userQueue.currently_playing) {
                setCurrentSong({
                    name: props.userQueue.currently_playing.name, 
                    artists: props.userQueue.currently_playing.artists});
            } else setCurrentSong({name: '', artists: [{name: ''}]});
    
            if (props.userQueue.queue) {setQueuedSongs(props.userQueue.queue)} else setQueuedSongs([{name: '', artists: [{name: ''}]}]);

        }   
    }, [props]);    
    
    
    if ((props.userQueue) && (props.loggedIn)) {

        return (

            <div className='user-queue'>

                <h3>User Queue</h3>

                <div id='current-song'>
                    <h4>{currentSong.name}</h4>
                    <h5>{currentSong.artists.map(artists => {return artists.name}).toString(' ')}</h5>
                </div>

                {queuedSongs.map((item) => (
                    <div id='queued-song'>
                        <h5>{item.name}</h5>
                        <h6>{item.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                        <button onClick={() => playHandler(item.uri)}>Play</button>
                    </div>
                ))}           

            </div>
        )
    }
}