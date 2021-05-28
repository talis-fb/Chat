const express = require('express')
var Router = express.Router()

const { generateAccessToken, verify_jwt } = require('./auth')
const db = require('./database')

Router
	.get('/', (req, res) => {
		res.sendFile(path.join( __dirname, '..', 'dist' , 'index.html'));
		console.log(path.join( __dirname, '..', 'dist' , 'index.html'))
	})

	.post('/register', async (req, res) => {
		try{
			console.log('- Processo de REGISTRO:')
			// Extract dades of request
			const { nickname, password } = req.body

			// print dades
			process.stdout.write(`\t [ok] Dados recebidos:` ) // Um console.log que não quebra linha
			console.log(req.body)

			//If user already exist --> return error and finish function
			const user_exist = await db.search_user_with_name(nickname) //UsersDB.findOne({ name: nickname})
			if( user_exist ) {
				console.log(`\t [x] ERRO: Usuario já registrado\n`)
				return res.status(400).send({ error: "User already exist" })
			}

			// Generate a new Pin random
			const newPin = Math.random().toString(36).substring(9);
			console.log(`\t [ok] NOVO PIN: `+newPin)

			db.create_new_user({
				pin: newPin,
				name: nickname,
				password: password,
				conversation: []
			})

			const token = generateAccessToken({ name: nickname, pin: newPin })

			res.send({
				registro: true,
				user: {
					name: nickname,
					pin: newPin
				},
				token: token
			})
			console.log(`\t [ok] Dados enviados de volta ` ) 

		} catch(err) {
			console.log(`\t [x] ERRO AO REGISTRAR O USER:` ) 
			console.log(err)
			return res.status(400).send({ registro: false, error: err })
		}

	})

	.post('/login', async (req, res) => {
		try {
			const { nickname, password } = req.body

			console.log('- Processo de LOGIN:')

			// print dades
			process.stdout.write(`\t [ok] Dados recebidos:` ) // Um console.log que não quebra linha
			console.log( req.body)

			// Get the User logging on database
			const UserLogging = await db.search_user_with_name(nickname, 'password')

			// If the user dont exist
			if ( !UserLogging ){
				console.log(`\t [x] Usuario não encontrado`)
				return res.send({ error: "Usuario nao encontrado" })
			}

			process.stdout.write(`\t [ok] Usuario Encontrado: ` ) 
			console.log(UserLogging)

			if ( UserLogging.password !== password ){
				console.log(`\t [x] SENHA ERRADA`)
				return res.send({ error: 'senha errada' })
			}

			const token = generateAccessToken({ name: UserLogging.name, pin: UserLogging.pin })
			console.log(`\t [ok] Token gerado`)

			const dadesToSendBack = {
				user: {
					name: UserLogging.name,
					pin: UserLogging.pin
				},
				token: token
			}

			console.log(`\t [ok] LOGADO: `+ UserLogging.name)
			res.send( dadesToSendBack )
		} catch (err) {
			console.log(`\t [x] ERRO AO LOGAR O USER:` ) 
			console.log(err)
			return res.status(400).send({ error: err })
		}

	})

	.post('/returnContacts', async (req, res) => {
		const { token } = req.body

		console.log('- Retorno de contato: ')

		let verify
		let user 
		try {
			verify = verify_jwt(token)
			console.log(`\t [ok] TOKEN validado` ) 
			doc = await db.search_user_with_name( verify.name ) //UsersDB.findOne({ name: verify.name }, 'conversations')
		} catch(err){
			console.log(`\t [x] ERRO RETORNO CONTATOS: `) 
			console.log(err)
			return res.send({ error: err })
		}

		const conversations = doc.conversations
		return

		let dades = []
		for(let c in conversations){
			let messages_found
			let user_found
			try {
				user_found = await db.search_user_with_pin( conversations[c].contact ) // UsersDB.findOne({ pin: conversations[c].contact }, 'name pin')
				messages_found = await db.return_messages( conversations[c].cod ) //MessagesDB.findOne({ pin: conversations[c].cod }, 'messages')
				// messages = (messages_found) ? messages_found.messages : null
			} catch(err){
				console.log(err)
				messages_found = []
			}

			dades[c] = { 
				// name: user_found.name, 
				pin: user_found.contact,
				cod: conversations[c].cod, 
				msgs: [...messages_found] // DESSE MODO ESTÁ INDO O ID DOS ARQUVISO NO DATABASE
			}
		}


		console.log(`\t [ok] TOKEN validado` ) 
		console.log(`\t [ok] Dados enviados:` ) 
		console.log(dades)

		return res.send( dades)
	})

	.post('/addContact', async (req, res) => {

		const { pin_to_get, pin_user_requesting, name } = req.body

		//If the Pin received is the same of who is requesting
		if( pin_to_get===pin_user_requesting ) {
			return res.send({ error: 'PIN Invalido' })
		}

		const user_found = await db.search_user_with_pin( pin_to_get ) //UsersDB.findOne({ pin: pin_to_get }, 'name pin conversations')
		if( !user_found ){
			return res.send({ error: 'contato não encontrado' })
		}

		const isThereTalkBefore = user_found.conversations.filter( i => i.contact === pin_user_requesting )
		if ( isThereTalkBefore[0] ){
			return res.send({ error: 'já adicionado'})
		}

		//SENDING BACK for the socket
		const contact = {
			name: user_found.name,
			pin: user_found.pin,
			msgs: []
		}
		return res.send(contact)
	})

module.exports = Router
