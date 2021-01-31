import React from 'react'
import './Profile.scss'
import icon from '../assets/icon-profile.png'

export default function(props){
    return (
        <div className="block-profile">
            <img src={icon} />
            <h2>Usuario</h2>
            <div className="pin">#2346</div>
        </div>
    )
}