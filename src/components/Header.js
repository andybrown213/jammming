import React from 'react';
import Login from './Login';

function Header(props) {
    
    if (props.loggedIn === true) {
        return (
            <h1>WELCOME! You are Logged In!</h1>
        )
    } else if (props.loggedIn === 'auth') {
        return (
            <h1>Authorizing....</h1>
        )
    } else {
        return (

            <Login />

        )
    }

}

export default Header;