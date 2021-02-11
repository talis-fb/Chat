import React from 'react'

import BlockOfChat from './BlockOfChat/BlockOfChat'
import WithoutMessages from './WithoutMessages/WithoutMessages'
import Profile from './Profile/Profile'
import AddContact from './AddContact/AddContact'
import SpaceMessageEmpty from './SpaceMessageEmpty/SpaceMessageEmpty'
import Messages from './Messages/Messages'
import TextToSend from './TextToSend/TextToSend'

import './Main.scss';

import client from 'socket.io-client';
var socket = client('http://localhost:3000/')

class App extends React.Component {
  constructor(props){
    super(props)

    socket.on('newContact', contact => {
      this.setState({ 
        contacts:{ 
          ...this.state.contacts,
          ...contact
          }
      })
    })

    this.state = {
      dadesOfUser:{
        name: 'Text',
        pin: 1122
      },
      conversationToShow: 0,
      contacts: {
        Arnaldo: {
          msgs: [
            {sender: 1, text: "Hey caba safado!", type: 1},
            {sender: 2, text: "Opa", type: 1},
            {sender: 1, text: "Como estais??", type: 1},
            {sender: 2, text: "Doidazo", type: 1}
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

    this.clickedOnContact = this.clickedOnContact.bind(this)
    this.addContact = this.addContact.bind(this)
  }

  clickedOnContact(name_of_contact){
    this.setState({ conversationToShow: name_of_contact })
  }

  addContact(pinForAdd){
    const owmPin = this.state.dadesOfUser.pin
    socket.emit('addContact', pinForAdd, owmPin)
  }

  render(){
    //simplification of states for don't type "this.state" every time
    const contacts = Object.keys(this.state.contacts) 
    const conversationToShow = this.state.conversationToShow 

    return (
      <div className="App">
        <div className="title">
          Chat-oTuVisse
        </div>

        <div className="chat">
          <nav className="list-of-contacts">
            <Profile name={this.state.dadesOfUser.name} pin={this.state.dadesOfUser.pin} />
            <div className="contacts">
              { 
                contacts.length > 0 
                ? contacts.map( cont => <BlockOfChat name={cont} msg={this.state.contacts[cont].msgs} click={this.clickedOnContact} /> ) 
                : <WithoutMessages />
              }
            </div>
            <AddContact addContact={this.addContact} />
          </nav>

          <div className="messages">
            {
              conversationToShow
              ? <Messages contact={this.state.contacts[conversationToShow]} /> 
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
