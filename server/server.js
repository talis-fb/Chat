const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http) 
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const secret = 'kiuhfnuisdf9we8hafno9f8e8fuisdbFsd' // require('crypto').randomBytes(64).toString('hex')

// Models
const MessagesDB = require('./models/Messages')
const UsersDB = require('./models/Users')

mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: "true" })
	.then( () => console.log('MONGODB conectado'))
	.catch( (err) => console.log('ERRO em conectar ao MONGO: '+err) )

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

		const token = generateAccessToken({ name: nickname, pin: newPin })
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

		// Get the User logging on database
		const UserLogging = await UsersDB.findOne({ name: nickname })

		// If the user dont exist
		if ( !UserLogging ){
			console.log("LOGIN: CABA NÃO ENCONTRADO")
			return res.send({ error: "Usuario nao encontrado" })
		}
		console.log(UserLogging)

		if ( UserLogging.password !== password ){
			console.log('Senha errada')
			return res.send({ error: 'senha errada' })
		}

		const token = generateAccessToken({ name: UserLogging.name, pin: UserLogging.pin })
		console.log('TOKEN ENVIADOS:')
		console.log(token)

		const dadesToSendBack = {
			user: {
				name: UserLogging.name,
				pin: UserLogging.pin
			},
			token: token
		}

		console.log('LOGADO: '+ UserLogging.name)

		res.send( dadesToSendBack )

	} catch (err) {
		console.log(err)
		return res.status(400).send({ error: err })
	}

})

app.post('/returnContacts', async (req, res) => {
	const { token } = req.body

	let verify
	let user 
	try {
		verify = jwt.verify(token, secret)
		doc = await UsersDB.findOne({ name: verify.name }, 'conversations')
	} catch(err){
		return res.send({ error: err })
		console.log('ERRO RETORNO CONTATOS')
	}

	const conversations = doc.conversations

	let dades = []
	for(let c in conversations){
		const user_found = await UsersDB.findOne({ pin: conversations[c].contact }, 'name')
		const messages_found = await MessagesDB.findOne({ pin: conversations[c].cod }, 'messages')
		const messages = messages_found.messages

		dades[c] = { 
			name: user_found.name, 
			cod: conversations[c].cod, 
			type: conversations[c].type,
			msgs: [...messages] // DESSE MODO ESTÁ INDO O ID DOS ARQUVISO NO DATABASE
		}
	}

	console.log('Atualização de contatos...')
	console.log(dades)

	return res.send( dades)
})

app.post('/addContact', async (req, res) => {

	const { pin_to_get, pin_user_requesting, name } = req.body

	console.log('pessoa quem add')
	console.log(pin_user_requesting)
	console.log('PEssoa em busca')
	console.log(pin_to_get)

	//If the Pin received is the same of who is requesting
	if( pin_to_get===pin_user_requesting ) {
		return res.send({ error: 'PIN Invalido' })
	}

	const user_found = await UsersDB.findOne({ pin: pin_to_get }, 'name pin conversations')
	if( !user_found ){
		return res.send({ error: 'contato não encontrado' })
	}

	console.log('user pego')
	console.log(user_found)

	const isThereTalkBefore = user_found.conversations.filter( i => i.contact === pin_user_requesting )
	if ( isThereTalkBefore[0] ){
		console.log('TEM CONVERSA JÁ MEU CHAPA')
		return res.send({ error: 'já adicionado'})
	}

	console.log('envia o contato para o caba')
	//SENDING BACK for the socket
	const conversation = {
		name: user_found.name,
		msgs: []
	}
	console.log('CONVERSA')
	console.log(conversation)
	return res.send(conversation)
})

async function create_chat(chat, first_message){
	const { pin_1, pin_2 } = chat

	console.log(`pin1 ${pin_1}`)
	console.log(`pin2 ${pin_2}`)
	console.log('Msg: ')
	console.log(first_message)

	const user_found = await UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
	if( !user_found ){
		return { error: 'contato não encontrado' }
	}

	console.log('user pego')
	console.log(user_found)


	console.log('CRIA O TALK')

	//Creation of code the new conversation
	const codeOfConv = Math.random().toString(36).substring(9);

	// Set the new conversation on database 'messages'
	let message = new MessagesDB({
		pin: codeOfConv,
		messages: [{ sender:1, text: first_message }]	
	})
	const res = await message.save()
	console.log('NOVA CONVERSA ON DB')
	console.log(res)


	// UPDATE the conversation on database of both users
	const user1 = await UsersDB.updateOne( { pin: pin_1 }, {
		$push: { //Insert a new item in array conversations of user
			conversations: {
				contact: pin_2,
				type: 1,
				cod: codeOfConv
			}	
		}
	})
	const user2 = await UsersDB.updateOne( { pin: pin_2 }, {
		$push: { //Insert a new item in array conversations of user
			conversations: {
				contact: pin_1,
				type: 2,
				cod: codeOfConv
			}	
		}
	})


	console.log('conversa criada')
	return codeOfConv // return the code of chat made
}


io.on('connection', socket => {
	console.log(`New user: ${socket.id}`)

	socket.on('addContact', async (pinFromWhoAdd, userRequesting) => {
		/* 
		 * #########################################
		 */
	})

	socket.on('send_message', async ( sender )  =>{
		console.log('RECEBBBIDADASDA')
		console.log(sender)

		let { message, token, destination, type } = sender

		// valide token
		const verify = jwt.verify(token, secret)
		console.log(verify)

		// Get the pin of guy to sender the message with his name
		const doc = await UsersDB.findOne({ name: sender.name }, 'pin')
		const pin_of_guy = doc.pin

		// create chat
		if ( !destination ){
			console.log('AQUI CRIA A CONVERSA')

			// create a new conversation and return the code of it
			destination = create_chat({ pin_1: verify.pin, pin_2: pin_of_guy }, message)

			// ----------------------------------------------
			socket.emit( 'new_chat', { name:sender.name, cod: destination, type: 1, msgs: [] } )
			socket.emit( 'new_message', { cod: destination, msgs: sender.message })
			return
		}

		// Send message
		let new_message = await MessagesDB.updateOne( { pin: sender.destination }, {
				$push: { //Insert a new item in array conversations of user
					messages: {
						sender: sender.type,
						text: sender.message,
					}	
				}
			})
		console.log('MENSAGEM SETADA')

		socket.emit( 'new_message', { cod: destination, msg: sender.message })
	})

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

});

http.listen(3000, () => {
	console.log('listening on *:3000');
});
