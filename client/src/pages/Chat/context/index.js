import React, { createContext, useState } from 'react';
import SpaceMessageEmpty from '../Components/Messages/SpaceMessageEmpty'

// Conversa que todos comecam 
const contactsDefault = [{ 
        name: "Welcome",
        screen: true,
        element: <SpaceMessageEmpty />
    },{ 
        name: 'Welcome',
        msgs: [
            {from: null, body: "Hey caba safado!"}, {from: null, body: "Como estais??"}, {from: null, body: "Bem-vindo a esse app porreta dms"}
        ]
    },
]

// Context
const Context = createContext();

// Funcao que s retorna o Provider e armazena o state do contexto.
function UserProvider({ children }) {
    const [ contacts, setContactsDirect] = useState(contactsDefault)

    // Interface to save a new contact
    function setNewContacts(new_contact){ 
        setContactsDirect([  ...contacts, new_contact ])
    }

    // Interface to send a message to a contact
    function setMessage( name_contact, message ){ 
        const index_of_selected_contact = contacts.findIndex( ct => ct.name === name_contact )
        const cc = contacts
        cc[index_of_selected_contact].msgs.push(message)
        setContactsDirect(cc)
    }

    return (
        <Context.Provider value={{ contacts, setNewContacts, setMessage }}>
            {children}
        </Context.Provider>
    );
}

export { Context };
export default UserProvider;
