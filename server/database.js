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
		const messages_found =  await MessagesDB.findOne({ cod: pin_of_chat}, 'messages')
		return messages_found.messages || []
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
	},
	async add_new_contact ( user_adding, who_add, cod ){
		const doc = await UsersDB.updateOne( { pin: user_adding }, {
			$push: { //Insert a new item in array conversations of user
				conversations: {
					contact: who_add,
					cod: cod
				}	
			}
		})
		return doc
	}
}

const manage_chat_db = {
	async create_new_chat (chat, first_message){
		const [ pin_1, pin_2 ] = chat
		// pin_1 -> Who send
		// pin_2 -> who receive

		// await UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
		const user_found = await check_db.search_user_with_pin(pin_2) //UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
		if( !user_found ){
			return { error: 'contato não encontrado' }
		}
		
		//Creation of code the new conversation
		const codeOfConv = Math.random().toString(36).substring(9);

		// Set the new conversation on database 'messages'
		let message = this.new_conversation( [pin_1,pin_2], first_message, codeOfConv )

		// UPDATE the conversation on database of both users
		const user1 = manage_users_db.add_new_contact( pin_1, pin_2, codeOfConv )
		const user2 = manage_users_db.add_new_contact( pin_2, pin_1, codeOfConv )

		return codeOfConv // return the code of chat made
	},

	async new_message ( sender, destination, message ){
		// Send message
		// let new_message = await MessagesDB.updateOne( { cod: destination }, {
		let new_message = await MessagesDB.findOneAndUpdate( { cod: destination }, {
			$push: { //Insert a new item in array conversations of user
				messages: {
					from: sender,
					body: message
				}	
			}
		})
		return new_message
	},
	
	// Edit MessagesDB
	async new_conversation ( members, first_message, cod  ){
		const [ pin_1, pin_2 ] = members

		//Creation of code the new conversation
		const codeOfConv = cod || Math.random().toString(36).substring(9);

		const message = new MessagesDB({
			members: [ pin_1, pin_2 ],
			cod: codeOfConv,
			messages: [{ from: pin_1, body: first_message }]	
		})
		const res = await message.save()
		return codeOfConv
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
