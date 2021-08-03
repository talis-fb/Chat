import React from 'react'

import WithoutContacts from './WithoutContacts'

import './Contacts.scss'

import Icon from '../../Assets/icon-profile.png'

// The each contact to click
function BlockOfContact(props){
	// onClick function return the index of the contact in the array of App Component has the contacts
	return(
		<div className="block-chat" onClick={ i => props.click(props.index)}>
			<img src={Icon}  />
			<div>
				<h2>{props.name}</h2>
				<span>{props.msg}</span>
			</div>
		</div>
	)
}

export default function (props){
	if ( !props.contacts.length ) return  <WithoutContacts /> 

	const handleClick = props.click

	// Return an array with components of all contacts
	const handleContacts = ( contact, index ) => {
		// If it's a screen will not render at list
		if ( contact.screen ) return null

		const name = contact.name
		const last_message = '' // cont.msgs[ cont.msgs.length-1 ] || '' // cont = { name: 'xxxx', msgs: [{..}, {..}] }
		// erro em pegar o tamanho desse array..

		let message_to_display = null

		if ( last_message ){
			const size = 30
			message_to_display = last_message.text.substring(0,size) // return a number of firsts chars of string
			if ( last_message.text.length > size ) {
				message_to_display += '...'
			}
		}

		return <BlockOfContact name={name} msg={message_to_display} click={handleClick} index={index}  />
	}
	const list_of_contacts = props.contacts.map(handleContacts)

	return (
		<div className="contacts">
			{ list_of_contacts }
		</div>
	)
}

