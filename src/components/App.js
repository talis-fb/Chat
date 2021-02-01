import React from 'react'

import BlockOfChat from './BlockOfChat/BlockOfChat'
import WithoutMessages from './WithoutMessages/WithoutMessages'
import Profile from './Profile/Profile'
import AddContact from './AddContact/AddContact'
import SpaceMessageEmpty from './SpaceMessageEmpty/SpaceMessageEmpty'
import Messages from './Messages/Messages'
import TextToSend from './TextToSend/TextToSend'

import './App.scss';

class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      contacts: [
        {name: "Arnaldo", msg: "Hello World!"},
        {name: "Francisgleidson", msg: "AAAA"}
      ],
      messages: {
        Arnaldo: {
          msgs: [
            {sender: 1, text: "Hey caba safado!", type: 1},
            {sender: 2, text: "Opa", type: 1},
            {sender: 1, text: "Como estais??", type: 1},
            {sender: 2, text: "Doidazo", type: 1}
          ]
        }
      }
    }
  }


  render(){
    return (
      <div className="App">
        <div className="title">
          Chat-oTuVisse
        </div>

        <div className="chat">
          <nav className="list-of-contacts">
            <Profile />
            <div className="contacts">
              { 
                this.state.contacts.length > 0 
                ? this.state.contacts.map( contact => <BlockOfChat name={contact.name} msg={contact.msg} /> ) 
                : <WithoutMessages />
              }
            </div>
            <AddContact />
          </nav>

          <div className="messages">
            {/* <SpaceMessageEmpty /> */}
            <Messages contact={this.state.messages.Arnaldo} /> 
            <TextToSend />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
