//import React from 'react';


function Auth() {
    
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let error = urlParams.get('error');

    async function getToken(code) {

        const codeVerifier = localStorage.getItem('code_verifier');
        const clientId = 'a1eeb89897404526bb54efd92df7a6f2';
        const redirectUri = 'https://gorgeous-bombolone-0ba30e.netlify.app/auth';
        const url = 'https://accounts.spotify.com/api/token';

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
            throw new Error(`No Response From Spotify Network. Please Try Again. Status Code: ${response.status}`);
        }   

        localStorage.setItem('access_token', json.access_token);
        document.innerHTML = 'Login Successful! Good Job!';

    }

    error === null ? getToken(code) : document.innerHTML = error;
}

export default Auth;


