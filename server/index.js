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

// Static files
app.use(express.static(path.join( __dirname, '..','dist')))
console.log(path.join( __dirname, '..','dist')) 
app.set('views', path.join(__dirname,'..', 'dist'))

//Configuration of Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.use(Routes)


const save_name = (socket, next) => {
	// socket.handshake = it's the headers with all dades of requesting of the websocket
	const username = socket.handshake.auth.username
	const pin = socket.handshake.auth.pin
	socket.username = username
	socket.pin = pin
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

	socket.onAny((event, ...args) => {
		console.log(event, args);
	});

	socket.on('addContact', async (pinFromWhoAdd, userRequesting) => {
		/* 
		 * #########################################
		 */
	})

	socket.on('private message', async ( sender )  =>{
		console.log('Mensagem enviada...')
		console.log(sender)

		let { message, token, destination } = sender

		// valide token
		// const verify = jwt.verify(token, secret)
		// console.log(verify)

		// Get the pin of guy to sender the message with his name
											// Change to PIn
		const doc = await db.search_user_with_name( sender.name ) //UsersDB.findOne({ name: sender.name }, 'pin')
		const pin_of_guy = doc.pin

		// create chat
		if ( !destination ){
			console.log('AQUI CRIA A CONVERSA')

			// create a new conversation and return the code of it
			destination = db.create_new_chat({ 
					pin_1: verify.pin,
					pin_2: pin_of_guy 
			}, message)

			// ----------------------------------------------
			socket.emit( 'new_chat', { name:sender.name, cod: destination, type: 1, msgs: [] } )
			socket.emit( 'new_message', { cod: destination, msgs: sender.message })
			return
		}

		// Send message

		let new_message = db.new_message( verify.pin, destination, sender.message   )

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
