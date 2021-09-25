import mongoose from 'mongoose'

// Models
import MessagesDB from './models/Messages'
import UsersDB from './models/Users'

import { UserPin, User, Conversation } from './types'

const start = (): void => { 
    mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true }).then( () => console.log('MONGODB conectado')).catch( (err) => console.log('ERRO em conectar ao MONGO: '+err) )
}

const check_db = {
	async search_user_with_pin(pin:UserPin) {
		const user_found = await UsersDB.findOne({ pin: pin }, 'name pin conversations')
		return user_found
	},
	async search_user_with_name(name:string, ...dades_to_get:string[] ){
        const dados_opcionais:string = String( dades_to_get ).replace(/,/g, ' ')
		const user_found:any = await UsersDB.findOne({ name: name }, `name pin conversations ${dados_opcionais}`)
		return user_found
	},
	async return_messages(pins_of_chats:string[]){
        const object_to_search = pins_of_chats.map( i => ({ cod: i }) )
		const messages_found:any =  await MessagesDB.find({ $or: [ ...object_to_search ]})
		return messages_found
	},
    async is_there_chat_between(pins_of_chats:string[]){
        const a = await UsersDB.find({ $and: [ {pin: pins_of_chats[0]}, {"conversations.contact":pins_of_chats[1]} ] })
        return a
    }
}

const manage_users_db = {
	// Edit Users info
	async create_new_user (user:User){
		const { name, password } = user

		// Generate a new Pin random
		const newPin = Math.random().toString(36).substring(9);

        try {
            // Insert in database 
            const newUser = new UsersDB(<User>{
                pin: newPin,
                name: name,
                password: password,
                conversations: []
            })
            const data = await newUser.save()
            console.log(`\t [ok] Novo usuario criado`)
        } catch(err){
            console.log(`\t [x] Erro ao criar novo usuario`)
            console.log(err)
        }

        return newPin // Retorna o pin do usuario
	},

	async set_new_contacts_in_users_db ( contact_for_add:UserPin, who_be_update:UserPin[], first_message:string, cod?:string){
		// await UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
        for ( let i of who_be_update ){
            const user_found = await check_db.search_user_with_pin(i) //UsersDB.findOne({ pin: pin_2 }, 'name pin conversations')
            if( !user_found ){
                // REFATORE --- se houver alguem q n existe, buga para geral
                return { error: 'contato não encontrado' }
            }
        }
		
        // UPDATE the conversation on database of both users
        const codeOfConv = cod || Math.random().toString(36).substring(9); //Creation of code the new conversation
        who_be_update.forEach( async (Pin) => {
            const doc1 = await UsersDB.updateOne( { pin: Pin }, {
                $push: { //Insert a new item in array conversations of user
                    conversations: {
                        contact: contact_for_add,
                        cod: codeOfConv
                    }	
                }
            })
            const doc2 = await UsersDB.updateOne( { pin: contact_for_add }, {
                $push: { //Insert a new item in array conversations of user
                    conversations: {
                        contact: Pin,
                        cod: codeOfConv
                    }	
                }
            })
        })

		// Set the new conversation on database 'messages'
		let message = manage_chat_db.new_message_db( [contact_for_add, ...who_be_update], first_message, codeOfConv )

		return codeOfConv // return the code of chat made
	},
}

const manage_chat_db = {
    // Send a message for a conversation (message_db) that already exist
	async send_message ( sender:UserPin, destination:UserPin, message:string ){
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
	
    // Send a message for a conversation (message_db) that doesn't exist or create a one
	async new_message_db ( members: string[], first_message:string, cod?:string ){
		//Creation of code the new conversation
		const codeOfConv = cod || Math.random().toString(36).substring(9);

        try{
            const message = new MessagesDB(<Conversation>{
                members: members,
                cod: codeOfConv,
                messages: [{ from: members[0], body: first_message }]	
            })
            const res = await message.save()
            console.log(`\t Nova conversa setada entre: ${members}`)
        } catch(err){
            console.log('Erro em salvar uma nova conversa:')
            console.log(err)
        }
        return codeOfConv
    }
}

export default {
    start,
	...check_db,
	...manage_chat_db,
	...manage_users_db
}
