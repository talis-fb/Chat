const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, { cors: { origin: "http://localhost:8080"}} ) 
const routes = require('./routes')

const db = require('./database')
db.start()

app.use(express.static(path.join( __dirname, '..','dist')))
console.log(path.join( __dirname, '..','dist'))
app.set('views', path.join(__dirname,'..', 'dist'))

//Configuration of Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.use(routes)

async function create_chat(chat, first_message){
	const { pin_1, pin_2 } = chat

	console.log(`pin1 ${pin_1}`)
	console.log(`pin2 ${pin_2}`)
	console.log('Msg: ')
	console.log(first_message)

	const user_found = await db.return_user_with_pin(pin_2) //UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
	if( !user_found ){
		return { error: 'contato não encontrado' }
	}

	console.log('user pego')
	console.log(user_found)

	console.log('CRIA O TALK')

	// Set the new conversation on database 'messages'
	let message = db.new_conversation( [pin_1,pin_2], first_message )

	// UPDATE the conversation on database of both users
	const user1 = db.add_new_contact( pin_1, pin2 )
	const user2 = db.add_new_contact( pin_2, pin1 )

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

		let { message, token, destination } = sender

		// valide token
		const verify = jwt.verify(token, secret)
		console.log(verify)

		// Get the pin of guy to sender the message with his name
											// Change to PIn
		const doc = await UsersDB.findOne({ name: sender.name }, 'pin')
		const pin_of_guy = doc.pin

		// create chat
		if ( !destination ){
			console.log('AQUI CRIA A CONVERSA')

			// create a new conversation and return the code of it
			destination = create_chat({ 
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
