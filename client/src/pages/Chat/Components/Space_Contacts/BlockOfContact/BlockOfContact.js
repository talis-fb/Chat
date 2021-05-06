import React from 'react'
import './BlockOfContact.scss'
import icon from '../../../Assets/icon-profile.png'

export default function(props){
	let lastMessage = props.msg[ props.msg.length - 1 ] 

	return(
		<div className="block-chat"  onClick={ i => props.click(props.name)}>
			<img src={icon}  />
			<div>
				<h2>{props.name}</h2>
				<span>{ lastMessage ? lastMessage.text : null }</span>
			</div>
		</div>
	)
}
