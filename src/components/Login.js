import React from 'react';

function challengeCreator(codeVerifier) {
    
    const sha256 = (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }
    
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
          .replace(/=/g, '')
          .replace(/\+/g, "-")
          .replace(/\//g, '_');
    }
    
    const hashed = sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    
    return codeChallenge;
}

function handleLogin() {

    const randomStringGenerator = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    
    const codeVerifier = randomStringGenerator(128);
    const clientId = 'a1eeb89897404526bb54efd92df7a6f2';
    const redirectUri = 'https://gorgeous-bombolone-0ba30e.netlify.app/auth';
    const scope = 'user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-modify-private playlist-modify-public user-library-read user-library-modify user-read-playback-position';
    const authUrl = new URL('https://accounts.spotify.com/authorize');

    const codeChallenge = challengeCreator(codeVerifier);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    }

    authUrl.search = new URLSearchParams(params).toString();
    const authWindow = window.open(authUrl.toString(), 'Spotify Authorization Window', 'popup, width=500, height=800');

    authWindow.postMessage(codeVerifier, 'https://gorgeous-bombolone-0ba30e.netlify.app');
}

function Login() {

    return (
        <div id='login'>
        <h1>Are you ready to Jammm?!</h1>
        <button onClick={handleLogin}>Connect Your Spotify</button>
        </div>    
    )
}

export default Login;