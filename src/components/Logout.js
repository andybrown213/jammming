import React from 'react';

function handleLogout() {
    window.localStorage.clear();
    window.location.reload();
}

function Logout() {

    const accessToken = localStorage.getItem('access token');

    let userProfile;

    async function getProfile(accessToken) {

        const response = await fetch('https://api.spotify.com/v1/me', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(`status code: ${response.status} Error: ${json.error} Description: ${json.error_description}`)
        } else return json;

    }

    if (!userProfile) {
        getProfile(accessToken)
        .then(response => userProfile = response)
        .then(console.log(userProfile))
        .catch(error => console.log(`Error fetching user data: ${error}`));
    }



    return (
        <div id='logout'>
        <h2>Welcome{userProfile ? `, ${userProfile.display_name}` : ''}!</h2>
        <button onClick={handleLogout}>Logout</button>
        </div>   
    );
}

export default Logout;