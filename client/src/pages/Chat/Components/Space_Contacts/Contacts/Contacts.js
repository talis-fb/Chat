import React from 'react'

import BlockOfContact from './BlockOfContact/BlockOfContact'
import WithoutContacts from './WithoutContacts/WithoutContacts'

export default function (props){
	if ( !props.contacts.length ) return  <WithoutContacts /> 

	const handleClick = props.click

	const handleContact = cont => {
		const name = cont.name
		const last_message = cont.msgs.length ? cont.msgs[ cont.msgs.length-1 ].text : null // Ta feio
		return <BlockOfContact name={name} msg={last_message} click={handleClick}  />
	}

	const list_of_contacts = props.contacts.map(handleContact)
	return list_of_contacts
}

