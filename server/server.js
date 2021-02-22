const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); 

console.log(path.join( __dirname, '..','dist'))

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

        },
		password: 123
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


function findUser(User){
	// find the PIN of a user based on its name
	
	const valuesDatabase = Object.values(users)
	const indexOfUser = valuesDatabase.map( (obj, index) => {
		if(obj.name == User){
			return index
		}
	}).filter( i => i )

	const pinsOfUsersInOrder = Object.keys(users)

	return pinsOfUsersInOrder[indexOfUser]
}



app.get('/', (req, res) => {
    res.sendFile(path.join( __dirname, 'dist' , 'index.html'));
    console.log(path.join( __dirname, 'dist' , 'index.html'))
})

app.post('/register', async (req, res) => {
	const { nickname, password } = req.body

	console.log("REGISTER: DADOS RECEBIDOS")
	console.log(nickname, password)

	try{
		if(await findUser(nickname)) {
			//If user already exist
			console.log('Nada')
			return res.status(400).send({ error: "User already exist" })
		}

		// generate a new Pin random
		const newPin = Math.random().toString(36).substring(9);

		// insert in database 
		users[newPin] = {
			name: nickname,
			conversation: {}
		}

		console.log(users)

		res.send({ registrado: 'sucesso'})

	} catch(err) {
		console.log(err)
		return res.status(400).send({ error: err })
	}

})


app.post('/login', async (req, res) => {
	const { nickname, password } = req.body
		
	console.log("LOGIN: DADOS RECEBIDOS")
	console.log(nickname, password)

	res.send({ registrado: 'sucesso'})
})

io.on('connection', socket => {
    console.log(`New user: ${socket.id}`)
	
	console.log(findUser('Alone'))
	


    socket.on('addContact', (pin, pinOfSolicitor) => {

        const userRequested = (pin!=pinOfSolicitor) && users['P'+pin] // Return True if exist a user with the pin received AND the pin been diferent of pinOfSolicitor
		
        //If the Pin received dont exist
        if( !userRequested ) return

        const conversationBefore = userRequested.conversations['P'+pinOfSolicitor] // Return pin of conversation (if dont exist a user with will return undefined)
        let codeOfConv // Who will receive the code of conversation for acess database and send of user

        //CREATE a new Chat (If dont exist a conversation between both users...)
        if( !conversationBefore ){
            console.log('CRIA O TALK')

            //Creation of code the new conversation
            codeOfConv = Math.random().toString(36).substring(9);

            //SET the conversation on database of both users
            users['P'+pin].conversations['P'+pinOfSolicitor] = { 
                type: 1, //The type is for define from who is the messages
                c: codeOfConv
            }
            users['P'+pinOfSolicitor].conversations['P'+pin] = { 
                type: 2,
                c: codeOfConv
            }

            //SET in Messages's Database
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
