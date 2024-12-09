import React from 'react';

function UserPlaylists (props) {

    console.log(props.userPlaylists);
    
    return (
        <div className='user-playlists'>

            {props.userPlaylists.map.items((item) => {
                <div id='playlist'>
                    <h3>{item.id}</h3>
                    <h4>Owner: {item.owner}</h4>
                </div>
            })}

        </div>
    )
}

export default UserPlaylists;