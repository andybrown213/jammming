import React from 'react';

function Header() {

    const randomStringGenerator = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    
    const codeVerifier = randomStringGenerator(128);

    /*
    
    const sha256 = async (plain) => {
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

    async function userConnect() {
        const authUrl = new URL("https://accounts.spotify.com/authorize");
        
    } */

    return (
        <header>

        <h1>Are you ready to Jammmm?!</h1>
        <button>Connect Your Spotify</button>
        <p>{crypto.getRandomValues(new Uint8Array(128))}</p>
        <p>{codeVerifier}</p>

        </header>
    );

}



export default Header;