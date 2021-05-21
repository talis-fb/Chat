const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Members = new Schema({
	s1: {
		type: Number,
		required: true
	},
	s2: {
		type: Number,
		required: true
	}
})

const Message = new Schema({
	sender: Number,
	text: String,
	type: Number
})

const MessagesSchema = new Schema({
	pin: {
		type: String,
		required: true
	},
	// members: { Members },
	messages: [Message]
});

module.exports = mongoose.model('Messages', MessagesSchema);
