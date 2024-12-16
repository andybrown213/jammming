import React, {useState, useEffect} from 'react';
import {playHandler} from './PlayerInterface';

export default function UserQueue (props) {

    const [recentSongs, setRecentSongs] = useState([{track: {name: '', artists: [{name: ''}]}}]);
    const [currentSong, setCurrentSong] = useState({name: '', artists: [{name: ''}]});
    const [queuedSongs, setQueuedSongs] = useState([{name: '', artists: [{name: ''}]}]);
    
    useEffect(() => {        

        if (props.recentlyPlayed) {
            setRecentSongs(props.recentlyPlayed.items);
        } else setRecentSongs([{track: {name: '', artists: [{name: ''}]}}])
        
        if (props.userQueue) {

            if (props.userQueue.currently_playing) {
                setCurrentSong({
                    name: props.userQueue.currently_playing.name, 
                    artists: props.userQueue.currently_playing.artists});
            } else setCurrentSong({name: '', artists: [{name: ''}]});
    
            if (props.userQueue.queue) {
                setQueuedSongs(props.userQueue.queue)
            } else setQueuedSongs([{name: '', artists: [{name: ''}]}]);
        }   
    }, [props]);    
    
    if ((props.userQueue) && (props.loggedIn)) {

        return (

            <div className='user-queue'>

                <h3>Queue</h3>

                {recentSongs.map((item) => (
                    <div id='recent-song'>
                        <h5>{item.track.name}</h5>
                        <h6>{item.track.artists.map(artist => {return artist.name}).toString(' ')}</h6>
                    </div>
                ))}

                <div id='current-song'>
                    <h5>{currentSong.name}</h5>
                    <h6>{currentSong.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                </div>

                {queuedSongs.map((track) => (
                    <div id='queued-song'>
                        <h5>{track.name}</h5>
                        <h6>{track.artists.map(artists => {return artists.name}).toString(' ')}</h6>
                        <button onClick={() => playHandler(track.uri)}>Play</button>
                    </div>
                ))}           

            </div>
        )
    }
}