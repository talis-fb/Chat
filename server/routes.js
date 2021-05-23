const express = require('express')
var router = express.Router()

const { generateAccessToken, verify_jwt } = require('./auth')
const db = require('./database')

router
	.get('/', (req, res) => {
		res.sendFile(path.join( __dirname, '..', 'dist' , 'index.html'));
		console.log(path.join( __dirname, '..', 'dist' , 'index.html'))
	})

	.post('/register', async (req, res) => {
		try{
			// Extract dades of request
			const { nickname, password } = req.body

			console.log(req.body)
			console.log("REGISTER: DADOS RECEBIDOS")

			//If user already exist --> return error and finish function
			const findUser = await db.return_user_with_name(nickname) //UsersDB.findOne({ name: nickname})
			if( findUser ) {
				console.log('Nada, CABA JÁ REGISTRADO')
				return res.status(400).send({ error: "User already exist" })
			}

			db.create_new_user({
				pin: newPin,
				name: nickname,
				password: password,
				conversation: []
			})

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

	.post('/login', async (req, res) => {
		try {
			const { nickname, password } = req.body

			console.log("LOGIN: DADOS RECEBIDOS")
			console.log(nickname, password)

			// Get the User logging on database
			const UserLogging = await db.return_user_with_name(nickname, 'password')

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

	.post('/returnContacts', async (req, res) => {
		const { token } = req.body

		let verify
		let user 
		try {
			verify = verify_jwt(token)
			doc = await db.return_user_with_name( verify.name ) //UsersDB.findOne({ name: verify.name }, 'conversations')
		} catch(err){
			console.log('ERRO RETORNO CONTATOS')
			console.log(err)
			return res.send({ error: err })
		}

		const conversations = doc.conversations

		let dades = []
		for(let c in conversations){
			const user_found = await db.return_user_with_pin( conversations[c].contact ) // UsersDB.findOne({ pin: conversations[c].contact }, 'name pin')
			const messages_found = await db.return_messages( conversations[c].cod ) //MessagesDB.findOne({ pin: conversations[c].cod }, 'messages')
			const messages = messages_found.messages

			dades[c] = { 
				name: user_found.name, 
				pin: user_found.pin,
				cod: conversations[c].cod, 
				// type: conversations[c].type,
				msgs: [...messages] // DESSE MODO ESTÁ INDO O ID DOS ARQUVISO NO DATABASE
			}
		}

		console.log('Atualização de contatos...')
		console.log(dades)

		return res.send( dades)
	})

	.post('/addContact', async (req, res) => {

		const { pin_to_get, pin_user_requesting, name } = req.body

		console.log('pessoa quem add')
		console.log(pin_user_requesting)
		console.log('PEssoa em busca')
		console.log(pin_to_get)

		//If the Pin received is the same of who is requesting
		if( pin_to_get===pin_user_requesting ) {
			return res.send({ error: 'PIN Invalido' })
		}

		const user_found = await db.return_user_with_pin( pin_to_get ) //UsersDB.findOne({ pin: pin_to_get }, 'name pin conversations')
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
		const contact = {
			name: user_found.name,
			pin: user_found.pin,
			msgs: []
		}
		console.log('CONVERSA')
		console.log(contact)
		return res.send(contact)
	})

module.exports = router
