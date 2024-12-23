import React from 'react';

export default function NowPlaying(props) {
    
    if (typeof props.trackInfo === 'object') {
        
        if ((props.trackInfo) && (Object.values(props.trackInfo).length > 0)) {
    
        const song = props.trackInfo.name;
        const artists = props.trackInfo.artists.map(artists => {return artists.name}).toString(' ');
        const album = props.trackInfo.album.name;
        
        return (
    
            <div id='now-playing'>
        
            <h5>{song}</h5>
            <h6>by: {artists}</h6>
            <h6>Album: {album}</h6>
    
            </div>
        )
        } else {

            return (

                <div id='now-playing'>
        
                <h4>Find a Song to Jammm!!</h4>
    
                </div>

            )
        }    
    } else {
        return (

            <div id='now-playing'>
        
            <h4>Find a Song to Jammm!!</h4>

            </div>

        )
    }
}