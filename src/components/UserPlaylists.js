import React from 'react';


async function playHandler(uri) {

    const accessToken = localStorage.getItem('access token')

    let json;
    let reqBody = JSON.stringify({context_uri: uri});
    
    try{
        const response = await fetch('https://api.spotify.com/v1/me/player/play?device_id=3a9c0ee7381b1d52270601c18a83485d61cc6ddd', {
            method: 'put', headers: {Authorization: `Bearer ${accessToken}`},
            body: reqBody
        })

        json = await response.json();

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Message: ${JSON.stringify(json)}`);
        }
    } catch (error) {console.log(error)};
}



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