import React from 'react'

import './Messages.scss';

export default class Messages extends React.Component{
    constructor(props){
        super(props)
    }

    messageFromUser(msg){
        return (
            <div className="box-msg">
                <div className=" msg-User">
                    {msg}
                </div>
            </div>
        )
    }

    messageFromFriend(msg){
        return (
            <div className="box-msg">
                <div className=" msg-Friend">
                    {msg}
                </div>
            </div>
        )
    }

    render(){
        const messages = this.props.contact.msgs
        
        let box_of_messages = null
        if( !!messages[0] ){
            box_of_messages = messages.map( 
                i => 
                    i.sender===1 //condition
                    ? this.messageFromUser(i.text ) 
                    : this.messageFromFriend(i.text )
            )
        }

        return(
            <div className="messages-chat">
                { box_of_messages}
            </div>
        )
    }
}