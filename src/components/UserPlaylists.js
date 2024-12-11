import React from 'react';


async function playHandler(uri) {

    const accessToken = localStorage.getItem('access_token')
    
    try{
        await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'put', headers: {Authorization: `Bearer ${accessToken}`},
            body: {context_uri: uri}
        })

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
        }
    } catch (error) {console.log(error)};
}



function UserPlaylists (props) {

    if ((props.userPlaylists) && (props.loggedIn)) {

        console.log(props.userPlaylists);

        return (
            <div className='user-playlists'>

                <h3>Your Playlists</h3>
    
                {props.userPlaylists.items.map((item) => (
                    <div className='playlist'>
                        <h4>{item.name ? item.name : 'No Name Playlist..'}</h4>
                        <h5>owner: {item.owner.display_name}</h5>
                        <button onClick={(item.uri) => playHandler(item.uri)}>Play</button>
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