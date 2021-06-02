const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const Routes = require('./routes')

// Database
const db = require('./database')
db.start()

// Socket.IO
const http = require('http').Server(app)
const io = require('socket.io')( http, { cors: { origin: "http://localhost:8080"}} ) 

//jwt
const jwt = require('./auth')

// Static files
app.use(express.static(path.join( __dirname, '..','dist')))
console.log(path.join( __dirname, '..','dist')) 
app.set('views', path.join(__dirname,'..', 'dist'))

//Configuration of Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.use(Routes)

const save_name = async (socket, next) => {
	// socket.handshake = it's the headers with all dades of requesting of the websocket
	const token = socket.handshake.auth.token

	let verify
	try {
		verify = await jwt.verify_jwt(token)
	} catch(err){
		console.log(err)
		return
	}

	socket.username = verify.name
	socket.pin = verify.pin

	// Enter in room of his pin
	socket.join(socket.pin)

	next()
}

io.use(save_name)
io.on('connection', socket => {
	console.log(`New user: ${socket.id}`)

	// set all sockets onlines in array 'users'
	const users = []
	for (let [id, socket] of io.of("/").sockets) {
		users.push({
			userID: id,
			username: socket.username,
			pin: socket.pin
		})
	}
	console.log('\nusuarios ativos...')
	console.log(users)

	socket.onAny((event, ...args) => {
		console.log(event, args);
	});

	socket.on('first message', async ( pin_to_who, token_sender, message ) => { })

	socket.on('private message', async ( sender )  =>{
		console.log('Mensagem enviada...')
		console.log(sender)

		let { message, destination, token } = sender

		if ( !destination ) return

		const user = jwt.verify_jwt(token)
		console.log('token')
		console.log(user)

		try{
			const updated = await db.new_message( user.pin, destination, message )
			console.log('acho?:')
			console.log(!!updated)
			if( updated ){
				for( i of updated.members ){
					io.to(i).emit("private message", { cod: destination, body: message, from: user.pin } )
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
