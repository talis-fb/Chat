import React from 'react'

// Space Contacts Components
import ButtonAddContact from './Components/Space_Contacts/ButtonAddContact/ButtonAddContact'
import Contacts from './Components/Space_Contacts/Contacts/Contacts'

// Space Messages Components
import SpaceMessageEmpty from './Components/Space_Messages/SpaceMessageEmpty/SpaceMessageEmpty'
import Messages from './Components/Space_Messages/Messages/Messages'
import TextToSend from './Components/Space_Messages/TextToSend/TextToSend'

import Auth from '../AuthService'
import Profile from './Components/Profile/Profile'
import ErrorLog from './Components/ErrorLog/ErrorLog'

import './App.scss';

// socket.io
import client from 'socket.io-client';
var socket = client('http://localhost:3000/')

class App extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			dadesOfUser:{
				name: Auth.getCurrentUser().name,
				pin: Auth.getCurrentUser().pin
			},
			conversationToShow: 0, // It's a number, of the index of conversation wanted. Start with the screen of Welcome
			errors: [],
			contacts: [
				{ 
					// The first chat is the screen of welcome.
					// A element with 'screen:true' in this array will 
					// not render messages and just render the element 
					// and the key 'element'
					screen: true,
					element: <SpaceMessageEmpty />
				},
				{
					name: 'Welcome',
					msgs: [
						{sender: 1, text: "Hey caba safado!", type: 1},
						{sender: 1, text: "Como estais??", type: 1},
						{sender: 1, text: "Bem-vindo a esse app porreta dms", type: 1}
					]
				},
				{
					name: 'Francisgleidon',
					msgs: [
						{sender: 1, text: "Buenos Dias meu caro", type: 1},
						{sender: 1, text: "como encontravos nesse presente dia?", type: 1},
						{sender: 2, text: "Muy bien, obg por perguntar", type: 1},
						{sender: 1, text: "Massa, agr temos algo nessa conversa de exemplo", type: 1}
					]
				}
			]
		}


		this.defineFunctionSocket()
		this.updateContactList()

		this.openAConversation = this.openAConversation.bind(this)
		this.addContact = this.addContact.bind(this)
	}

	save_contact_on_list(new_contact){
		// { name: xxxx, msgs: [xxx] }
		this.setState({ contacts: [ ...this.state.contacts, new_contact ] })
	}

	defineFunctionSocket(){
		//Define a operação de adicionar contatos
		socket.on('newContact', contact => {
			if ( contact.error ) return this.show_an_error(contact.error)
			this.save_contact_on_list(contact)
		})
	}

	updateContactList(){
		//Get the concats the user already have
		fetch( 'http://localhost:3000/returnContacts',  {
			method: "POST", 
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ token: Auth.getToken() })  
		})
			.then( res => res.json())
			.then( res => {
				if ( res.error ) return this.logout()
				res.map( i => this.save_contact_on_list(i))
			})
			.catch( err => this.show_an_error(err) )
	}

	openAConversation(index_of_contact){
		this.setState({ conversationToShow: index_of_contact })
	}

	addContact(pinForAdd){
		socket.emit('addContact', pinForAdd, this.state.dadesOfUser)
	}

	show_an_error(textOfError){
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
		window.location.reload()
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
						<Contacts contacts={this.state.contacts} click={this.openAConversation} />
						<div className="options">
							{this.state.errors.map( i => i )}
							<ButtonAddContact  addContact={this.addContact} />
						</div>
					</nav>

					<nav className="space-of-messages">
						<Messages chat={this.state.contacts[conversationToShow]} /> 
						<TextToSend />
					</nav>
				</div>
			</div>
		);
	}
}

export default App;
