import React from 'react'
import './Profile.scss'
import icon from '../assets/icon-profile.png'

export default function(props){
    return (
        <div className="block-profile">
            <img src={icon} />
            <h2>{props.name}</h2>
            <div className="pin">#{props.pin}</div>
        </div>
    )
}
