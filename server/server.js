const express = require('express')
const app = express();
const path = require('path')
const http = require('http').Server(app);
const io = require('socket.io')(http); 

app.use(express.static(path.join( __dirname, '..','dist')))
console.log(path.join( __dirname, '..','dist'))
app.set('views', path.join(__dirname,'..', 'dist'))

const users = {
    P0001:{
        name: 'Chicão',
        conversations: {
            P1122: {
                type: 1,
                c: 'c7yjjk9'
            }
        }   
    },
    P1122:{
        name: 'Cuscuz',
        conversations: {
            P0001: {
                type: 2,
                c: 'c7yjjk9'
            }
        }   
    },
    P2222: {
        name: 'Alone',
        conversations: {

        }   
    },
    P3333: {
        name: 'Zefa',
        conversations: {

        }   
    }
    //Math.random().toString(36).substring(7);
}

const messages = {
    c7yjjk9: [
        {sender: 1, text: "Ei po, sabia q essa é a primeira conversa nesse canto?", type: 1},
        {sender: 2, text: "Sabia n bicho! :o", type: 1},
        {sender: 2, text: "Bizarro", type: 1},
        {sender: 1, text: "Sabia q tmb nós dois somos a mesma pessoa", type: 1},
        {sender: 2, text: ":0", type: 1}
    ]
}

app.get('/', (req, res) => {
    res.sendFile(path.join( __dirname, 'dist' , 'index.html'));
    console.log(path.join( __dirname, 'dist' , 'index.html'))
})

io.on('connection', socket => {
    console.log(`New user: ${socket.id}`)

    socket.on('addContact', (pin, pinOfSolicitor) => {
        const userRequested = (pin!=pinOfSolicitor) && users['P'+pin]
        const conversationBefore = userRequested.conversations['P'+pinOfSolicitor]
        let codeOfConv

        //If the Pin dont exist
        if( !userRequested ) return

        //CREATE a new Chat
        if( !conversationBefore ){
            //If dont exist a conversation between both users...
            console.log('CRIA O TALK')

            //Creation of code of the new conversation
            codeOfConv = Math.random().toString(36).substring(9);

            //SET the conversation on the memory
            users['P'+pin].conversations['P'+pinOfSolicitor] = { 
                type: 1, //The type is for define from who is the messages
                c: codeOfConv
            }
            users['P'+pinOfSolicitor].conversations['P'+pin] = { 
                type: 2,
                c: codeOfConv
            }

            //SET of messages Database
            messages[codeOfConv] = []
        } else {
            // If it already has a conversation in database
            codeOfConv = conversationBefore.c
        }

        //SENDING BACK for the socket
        const name = userRequested.name
        const msgs = messages[codeOfConv]
        const conversation = {}
        conversation[name] = {
            msgs: msgs
        }
        socket.emit('newContact', conversation)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
  });