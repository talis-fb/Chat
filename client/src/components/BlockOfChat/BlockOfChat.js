import React from 'react'
import './BlockOfChat.scss'
import icon from '../../assets/icon-profile.png'

export default function(props){
    return(
        <div className="block-chat"  onClick={ i => props.click(props.name)}>
            <img src={icon}  />
            <div>
                <h2>{props.name}</h2>
                <span>{props.msg[ props.msg.length - 1 ].text}</span>
            </div>
        </div>
        )
}