import React from 'react';
import spinningRecord from '../spinning-record.png';
import recordPlayer from '../record-player.png'

function RecordPlayer() {
    return (

        <div className="record-player">

        <img src={recordPlayer} id='record-player' alt='record player' />

        <img src={spinningRecord} id="spinning-record" alt="spinning record" />

        </div>

    )
}

export default RecordPlayer;



