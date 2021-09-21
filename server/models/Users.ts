import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const oneConversation = new Schema({
	contact: String,
	type: Number,
	cod: String
});

const UsersSchema = new Schema({
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


export default mongoose.model('Users', UsersSchema);
