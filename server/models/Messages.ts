import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const Message = new Schema({
	from: String,
	body: String
})

const MessagesSchema = new Schema({
	cod: {
		type: String,
		require: true
	},
	members: [String],
	messages: [Message]
});

export default mongoose.model('Messages', MessagesSchema);
