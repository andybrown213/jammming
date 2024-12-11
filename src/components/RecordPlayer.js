import React from 'react';
import spinningRecord from '../spinning-record.png';
import recordPlayer from '../record-player.png'


export default function RecordPlayer(props) {

    
    if (props.isPlaying) {
        document.getItemById('spinning-record').style.animation = 'spinning-record-spin infinite 1.8s linear';
    } else {document.getItemById('spinning-record').style.animation = 'spinning-record-spin infinite 1.8s linear'}
    
    return (

        <>
        <img src={recordPlayer} id='record-player' alt='record player' />
        <img src={spinningRecord} id="spinning-record" alt="spinning record" />
        </>

    )
}


