import React from 'react'

import WithoutContacts from './WithoutContacts'

import './Contacts.scss'

import Icon from '../../Assets/icon-profile.png'

// The each contact to click
function BlockOfContact(props){
    // onClick function return the index of the contact in the array of App Component has the contacts
    console.log(props.msg)
    return(
        <div className="block-chat" >
            <img src={Icon}  />
            <div>
                <h2>{props.name}</h2>
                <span>{'aa'}</span>
            </div>
        </div>
    )
}

export default function (props){
    // if ( !props.contacts.length ) return  <WithoutContacts /> 
    const { name, msgs } = props.contact

    return <BlockOfContact name={name} msg={msgs} />
}
