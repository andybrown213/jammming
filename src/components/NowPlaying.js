import React from 'react';

export default function NowPlaying(props) {

    console.log(props.trackInfo)
    
    const song = props.trackInfo.name;
    const artists = props.trackInfo.artists.map(artists => {return artists.name}).toString(' ');
    const album = props.trackInfo.album.name;
    
    return (

        <div id='now-playing'>
    
        <h4>{song}</h4>
        <h6>by: {artists}</h6>
        <h6>Album: {album}</h6>

        </div>

    )
}