import React from 'react'
import './BlockOfChat.scss'
import icon from '../../assets/icon-profile.png'

export default function(props){
    return(
        <div className="block-chat">
            <img src={icon} />
            <div>
                <h2>{props.name}</h2>
                <span>{props.msg}</span>
            </div>
        </div>
        )
}