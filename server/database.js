const mongoose = require('mongoose')
const path = require('path')

// Models
const MessagesDB = require('./models/Messages')
const UsersDB = require('./models/Users')

const check_db = {
	async search_user_with_pin(pin){
		const user_found = await UsersDB.findOne({ pin: pin }, 'name pin conversations')
		return user_found
	},
	async search_user_with_name(name, dades_to_get){
		const user_found = await UsersDB.findOne({ name: name }, `name pin conversations ${dades_to_get}`)
		return user_found
	},
	async return_messages(pin_of_chat){
		MessagesDB.findOne({ pin: pin_of_chat}, 'messages')
	}
}

const manage_users_db = {
	// Edit Users info
	async create_new_user (user){
		const { pin, name, password } = user

		// Generate a new Pin random
		const newPin = Math.random().toString(36).substring(9);

		// Insert in database 
		const newUser = new UsersDB({
			pin: pin,
			name: name,
			password: password,
			conversation: []
		})
		const data = await newUser.save()
		console.log(data)
	},
	async add_new_contact ( user_adding, who_add ){
		const doc = await UsersDB.updateOne( { pin: user_adding }, {
			$push: { //Insert a new item in array conversations of user
				conversations: {
					contact: who_add,
				}	
			}
		})
		return doc
	}
}

const manage_chat_db = {
	async create_new_chat (chat, first_message){
		const { pin_1, pin_2 } = chat

		console.log(`pin1 ${pin_1}`)
		console.log(`pin2 ${pin_2}`)
		console.log('Msg: ')
		console.log(first_message)
		// await UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
		const user_found = await check_db.search_user_with_pin(pin_2) //UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
		if( !user_found ){
			return { error: 'contato não encontrado' }
		}

		console.log('user pego')
		console.log(user_found)

		console.log('CRIA O TALK')

		// Set the new conversation on database 'messages'
		let message = this.new_conversation( [pin_1,pin_2], first_message )

		// UPDATE the conversation on database of both users
		const user1 = manage_users_db.add_new_contact( pin_1, pin2 )
		const user2 = manage_users_db.add_new_contact( pin_2, pin1 )

		console.log('conversa criada')
		return codeOfConv // return the code of chat made
	},

	async new_message ( sender, destination, message ){
		// Send message
		let new_message = await MessagesDB.updateOne( { cod: destination }, {
			$push: { //Insert a new item in array conversations of user
				messages: {
					from: sender,
					body: message
				}	
			}
		})
		console.log('MENSAGEM SETADA')
	},
	
	// Edit MessagesDB
	async new_conversation ( members, first_message  ){
		const [ pin_1, pin_2 ] = members

		//Creation of code the new conversation
		const codeOfConv = Math.random().toString(36).substring(9);

		const message = new MessagesDB({
			members: [ pin_1, pin_2 ],
			cod: codeOfConv,
			messages: [{ from: pin_1, body: first_message }]	
		})
		const res = await message.save()
		console.log('NOVA CONVERSA ON DB')
		console.log(res)
	}
}

module.exports = {
	start(){
		mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: "true" })
			.then( () => console.log('MONGODB conectado'))
			.catch( (err) => console.log('ERRO em conectar ao MONGO: '+err) )
	},
	...check_db,
	...manage_chat_db,
	...manage_users_db
}
