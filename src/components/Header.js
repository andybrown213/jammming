import React from 'react';
import Login from './Login';
import Logout from './Logout';

function Header(props) {
    
    if (props.loggedIn === true) {
        return (
            <header>
                <h1>WELCOME! You are Logged In!</h1>
                <Logout />
            </header>
        )
    } else if (props.loggedIn === 'auth') {
        return (
            <header>
                <h1>Authorizing....</h1>
            </header>
        )
    } else {
        return (
            <header>
                <Login />
            </header>
        )
    }

}

export default Header;