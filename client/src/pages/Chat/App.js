import React from 'react'

import WithoutContacts from './Components/Space_Contacts/WithoutContacts/WithoutContacts'
import BlockOfContact from './Components/Space_Contacts/BlockOfContact/BlockOfContact'
import AddContact from './Components/Space_Contacts/AddContact/AddContact'

import SpaceMessageEmpty from './Components/Space_Messages/SpaceMessageEmpty/SpaceMessageEmpty'
import Messages from './Components/Space_Messages/Messages/Messages'
import TextToSend from './Components/Space_Messages/TextToSend/TextToSend'

import Auth from './Components/AuthService/AuthService'
import Profile from './Components/Profile/Profile'
import ErrorLog from './Components/ErrorLog/ErrorLog'

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
			errors: [],
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
						{sender: 1, text: "Massa, agr temos algo nessa conversa de exemplo", type: 1}
					]
				}
			}
		}


		socket.on('newContact', contact => {
			if ( contact.error ){
				const log = contact.error
				this.showAnError(log)
				return
			}
			this.updateContactList(contact)
		})

		this.openAConversation = this.openAConversation.bind(this)
		this.addContact = this.addContact.bind(this)
	}

	updateContactList(obj){
		const newContact = { 
			[obj.name]: { 
				msgs: obj.msgs 
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

	showAnError(textOfError){
		let index = this.state.errors.length - 1 
		const errorToAdd = <ErrorLog text={textOfError} />

		const callback = function(){
			setTimeout( () => {
				index = this.state.errors.length - 1 
				const modelWithoutThisError = this.state.errors
				modelWithoutThisError.shift()
				this.setState({  errors: modelWithoutThisError })
			}, 2000 )
		}

		this.setState({ errors: [...this.state.errors, errorToAdd] }, callback )
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
					<nav className="space-of-contacts">
						<Profile name={this.state.dadesOfUser.name} pin={this.state.dadesOfUser.pin} />
						<div className="contacts">
							{ 
								contacts.length > 0 
								? contacts.map( cont => <BlockOfContact name={cont} msg={this.state.contacts[cont].msgs} click={this.openAConversation} /> ) 
								: <WithoutContacts />
							}
						</div>
						<div className="options">
							{this.state.errors.map( i=> i)}
							<AddContact  addContact={this.addContact} />
						</div>
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
