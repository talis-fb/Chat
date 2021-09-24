import express from 'express'
const app = express()

import path from 'path'
// import bodyParser from 'body-parser'
import Routes from './routes'

// Database
import db from './database'
db.start()

//jwt
import * as jwt from './auth'

// Socket.IO
import { Socket } from 'socket.io'
const http = require('http').Server(app)
const io:any = require('socket.io')( http, { cors: { origin: "http://localhost:8080"}} ) 

// Static files
app.use(express.static(path.join( __dirname, '..','dist')))
console.log(path.join( __dirname, '..','dist')) 
app.set('views', path.join(__dirname,'..', 'dist'))

// TESTE DA FUNÇÃO DE RETORNAR
console.log("Ola mubndoooooooooooo")
console.log(db.return_messages([ "m7g", "q13p", "3wh "]))

async function aa(){
    console.log("Ola mubndoooooooooooo")
    console.log(await db.return_messages([ "m7g", "q13p", "3wh "]))
}

aa()
//Configuration of Body-Parser
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json())

// Pode importar só isso ao inves do body-parser
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

//Routes
app.use(Routes)

const save_name = async (socket:any, next:()=>void ) => {
    // Era para socket a tipagem de 'Socket', mas n aceita adições
	const token = <any>socket.handshake.auth.token

	let verify:any
	try {
		verify = await jwt.verify_jwt(token)
	} catch(err){
		console.log(err)
		return
	}

	socket.handshake.auth.username = <any>verify.name
	socket.handshake.auth.pin = <any>verify.pin

	// Enter in room of his pin
	socket.join(socket.handshake.auth.pin)

	next()
}

io.use(save_name)
io.on('connection', ( socket:Socket ) => {
	console.log(`New user: ${socket.id}`)

	// set all sockets onlines in array 'users'
    interface User {
        username: string,
        userID: string,
        pin: string
    }
	const users:Array<User> = []

	for (let [id, socket] of io.of("/").sockets) {
		users.push({
			userID: id,
			username: socket.handshake.auth.username,
			pin: socket.handshake.auth.pin
		})
	}

	console.log('\n usuarios ativos...')
	console.log(users)

    // Alerta de qualquer evento
	socket.onAny((event, ...args) => console.log(event, args))

	// socket.on('first message', async ( pin_to_who, token_sender, message ) => { })



	socket.on('private message', async ( sender )  =>{
		console.log('Mensagem enviada...')
		console.log(sender)

		let { message, destination, token } = sender

		if ( !destination ) return

		const user = jwt.verify_jwt(token)
		console.log('token')
		console.log(user)

		try{
			const updated = <any>await db.send_message( "USERRR PIN", destination, message )
			console.log('acho?:')
			console.log(!!updated)
			if( updated ){
				for( let i of updated.members ){
					io.to(<any>i).emit("private message", { cod: destination, body: message, from: 'user.pin' } )
				}
			}
		}catch (err){
			console.log('Erro')
			console.log(err)
		}

		return
	})

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

});

http.listen(3000, () => {
	console.log('listening on *:3000');
});
