import React from 'react'

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
        const messages = this.props.msgs

		const box_of_messages = messages.map( i => {
			if ( i.sender==1 ) return this.messageFromUser(i.text) 
			if ( i.sender==2 ) return this.messageFromFriend(i.text)
		})

		const withoutMessages = this.withoutMessages()

        //If it doesn't received messages in props, the 'box_of_messages' keeps null
        return(
            <div className="messages-chat">
				{ messages.length ? box_of_messages : withoutMessages }
            </div>
        )
    }
}
