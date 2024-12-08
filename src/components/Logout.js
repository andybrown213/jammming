import React from 'react';

function handleLogout() {
    window.localStorage.clear();
    window.location.reload();
}

function Logout() {

    const accessToken = localStorage.getItem('access token');

    async function getProfile(accessToken) {

        const result = await fetch('https://api.spotify.com/v1/me', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
        });

        const json = await result.json();

        console.log(result);
        console.log(json);
        

        return json;

    }

    const profile = getProfile(accessToken).then(
            (response) => {return response}
        )

    return (
        <div id='logout'>
        <h2>Welcome, {profile.display_name}!</h2>
        <button onClick={handleLogout}>Logout</button>
        </div>   
    )
}

export default Logout;