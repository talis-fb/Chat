import React from 'react'

import BlockOfContact from './BlockOfContact/BlockOfContact'
import WithoutContacts from './WithoutContacts/WithoutContacts'

export default function (props){
	if ( !props.contacts.length ) return  <WithoutContacts /> 

		const handleClick = props.click

	const handleContact = ( cont, index ) => {
		const name = cont.name
		const last_message = cont.msgs[ cont.msgs.length-1 ] // { name: 'xxxx', msgs: [{..}, {..}] }

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

	const list_of_contacts = props.contacts.map(handleContact)

	return (
		<div className="contacts">
			{ list_of_contacts }
		</div>
	)
}

