import React from 'react';
import { playHandler } from './PlayerInterface';


function UserPlaylists (props) {

    if ((props.userPlaylists) && (props.loggedIn)) {

        return (
            
            <div className='left-side-container'>

            <h3 id='user-playlists-header'>Your Playlists</h3>

            <div className='user-playlists'>
    
                {props.userPlaylists.items.map((item) => (
                    <div className='playlist'>
                        <h5>{item.name ? item.name : 'No Name Playlist..'}</h5>
                        <h6>{item.description ? item.description : 'No Description'}</h6>
                        <button onClick={() => playHandler(item.uri)}>Play</button>
                    </div>
                ))}
    
            </div>
            </div>
        )
    }
}

export default UserPlaylists;