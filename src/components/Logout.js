import React from 'react';

function handleLogout() {
    window.localStorage.clear();
    window.location.href = 'https://gorgeous-bombolone-0ba30e.netlify.app';
}

function Logout() {

    return (
        <div id='logout'>
        <button onClick={handleLogout}>Logout</button>
        </div>   
    )
}

export default Logout;