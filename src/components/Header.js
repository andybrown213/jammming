import React from 'react';

function handleLogout() {
    window.localStorage.clear();
    window.location.reload();
}

function handleLogin() {
    window.open('https://gorgeous-bombolone-0ba30e.netlify.app/auth', 'Spotify Authorization Window', 'popup, width=500, height=800');
}

function Header(props) {
    
    if (props.loggedIn === true) {
        return (
            <header>
                <img src={props.userProfile.images[0]} alt='profile'/>
                <h2>{props.userProfile ? `, ${props.userProfile.display_name}` : ''}</h2>
                <button onClick={handleLogout}>Logout</button>
            </header>
        )
    } else {
        return (
            <header>
                <h1>Are you ready to Jammm?!</h1>
                <button onClick={handleLogin}>Connect Your Spotify</button>  
            </header>
        )
    }
}

export default Header;