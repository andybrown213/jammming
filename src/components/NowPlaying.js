import React from 'react';

export default function NowPlaying(props) {

    const song = props.trackInfo.item.name;
    const artist = props.trackInfo.item.artist;
    const album = props.trackInfo.item.album;
    
    return (

        <div id='now-playing'>
    
        <h5>{song}</h5>
        <h6>{artist}</h6>
        <h6>{album}</h6>

        </div>

    )
}