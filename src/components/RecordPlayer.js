import React from 'react';
import spinningRecord from '../spinning-record.png';
import recordPlayer from '../record-player.png'


export default function RecordPlayer(props) {

    let recordAnimation;
    
    props.isPlaying ? recordAnimation = 'spinning-record-spin infinite 1.8s linear running' : recordAnimation = 'spinning-record-spin infinite 1.8s linear paused';
    
    return (

        <>
        <img src={recordPlayer} id='record-player' alt='record player' />
        <img src={spinningRecord} id="spinning-record" style={{animation: recordAnimation}} alt="spinning record" />
        </>

    )
}


