import express, { Request, Response } from 'express'
var Router = express.Router()

import bcrypt from 'bcrypt'
const saltRounds = 10

import path from 'path'

import { generateAccessToken, verify_jwt } from './auth'
import db from './database'

import { Conversation, Mensagem, User, UserPin } from './types'

Router
	.get('/', (req:Request, res:Response) => {
		res.sendFile(path.join( __dirname, '..', 'dist' , 'index.html'));
		console.log(path.join( __dirname, '..', 'dist' , 'index.html'))
	})

	.post('/register', async (req:Request, res:Response) => {
		try{
			console.log('- Processo de REGISTRO:')
			// Extract dades of request
			const { nickname, password } = req.body

			const hashed_password =  await bcrypt.hash(password, saltRounds)

			// print dades
			process.stdout.write(`\t [ok] Dados recebidos:` ) // Um console.log que não quebra linha
			console.log(req.body)

			//If user already exist --> return error and finish function
			const user_exist = !!(await db.search_user_with_name(nickname))
			if( user_exist ) {
				console.log(`\t [x] ERRO: Usuario já registrado\n`)
				return res.status(400).send({ error: "User already exist" })
			}

			// Generate a new Pin random
			const newPinUser:string = await db.create_new_user({
                pin: "",
				name: nickname,
				password: hashed_password,
				conversations: []
			})
			console.log(`\t [ok] NOVO PIN: `+newPinUser)

			const token = generateAccessToken({ name: nickname, pin: newPinUser })

			res.send({
				registro: true,
				user: {
					name: nickname,
					pin: newPinUser
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

	.post('/login', async (req:Request, res:Response) => {
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

			const password_correct =  await bcrypt.compare( password, UserLogging.password )
			if ( !password_correct ){
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

	.post('/returnContacts', async (req:Request, res:Response) => {
		const { token } = req.body

		console.log('- Retorno de contato: ')

		let verify:any
		let doc:User
		try {
			verify = verify_jwt(token)
			console.log(`\t [ok] TOKEN validado` ) 
			doc = await db.search_user_with_name( verify.name ) //UsersDB.findOne({ name: verify.name }, 'conversations')
		} catch(err){
			console.log(`\t [x] ERRO RETORNO CONTATOS: `) 
			console.log(err)
			return res.send({ error: err })
		}

		const conversations:Array<string> = doc.conversations.map( ( i ):string => i.cod ) // return the array with all pins of conversations of user
		let dades:Array<Mensagem> = []

        const messages_found = await db.return_messages( conversations ) 

		console.log(`\t [ok] TOKEN validado` ) 
		console.log(`\t [ok] Dados enviados:` ) 
		console.log(dades)

		return res.send( messages_found ) 
	})

	.post('/addContact', async (req:Request, res:Response) => {

		const { pin_to_get, pin_user_requesting } = req.body

		//If the Pin received is the same of who is requesting
		if( pin_to_get===pin_user_requesting ) {
			return res.send({ error: 'PIN Invalido' })
		}

		const user_found:any = await db.search_user_with_pin( pin_to_get ) 
		if( !user_found ){
			return res.send({ error: 'contato não encontrado' })
		}

		const isThereTalkBefore = user_found.conversations.filter( (i:any) => i.contact === pin_user_requesting )
		if ( isThereTalkBefore[0] ){
			return res.send({ error: 'já adicionado'})
		}

		// CRIAR O chat e ja adicioanar o contato 
		const cod_conv = await db.new_message_db([ pin_user_requesting, pin_to_get ], "")

		//SENDING BACK for the socket
		const contact:any = {
			name: user_found.name,
			pin: user_found.pin,
			cod: cod_conv,
			msgs: []
		}
		return res.send(contact)
	})

export default Router
