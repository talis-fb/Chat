import React, { useState, useEffect } from 'react'

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

function App(props){
    const [ dadesOfUser, setDadesUser ] = useState({ name: Auth.getCurrentUser().name, pin: Auth.getCurrentUser().pin })
    const [ current_chat, set_current_chat ] = useState(0) // It's a number, of the index of conversation wanted. Start with the screen of Welcome
    const [ errors, setErrors] = useState([])
    const [ contacts, setContacts] = useState([ 
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
    ])

    function save_contact_on_list(new_contact){
        // { name: xxxx, cod: xxx, msgs: [xxx] }
        setContacts([ ...contacts, new_contact ])
    }


    function openAConversation(index_of_contact){
        set_current_chat(index_of_contact)
    }

    function addContact(pinForAdd){
        fetch( 'http://localhost:3000/addContact',  {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                pin_to_get: pinForAdd,
                pin_user_requesting: dadesOfUser.pin,
                name: dadesOfUser.name
            })  
        })
            .then( res => res.json())
            .then( res => {
                if ( res.error ) return show_an_error(res.error)
                console.log(res)
                save_contact_on_list(res)
            })
            .catch( err => show_an_error(err) )
    }


    function show_an_error(textOfError){
        let index = errors.length - 1 
        const errorToAdd = <ErrorLog text={textOfError} />

            const callback = function(){
                setTimeout( () => {
                    index = errors.length - 1 
                    const modelWithoutThisError = errors
                    modelWithoutThisError.shift()
                    // this.setState({  errors: modelWithoutThisError })
                    setErrors(modelWithoutThisError)
                }, 2000 )
            }

        // this.setState({ errors: [...errors, errorToAdd] }, callback )
        setErrors( [ ...errors, errorToAdd ], callback )
    }

    function logout(){
        Auth.logout()
        window.location.reload()
    }

    function send_message(msg){
        const contact = contacts[current_chat]

        console.log('Mensagem ')
        console.log(contact)

        socket.emit('private message', { 
            message: msg,
            destination: contact.cod,
            token: Auth.getToken()
        })
    }


    useEffect(() => {
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        // Connect to socket of back-end sending your dades
        const username =  dadesOfUser.name 
        const pin = dadesOfUser.pin
        const token = Auth.getToken()
        socket.auth = { username, pin, token } // set attributes on propety 'auth', native of Socket.io
        socket.connect() // Connect with the socket io

        socket.on('newContact', contact => {
            if ( contact.error ) return show_an_error(contact.error)
            save_contact_on_list(contact)
        })

        socket.on('new_chat', (chat) => {
            const { msgs, cod, type, name } = chat
            save_contact_on_list(chat)
        })

        socket.on('private message', (msg) => {
            const {cod, body, from } = msg

            // BUUUUUUUUUUUUUUUUUUUUUUG <- 
            console.log('RECEBIDOOOO')
            console.log(msg)
            console.log(contacts )

            let state = [ ...contacts ]
            console.log(state)
            console.log(state == contacts)
            return

            for( let i in state ){
                if( state[i].cod === cod){
                    console.log("Achou")
                    console.log(contacts[i])
                    state[i].msgs.push({ from, body })
                }
            }
            setContacts(state)
        })

        //Get the concats the user already have
        fetch( 'http://localhost:3000/returnContacts',  {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: Auth.getToken() })  
        })
            .then( res => res.json())
            .then( res => {
                if ( res.error ) return show_an_error(res.error)
                console.log('Conversas q já tem')
                console.log(res)
                res.map( i => save_contact_on_list(i))
            })
            .catch( err => show_an_error(err) )
    }, [])

    useEffect(() => console.log(contacts))

    return (
        <div className="App">
            <header className="all">
                <Profile name={dadesOfUser.name} pin={dadesOfUser.pin} />
                <HeaderMessages title={ contacts[current_chat].name } />
            </header>

            <nav className="space-of-contacts">
                <Contacts contacts={contacts} click={openAConversation} />
                <div className="options">
                    {errors.map( i => i )}
                    <ButtonAddContact  addContact={addContact} />
                </div>
            </nav>

            <nav className="space-of-messages">
                <Messages chat={contacts[current_chat]} /> 
                <TextToSend send_message={send_message} />
            </nav>
        </div>
    );


}

export default App;
