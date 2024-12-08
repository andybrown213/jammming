import React from 'react';

function handleLogout() {
    window.localStorage.clear();
    window.location.reload();
}

function Logout() {

    const accessToken = localStorage.getItem('access token');

    async function getProfile(accessToken) {

        const result = await fetch('https://api.spitify.v1.me', {
            method: 'get', headers: {Authorization: `Bearer ${accessToken}`}           
        });

        return await result.json();

    }

    const profile = getProfile(accessToken);

    return (
        <div id='logout'>
        <h2>Welcome, {profile.id}!</h2>
        <button onClick={handleLogout}>Logout</button>
        </div>   
    )
}

export default Logout;