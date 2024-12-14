import React from 'react';
import playHandler from './PlayerInterface';


function UserPlaylists (props) {

    if ((props.userPlaylists) && (props.loggedIn)) {

        return (
            <div className='user-playlists'>

                <h3>Your Playlists</h3>
    
                {props.userPlaylists.items.map((item) => (
                    <div className='playlist'>
                        <h4>{item.name ? item.name : 'No Name Playlist..'}</h4>
                        <h5>owner: {item.owner.display_name}</h5>
                        <button onClick={(item) => playHandler(item.uri)}>Play</button>
                    </div>
                ))}
    
            </div>
        )
    }
}

export default UserPlaylists;