//import React from 'react';

const clientId = 'a1eeb89897404526bb54efd92df7a6f2';
const redirectUri = 'https://gorgeous-bombolone-0ba30e.netlify.app/auth';

async function getCode () {

    console.log('getting auth code');
    
    const randomStringGenerator = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

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
    
    const codeVerifier = randomStringGenerator(128);
    const scope = 'user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-modify-private playlist-modify-public user-library-read user-library-modify user-read-playback-position';
    const authUrl = new URL('https://accounts.spotify.com/authorize');

    const codeChallenge = challengeCreator(codeVerifier);

    function timer(ms) {return new Promise(resolve => setTimeout(resolve, ms))};

    await timer(10000);

    console.log(`saving verifier ${codeVerifier}`);

    localStorage.setItem('code verifier', codeVerifier);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    }

    authUrl.search = new URLSearchParams(params).toString();
    document.location.href = authUrl.toString();
}

async function getToken(code) {

    const url = 'https://accounts.spotify.com/api/token';

    const codeVerifier = localStorage.getItem('code verifier');

    console.log(`retrieved verifier ${codeVerifier}`);

    const payload = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    })
    }

    let response, json;

    try {
        response = await fetch(url, payload);
        json = await response.json();
    } catch (error) {
        console.log(`Fetch Error: ${error}`);
    }
    
    console.log(response);  
    console.log(json);

    if (!response.ok) {
            const error = `We have encountered an error from Spotify. Status Code: ${response.status} Error: ${json.error} Details: ${json.error_description}`;
            document.innerHTML = error;
    }  

    localStorage.setItem('access_token', json.access_token);

    document.innerHTML = 'Login Successful! Good Job!';

}


function Auth() {
    
    if (window.location.search === '') getCode();

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let error = urlParams.get('error');

    error === null ? getToken(code) : document.innerHTML = error;

}

export default Auth;


