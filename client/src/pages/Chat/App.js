import React, { useState, useEffect, useContext } from 'react'

// Space Contacts Components
import ButtonAddContact from './Components/ButtonAddContact'
import Contacts from './Components/Contacts/Contacts'

// Space Messages Components
import HeaderMessages from './Components/Messages/HeaderMessages'
import Messages from './Components/Messages/Messages'
import TextToSend from './Components/Messages/TextToSend'

import Auth from '../AuthService'
import Profile from './Components/Profile'
import ErrorLog from './Components/ErrorLog'

import UserProvider, { Context } from './context/index'

import './App.scss';

// socket.io
import { io } from 'socket.io-client';
var socket = io('http://localhost:3000/', { autoConnect: false } )

function App(props){
    const [ dadesOfUser, setDadesUser ] = useState({ name: Auth.getCurrentUser().name, pin: Auth.getCurrentUser().pin })
    const [ current_chat, set_current_chat ] = useState(0) // It's a number, of the index of conversation wanted. Start with the screen of Welcome
    const [ errors, setErrors] = useState([])

    const { contacts, setNewContacts, setMessage } = useContext(Context);


    useEffect( () => {
        // Connect to socket of back-end sending your dades
        const username =  dadesOfUser.name 
        const pin = dadesOfUser.pin
        const token = Auth.getToken()
        socket.auth = { username, pin, token } // set attributes on propety 'auth', native of Socket.io
        socket.connect() // Connect with the socket io

        socket.onAny((event, ...args) => {
            console.log('HERE')
            console.log(contacts )
            console.log(event, args);
        });

        const contatos_retornados = []

        fetch( 'http://localhost:3000/returnContacts',  {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: Auth.getToken() })  
        })
            .then( res => res.json())
            .then( res => {
                console.log('Conversas q já tem')
                console.log(res)
                if ( res.error ) return show_an_error(res.error)
                res.map( i => { 
                    console.log('Ct Retornado'); 
                    console.log(i)
                    contatos_retornados.push(i)
                })
            })
            .catch( err => show_an_error(err) )

        // Set contatos_retornados
        setNewContacts(contatos_retornados)

        socket.on('newContact', contact => {
            if ( contact.error ) return show_an_error(contact.error)
            setNewContacts(contact)
        })

        socket.on('private message', (msg) => {
            const {cod, body, from } = msg

            

            // BUUUUUUUUUUUUUUUUUUUUUUG <- 
            console.log('RECEBIDOOOO')
            console.log(msg)
            console.log(contacts )


             return
            setMessage(cod, { body, from })

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
        })

        socket.on('new_chat', (chat) => {
            setNewContacts(chat)
        })

    }, [])




    // --------------------------------------


    useEffect(() =>{ 
        console.log('Atualiza cont')
        console.log(contacts) 
    }, [contacts])


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
                setNewContacts(res)
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
        setErrors([ ...errors, errorToAdd ])
        callback()
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
            token: Auth.getToken(),
            message: msg,
            destination: contact.cod,
        })
    }


    useEffect(() => console.log(contacts))

    return (
        <div className="App">
            <header className="all">
                <Profile name={dadesOfUser.name} pin={dadesOfUser.pin} />
                <HeaderMessages title={ contacts[current_chat].name } />
            </header>

            <nav className="space-of-contacts">

                <div className="contacts">
                    { contacts.map( (cc, index) => <Contacts key={index} contact={cc} onClick={() => openAConversation(index)} /> ) }
                </div>

                {/* <Contacts contacts={contacts} click={openAConversation} /> */}
                <div className="options">
                    { errors.map( i => i ) }
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
