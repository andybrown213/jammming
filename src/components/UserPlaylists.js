import React from 'react';

function UserPlaylists (props) {

    if ((props.userPlaylists) && (props.loggedIn)) {

        console.log(props.userPlaylists);

        return (
            <div className='user-playlists'>

                <h3>Your Playlists</h3>
    
                {props.userPlaylists.items.map((item) => (
                    <div className='playlist'>
                        <h4>{item.name ? item.name : 'No Name Playlist..'}</h3>
                        <h5>Owner: {item.owner.display_name}</h4>
                    </div>
                ))}
    
            </div>
        )
    } else {

        return (

            <div className='user-playlists'>
                <h3>Log in to see your playlists</h3>
            </div>

        )
    }
}

export default UserPlaylists;