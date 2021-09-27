import React, { createContext, useEffect, useState, useContext, useCallback } from 'react';

// Context
const SocketContext = createContext();

import Auth from '../../AuthService'
const token = Auth.getToken()
const username =  Auth.getCurrentUser() ? Auth.getCurrentUser().name : ""
const pin =  Auth.getCurrentUser() ? Auth.getCurrentUser().pin : ""

// socket.io
import { io } from 'socket.io-client';
var socket = io('http://localhost:3000/', { autoConnect: false } )

// Contacts
import { UserContext } from './UserContext'

function SocketProvider({ children }) {

    const { contact,  setNewContacts, setMessage } = useContext(UserContext)

    const handleNewMessageReceived = useCallback( (msg) => {
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
    },[])

    const handleNewContact = useCallback( contact => {
        if ( contact.error ) return show_an_error(contact.error)
        setNewContacts(contact)
    }, [])

    useEffect( () => {
        socket.auth = { username, pin, token } // set attributes on propety 'auth', native of Socket.io
        socket.connect() // Connect with the socket io

        socket.onAny((event, ...args) => {
            console.log('HERE')
            console.log(contacts )
            console.log(event, args);
        });


        socket.on('private message', handleNewMessageReceived)

        socket.on('newContact', handleNewContact)


        socket.on('new_chat', (chat) => {
            setNewContacts(chat)
        })


        fetch( 'http://localhost:3000/returnContacts',  {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: Auth.getToken() })  
        })
            .then( res => res.json())
            .then( res => {
                let contatos = []
                console.log('Conversas q já tem')
                console.log(res)
                if ( res.error ) return show_an_error(res.error)
                res.map( i => { 
                    console.log('Ct Retornado'); 
                    console.log(i)
                    contatos_retornados.push(i)
                })
                setNewContacts(contatos)
            })
            .catch( err => show_an_error(err) )


    }, [])

    return (
        <SocketContext.Provider value={{}}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketContext };
export default SocketProvider;
