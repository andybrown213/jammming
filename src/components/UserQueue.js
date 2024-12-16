import React from 'react';

export default function UserQueue (props) {

    if ((props.userQueue) && (props.loggedIn)) {

        let currentSong = {name: '', artists: ''};
        
        if (props.userQueue.currently_playing !== null) {
            currentSong = {name: props.userQueue.currently_playing.name, artists: props.userQueue[0].artists.map(artists => {return artists.name}).toString(' ')};
        }

        return (

            <div className='user-queue'>

                <h3>User Queue</h3>

                <div id='current-song'>
                    <h4>{currentSong.name}</h4>
                    <h5>{currentSong.artists}</h5>
                </div>

                {props.queue.map((item) => (
                    <div id='queued-song'>
                        <h4>{item.name}</h4>
                        <h5>{item.artists.map(artists => {return artists.name}).toString(' ')}</h5>
                    </div>
                ))}           

            </div>
        )
    }
}