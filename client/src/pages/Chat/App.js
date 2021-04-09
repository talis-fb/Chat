import React from 'react'

import BlockOfChat from './BlockOfChat/BlockOfChat'
import WithoutMessages from './WithoutMessages/WithoutMessages'
import Profile from './Profile/Profile'
import AddContact from './AddContact/AddContact'
import SpaceMessageEmpty from './SpaceMessageEmpty/SpaceMessageEmpty'
import Messages from './Messages/Messages'
import TextToSend from './TextToSend/TextToSend'
import Auth from './AuthService/AuthService'

import './App.scss';

import client from 'socket.io-client';
var socket = client('http://localhost:3000/')

class App extends React.Component {
	constructor(props){
		super(props)

		const user = Auth.getCurrentUser()

		this.state = {
			dadesOfUser:{
				name: user.name,
				pin: user.pin
			},
			conversationToShow: 0,
			contacts: {
				Welcome: {
					msgs: [
						{sender: 1, text: "Hey caba safado!", type: 1},
						{sender: 1, text: "Como estais??", type: 1},
						{sender: 1, text: "Bem-vindo a esse app porreta dms", type: 1}
					]
				},
				Franscisgleidson: {
					msgs: [
						{sender: 1, text: "Buenos Dias meu caro", type: 1},
						{sender: 1, text: "como encontravos nesse presente dia?", type: 1},
						{sender: 2, text: "Muy bien, obg por perguntar", type: 1},
						{sender: 1, text: "Melhorou do coronga?", type: 1}
					]
				}
			}
		}


		socket.on('newContact', contact => {
			this.updateContactList(contact)
		})

		this.openAConversation = this.openAConversation.bind(this)
		this.addContact = this.addContact.bind(this)
	}

	updateContactList(newOne){
		const newContact = { 
			[newOne.name]: { 
				msgs: newOne.msgs 
			}
		}
		this.setState({ contacts: { ...this.state.contacts, ...newContact } })
	}

	openAConversation(name_of_contact){
		this.setState({ conversationToShow: name_of_contact })
	}

	addContact(pinForAdd){
		socket.emit('addContact', pinForAdd, this.state.dadesOfUser)
	}

	logout(){
		Auth.logout()
	}

	render(){
		// every name of contacts
		const contacts = Object.keys(this.state.contacts) 
		const conversationToShow = this.state.conversationToShow 

		return (
			<div className="App">
				<div className="title">
					<a className="logout" href="/" onClick={this.logout}>Chat-oTuVisse</a>
				</div>

				<div className="chat">
					<nav className="list-of-contacts">
						<Profile name={this.state.dadesOfUser.name} pin={this.state.dadesOfUser.pin} />
						<div className="contacts">
							{ 
								contacts.length > 0 
								? contacts.map( cont => <BlockOfChat name={cont} msg={this.state.contacts[cont].msgs} click={this.openAConversation} /> ) 
								: <WithoutMessages />
							}
						</div>
						<AddContact addContact={this.addContact} />
					</nav>

					<div className="messages">
						{
							conversationToShow
							? <Messages msgs={this.state.contacts[conversationToShow].msgs} /> 
							: <SpaceMessageEmpty /> 
						} 

						<TextToSend />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
