import React from 'react'

import Auth from '../../../../AuthService'
import './Messages.scss';

export default class Messages extends React.Component{
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

	withoutMessages(){
		return (
			<div class="box-msg-empty">
				<span>CONVERSA VAZIA</span>
				<span>Puxe um papo!</span>
			</div>
		)
	}

    render(){

		// If the chat has the props 'screen' means it is a screen to show
		// and not a chat. So, it just return the element of that screen
		if ( this.props.chat.screen ) return this.props.chat.element

		const pin = Auth.getCurrentUser().pin

		const messages = this.props.chat.msgs
		const box_of_messages = messages.map( i => {
			if ( i.from===pin ) {
				return this.messageFromUser(i.body) 
			} else {
				return this.messageFromFriend(i.body)
			}
		})

		const withoutMessages = this.withoutMessages()
		const hasMessages = !!messages.length

        //If it doesn't received messages in props, the 'box_of_messages' keeps null
        return(
            <div className="messages-chat">
				{ hasMessages ? box_of_messages : withoutMessages }
            </div>
        )
    }
}
