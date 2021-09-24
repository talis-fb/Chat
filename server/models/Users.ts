import mongoose,{ Document } from 'mongoose'
const Schema = mongoose.Schema;

interface IOneConversation extends Document {
    contact: string,
    cod:string
}

const oneConversation = new Schema<IOneConversation>({
	contact: String,
	cod: String
});

interface IUsersSchema extends Document {
    pin: string,
    name: string,
    password: string,
    conversations: IOneConversation[]
}

const UsersSchema = new Schema<IUsersSchema>({
	pin: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	conversations: [oneConversation]
});


export default mongoose.model<IUsersSchema>('Users', UsersSchema);
