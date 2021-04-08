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
            //If it has one messages, it'll create the divs
            box_of_messages = messages.map( 
                i => 
                    i.sender===1 //condition
                    ? this.messageFromUser(i.text ) 
                    : this.messageFromFriend(i.text )
            )
        }

        //If it doesn't received messages in props, the 'box_of_messages' keeps null

        return(
            <div className="messages-chat">
                { box_of_messages}
            </div>
        )
    }
}
