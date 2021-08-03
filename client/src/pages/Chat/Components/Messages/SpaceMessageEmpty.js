import React from 'react'

import icon1 from '../../Assets/binoculars.svg'
import icon2 from '../../Assets/chat.svg'
import icon3 from '../../Assets/comment.svg'
import icon4 from '../../Assets/friends.svg'
import icon5 from '../../Assets/question.svg'
import icon6 from '../../Assets/united.svg'


import './SpaceMessageEmpty.scss'

const icons = [
    icon1,icon2,icon3,
    icon4,icon5,icon6
]

const iconRandom = icons[Math.floor(Math.random() * icons.length)];

export default function(props){
    return(
        <div className="space-msg-empty">
            <h1>Welcome to the Chat-uoTuVisse</h1>
            <img src={iconRandom}/>
        </div>
    )
}
