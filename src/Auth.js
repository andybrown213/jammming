import React from 'react';

function Auth() {

    const clientId = 'a1eeb89897404526bb54efd92df7a6f2';
    const redirectUri = 'https://gorgeous-bombolone-0ba30e.netlify.app/auth';

    async function createChallenge() {

        console.log('creating verifier and challenge');
    
        const randomStringGenerator = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }

        async function challengeCreator(codeVerifier) {
    
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
        
            const hashed = await sha256(codeVerifier);

            console.log(`hash is : ${hashed}`);

            const codeChallenge = base64encode(hashed);

            console.log(`challenge created on code verifier ${codeVerifier} inside creation function: ${codeChallenge}`);
        
            return codeChallenge;
        }
    
        const codeVerifier = randomStringGenerator(128);

        const codeChallenge = await challengeCreator(codeVerifier);

        console.log(`code challenge: ${codeChallenge}`);

        console.log(`saving verifier ${codeVerifier}`);

        localStorage.setItem('code verifier', codeVerifier);
        localStorage.setItem('code challenge', codeChallenge);
    }

    function getCode () {

        const scope = 'user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-modify-private playlist-modify-public user-library-read user-library-modify user-read-playback-position';
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        const codeChallenge = localStorage.getItem('code challenge');
        
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
        })}
        
        console.log(`Payload Verifier: ${payload.body.codeVerifier} Paylod Code: ${payload.body.code}`);
    
        let response, json;
    
        try {
            response = await fetch(url, payload);
            json = await response.json();
            if (!response.ok) {
                document.body.innerHTML = `We have encountered an error from Spotify. Status Code: ${response.status} Error: ${json.error} Details: ${json.error_description}`;
            }  
        } catch (error) {
            document.body.innerHTML = `Fetch Error: ${error}`;
        }
        
        console.log(response);  
        console.log(json);
    
    
    
        localStorage.setItem('access_token', json.access_token);

        console.log('access token saved');

        window.opener.location.reload();
    
        document.body.innerHTML = 'Login Successful! Good Job!';
    
    }
    
    if (window.location.search === '') {   

        return (

        <>
        <button onClick={createChallenge}>Create Verifier and Challenge</button>
        <h3>Ready to request a code? Press the button!</h3>
        <button onClick={getCode}>BUTTON</button>
        </>

    )} else {
        
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        let error = urlParams.get('error');
    
        return (

            <>
            <h3>code retreived from URL: {code}</h3>
            <h3>error retrieved from URL: {error}</h3>
            <button onClick={() => getToken(code)}>LETS GET THAT TOKEN</button>
            </>

    )}    
}

export default Auth;


