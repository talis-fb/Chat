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
            
			// print dades
			process.stdout.write(`\t [ok] Dados recebidos:` ) // Um console.log que não quebra linha
			console.log(req.body)
            
            // const salt = await bcrypt.genSalt(saltRounds)
			const hashed_password = await bcrypt.hash(password, saltRounds)

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

			const token:string = await generateAccessToken({ name: UserLogging.name, pin: UserLogging.pin })
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
			verify = await verify_jwt(token)
			console.log(`\t [ok] TOKEN validado: ${verify}` ) 
			doc = await db.search_user_with_name( verify.name ) //UsersDB.findOne({ name: verify.name }, 'conversations')
		} catch(err){
			console.log(`\t [x] ERRO RETORNO CONTATOS: `) 
			console.log(err)
			return res.send({ error: err })
		}

        console.log('encontrado')
        console.log(doc)


        if ( !doc.conversations.length )
            return res.send([]) 

		const conversations:Array<string> = doc.conversations.map( (i):string => i.cod ) // return the array with all pins of conversations of user
        process.stdout.write(`\t CONTATOS RETORNADOS:`) 
        console.log(conversations)

        const messages_found = await db.return_messages( conversations ) 
        process.stdout.write(`\t [ok] DADOS ENVIADOS:`) 
		console.log(messages_found)

		return res.send( messages_found ) 
	})

	.post('/addContact', async (req:Request, res:Response) => {
		// const { pin_to_get, pin_user_requesting } = req.body
		const { pin, token  } = req.body

        let verify:any
		try {
			verify = await verify_jwt(token)
			process.stdout.write(`\t [ok] TOKEN validado: ` ) 
            console.log(verify)
		} catch(err){
			console.log(`\t [x] ERRO RETORNO CONTATOS: `) 
			console.log(err)
			return res.send({ error: err })
		}

        process.stdout.write(`\t Contao para adicionar:`)
        console.log(pin)

		//If the Pin received is the same of who is requesting
		if( pin===verify.pin ) {
			return res.send({ error: 'PIN Invalido' })
		}

		const user_found:any = await db.search_user_with_pin( pin ) 
		if( !user_found ){
			return res.send({ error: 'contato não encontrado' })
		}

        process.stdout.write(`\t Contato Conversas:`)
        console.log(user_found.conversations)

        // Melhorar isoo <------------------------------------------------------------------------------------
        const isThere = await db.is_there_chat_between([pin,verify.pin])

		// const isThereTalkBefore = user_found.conversations.filter( (i:any) => i.contact === verify.pin )
		if ( isThere[0] ){
			return res.send({ error: 'já adicionado'})
		}

		// CRIAR O chat e ja adicioanar o contato 
        const cod_conv = await db.set_new_contacts_in_users_db(pin, [verify.pin], "")
		// const cod_conv = await db.new_message_db([ pin, verify.pin ], "")

		//SENDING BACK for the socket
		const contact:any = {
			name: user_found.name,
			pin: user_found.pin,
			cod: cod_conv,
			msgs: []
		}
        console.log('addContact ok')
		return res.send(contact)
	})

export default Router
