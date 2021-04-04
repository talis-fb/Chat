const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http) 
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const secret = require('crypto').randomBytes(64).toString('hex')

// Models
const MessagesDB = require('./models/Messages')
const UsersDB = require('./models/Users')

mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: "true" })
	.then( () => console.log('MONGODB conectado'))
	.catch( (err) => console.log('ERRO: '+err) )

app.use(express.static(path.join( __dirname, '..','dist')))
console.log(path.join( __dirname, '..','dist'))
app.set('views', path.join(__dirname,'..', 'dist'))

//Configuration of Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

function generateAccessToken(username) {
  return jwt.sign(username, secret);
}

app.get('/', (req, res) => {
    res.sendFile(path.join( __dirname, '..', 'dist' , 'index.html'));
    console.log(path.join( __dirname, '..', 'dist' , 'index.html'))
})

app.post('/register', async (req, res) => {
	try{
		// Extract dades of request
		const { nickname, password } = req.body

		console.log(req.body)
		console.log("REGISTER: DADOS RECEBIDOS")

		//If user already exist --> return error and finish function
		const findUser = await UsersDB.findOne({ name: nickname})
		if( findUser ) {
			console.log('Nada, CABA JÁ REGISTRADO')
			return res.status(400).send({ error: "User already exist" })
		}

		// If it's really a new user...

		// Generate a new Pin random
		const newPin = Math.random().toString(36).substring(9);

		// Insert in database 
		const newUser = new UsersDB({
			pin: newPin,
			name: nickname,
			password: password,
			conversation: {}
		})

		const data = await newUser.save()
		console.log(data)

		const token = await generateAccessToken({ name: nickname, conversations: {} })
		console.log('TOKEN ENVIADOS:')
		console.log(token)


		res.send({
			registro: true,
			token: token
		})

	} catch(err) {
		console.log(err)
		return res.status(400).send({ error: err })
	}

})


app.post('/login', async (req, res) => {
	try {
		const { nickname, password } = req.body
			
		console.log("LOGIN: DADOS RECEBIDOS")
		console.log(nickname, password)

		// Get the User logging
		const UserLogging = await UsersDB.findOne({ name: nickname })

		// If the user dont exist
		if ( !UserLogging ){
			console.log("LOGIN: CABA NÃO ENCONTRADO")
			return res.send({ error: "User did not find" })
		}
		
		console.log(UserLogging)

		const dadesToSendBack = {
			name: UserLogging.name
		}

		console.log('LOGADO: '+ UserLogging.name)

		res.send( dadesToSendBack )
	} catch (err) {
		console.log(err)
		return res.status(400).send({ error: err })
	}

})

io.on('connection', socket => {
    console.log(`New user: ${socket.id}`)
	
	//console.log(findUser('Alone'))

    socket.on('addContact', (pin, pinOfSolicitor) => {

        const userRequested = (pin!=pinOfSolicitor) && database.users['P'+pin] // Return True if exist a user with the pin received AND the pin been diferent of pinOfSolicitor
		
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
            database.users['P'+pin].conversations['P'+pinOfSolicitor] = { 
                type: 1, //The type is for define from who is the messages
                c: codeOfConv
            }
            database.users['P'+pinOfSolicitor].conversations['P'+pin] = { 
                type: 2,
                c: codeOfConv
            }

            //SET in Messages's Database
            database.messages[codeOfConv] = []
        } else {
            // If it already has a conversation in database
            codeOfConv = conversationBefore.c
        }

        //SENDING BACK for the socket
        const name = userRequested.name
        const msgs = database.messages[codeOfConv]
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
