import React from 'react'

// Space Contacts Components
import ButtonAddContact from './Components/ButtonAddContact'
import Contacts from './Components/Contacts/Contacts'

// Space Messages Components
import HeaderMessages from './Components/Messages/HeaderMessages'
import SpaceMessageEmpty from './Components/Messages/SpaceMessageEmpty'
import Messages from './Components/Messages/Messages'
import TextToSend from './Components/Messages/TextToSend'

import Auth from '../AuthService'
import Profile from './Components/Profile'
import ErrorLog from './Components/ErrorLog'

import './App.scss';

// socket.io
import { io } from 'socket.io-client';
var socket = io('http://localhost:3000/', { autoConnect: false } )

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
                    name: "Welcome",
                    screen: true,
                    element: <SpaceMessageEmpty />
                },
                {
                    name: 'Welcome',
                    msgs: [
                        {from: null, body: "Hey caba safado!"},
                        {from: null, body: "Como estais??"},
                        {from: null, body: "Bem-vindo a esse app porreta dms"}
                    ]
                },
                {
                    name: 'Francisgleidon',
                    msgs: [
                        {from: null, body: "Buenos Dias meu caro"},
                        {from: null, body: "como encontravos nesse presente dia?"},
                        {from: Auth.getCurrentUser().pin, body: "Muy bien, obg por perguntar"},
                        {from: null, body: "Massa, agr temos algo nessa conversa de exemplo"}
                    ]
                }
            ]
        }


        this.defineFunctionSocket()
        this.updateContactList()

        this.send_message = this.send_message.bind(this)
        this.openAConversation = this.openAConversation.bind(this)
        this.addContact = this.addContact.bind(this)
    }

    save_contact_on_list(new_contact){
        // { name: xxxx, cod: xxx, msgs: [xxx] }
        this.setState({ contacts: [ ...this.state.contacts, new_contact ] })
    }

    //Define a operação de adicionar contatos
    defineFunctionSocket(){
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        // Connect to socket of back-end sending your dades
        const username =  this.state.dadesOfUser.name 
        const pin = this.state.dadesOfUser.pin
        const token = Auth.getToken()
        socket.auth = { username, pin, token } // set attributes on propety 'auth', native of Socket.io
        socket.connect() // Connect with the socket io

        socket.on('newContact', contact => {
            if ( contact.error ) return this.show_an_error(contact.error)
            this.save_contact_on_list(contact)
        })

        socket.on('new_chat', (chat) => {
            const { msgs, cod, type, name } = chat
            this.save_contact_on_list(chat)
        })

        socket.on('private message', msg => {
            const {cod, body, from } = msg

            let state = [ ...this.state.contacts ]

            for( let i in state ){
                if( state[i].cod === cod){
                    console.log("Achou")
                    console.log(this.state.contacts[i])
                    state[i].msgs.push({ from, body })
                }
            }
            this.setState({ contacts: state })
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
                if ( res.error ) return this.show_an_error(res.error)
                console.log(res)
                res.map( i => this.save_contact_on_list(i))
            })
            .catch( err => this.show_an_error(err) )
    }

    openAConversation(index_of_contact){
        this.setState({ conversationToShow: index_of_contact })
    }

    addContact(pinForAdd){
        fetch( 'http://localhost:3000/addContact',  {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                pin_to_get: pinForAdd,
                pin_user_requesting: this.state.dadesOfUser.pin,
                name: this.state.dadesOfUser.name
            })  
        })
            .then( res => res.json())
            .then( res => {
                if ( res.error ) return this.show_an_error(res.error)
                console.log(res)
                this.save_contact_on_list(res)
            })
            .catch( err => this.show_an_error(err) )
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

    send_message(msg){
        const c =  this.state.conversationToShow 
        const contact = this.state.contacts[c]

        console.log('Mensagem ')
        console.log(contact)

        socket.emit('private message', { 
            message: msg,
            destination: contact.cod,
            token: Auth.getToken()
        })

    }

    render(){
        // every name of contacts
        const contacts = Object.keys(this.state.contacts) 
        const conversationToShow = this.state.conversationToShow 

        console.log(this.state)

        return (
            <div className="App">
                <header className="all">
                    <Profile name={this.state.dadesOfUser.name} pin={this.state.dadesOfUser.pin} />
                    <HeaderMessages title={ this.state.contacts[conversationToShow].name } />
                </header>

                <nav className="space-of-contacts">
                    <Contacts contacts={this.state.contacts} click={this.openAConversation} />
                    <div className="options">
                        {this.state.errors.map( i => i )}
                        <ButtonAddContact  addContact={this.addContact} />
                    </div>
                </nav>

                <nav className="space-of-messages">
                    <Messages chat={this.state.contacts[conversationToShow]} /> 
                    <TextToSend send_message={this.send_message} />
                </nav>
            </div>
        );
    }
}

export default App;
