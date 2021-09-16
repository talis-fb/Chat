import React from 'react'

import Auth from '../../../AuthService'
import './Messages.scss';

function Messages(props){
    // If the chat has the props 'screen' means it is a screen to show
    // and not a chat. So, it just return the element of that screen
    if ( props.chat.screen ) return props.chat.element

    const pin = Auth.getCurrentUser().pin

    function messageFromUser(msg){
        return (
            <div className="box-msg">
                <div className=" msg-User">
                    {msg}
                </div>
            </div>
        )
    }

    function messageFromFriend(msg){
        return (
            <div className="box-msg">
                <div className=" msg-Friend">
                    {msg}
                </div>
            </div>
        )
    }

    function ScreenWithoutMessages(){
        return (
            <div class="box-msg-empty">
                <span>CONVERSA VAZIA</span>
                <span>Puxe um papo!</span>
            </div>
        )
    }

    // Get the messages received and make an array with component with the messages
    const messages = props.chat.msgs
    const box_of_messages = messages.map( i => {
        if ( !i.body ) return null
        if ( i.from===pin ) return messageFromUser(i.body) 
        return messageFromFriend(i.body)
    })
    const withoutMessages = ScreenWithoutMessages();

    // Boolean, TRUE -> There are messages, FALSE -> There aren't nothing
    const hasMessages = !!messages.length


    return(
        <div className="messages-chat">
            <div className="messages-block">
                { hasMessages ? box_of_messages : withoutMessages }
            </div>
        </div>
    )

}

export default Messages;
