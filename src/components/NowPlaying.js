import React from 'react';

export default function NowPlaying(props) {

    console.log(props.trackInfo)
    
    const song = props.trackInfo.name;
    const artist = props.trackInfo.artist.map(artist => {return artist.name}).toString(' ');
    const album = props.trackInfo.album.name;
    
    return (

        <div id='now-playing'>
    
        <h5>{song}</h5>
        <h6>{artist}</h6>
        <h6>{album}</h6>

        </div>

    )
}