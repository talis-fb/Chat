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
			conversation: []
		})

		const data = await newUser.save()
		console.log(data)

		const token = await generateAccessToken({ name: nickname, conversations: {} })
		console.log('TOKEN ENVIADOS:')
		console.log(token)


		res.send({
			registro: true,
			user: {
				name: nickname,
				pin: newPin
			},
			token: token
		})

	} catch(err) {
		console.log(err)
		return res.status(400).send({ registro: false, error: err })
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

		if ( UserLogging.password !== password ){
			console.log('Senha errada')
			return res.send({ error: 'senha errada' })
		}

		const dadesToSendBack = {
			user: {
				name: UserLogging.name,
				pin: UserLogging.pin
			},
			token: generateAccessToken(UserLogging.name)
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

    socket.on('addContact', async (pinFromWhoAdd, userRequesting) => {

		console.log('pessoa quem add')
		console.log(userRequesting)

		console.log('pessoa para add')
		console.log(pinFromWhoAdd)
		const peopleInSearch = await UsersDB.findOne({ pin: pinFromWhoAdd })
		
        //If the Pin received is the same of who is requesting
        if( pinFromWhoAdd===userRequesting.pin ) return
		
		// If already exist a conversation between both users
		// .....falta implementar

		console.log('CRIA O TALK')

		//Creation of code the new conversation
		const codeOfConv = Math.random().toString(36).substring(9);

		//SET the conversation on database of both users
		const user1 = await UsersDB.updateOne( { pin:pinFromWhoAdd }, {
			$push: { //Insert a new item in array conversations of user
				conversations: {
					contact: userRequesting.name,
					type: 2,
					cod: codeOfConv
				}	
			}
		})
		const user2 = await UsersDB.updateOne( { pin:userRequesting.pin }, {
			$push: { //Insert a new item in array conversations of user
				conversations: {
					contact: peopleInSearch.name,
					type: 1,
					cod: codeOfConv
				}	
			}
		})
		
		//SAVE in Messages's Database
		user1.exec()
		user2.exec()
		
        //SENDING BACK for the socket
        const name = userRequested.name
        const msgs = []
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
