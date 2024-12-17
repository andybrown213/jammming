import React, {useState, useEffect} from 'react';
import {playHandler} from './PlayerInterface';

export default function UserQueue (props) {

    const [recentSongs, setRecentSongs] = useState([{track: {name: '', artists: [{name: ''}]}}]);
    const [currentSong, setCurrentSong] = useState({name: '', artists: [{name: ''}]});
    const [queuedSongs, setQueuedSongs] = useState([{name: '', artists: [{name: ''}]}]);
    
    useEffect(() => {        

        if (props.recentlyPlayed) {
            console.log(props.recentlyPlayed.items);
            setRecentSongs(props.recentlyPlayed.items.toSorted((a, b) => (a.played_at - b.played_at)));
            console.log(recentSongs);
        } else {
            setRecentSongs([{track: {name: 'Nothing Played Recently', artists: [{name: ''}]}}]);
        }
        
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

    console.log(recentSongs);
    
    if ((props.userQueue) && (props.loggedIn)) {

        return (

                <div className='right-side-container'>
                
                <h3 id='user-queue-header'>Queue</h3>

                <div className='user-queue'>                

                {recentSongs.map((item) => (
                    <div id='recent-song'>
                        <h5>{item.track.name}</h5>
                        <h6>{item.track.artists.map(artist => {return artist.name}).toString(' ')}</h6>
                        <button onClick={() => playHandler(item.track.uri)}>Play</button>
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
                </div>
        )
    }
}