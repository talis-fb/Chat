import React from 'react'

import icon1 from '../../assets/binoculars.svg'
import icon2 from '../../assets/chat.svg'
import icon3 from '../../assets/comment.svg'
import icon4 from '../../assets/friends.svg'
import icon5 from '../../assets/question.svg'
import icon6 from '../../assets/united.svg'

import './SpaceMessageEmpty.scss'

export default function(props){
    const icons = [
        icon1,icon2,icon3,
        icon4,icon5,icon6
    ]

    var iconRandom = icons[Math.floor(Math.random() * icons.length)];

    return(
        <div className="space-msg-empty">
            <h1>Welcome to the Chat-uoTuVisse</h1>
            <img src={iconRandom}/>
        </div>
    )
}