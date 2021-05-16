import React from 'react'
import './BlockOfContact.scss'
import icon from '../../../../Assets/icon-profile.png'

export default function(props){
	// onClick function return the index of the contact in the array of App Component has the contacts
	return(
		<div className="block-chat" onClick={ i => props.click(props.index)}>
			<img src={icon}  />
			<div>
				<h2>{props.name}</h2>
				<span>{props.msg}</span>
			</div>
		</div>
	)
}
