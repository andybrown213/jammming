import React from 'react';
import Login from './Login';
import Logout from './Logout';

function Header(props) {
    
    if (props.loggedIn === true) {
        return (
            <header>
                <Logout />
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