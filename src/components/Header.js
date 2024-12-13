import React from 'react';
import spotifyLogo from '.././Spotify_Primary_Logo_RGB_Black.png'

function handleLogout() {
    window.localStorage.clear();
    window.location.reload();
}

function handleLogin() {
    window.open('https://gorgeous-bombolone-0ba30e.netlify.app/auth', 'Spotify Authorization Window', 'popup, width=500, height=800');
}

function Header(props) {

    let profilePicture, profileName;

    if ((props.userProfile) && (props.loggedIn)) {
        if (props.userProfile.images[0]) {profilePicture = props.userProfile.images[0]['url']}
        profileName = props.userProfile.display_name;
    }
    
    if (props.loggedIn === true) {
        return (
            <header>
                <img src={profilePicture ? profilePicture : spotifyLogo} alt='profile' />
                <h3>{profileName ? profileName : ''}</h3>
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