import React from 'react';



function handleLogin() {


    window.open('https://gorgeous-bombolone-0ba30e.netlify.app/auth', 'Spotify Authorization Window', 'popup, width=500, height=800');


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