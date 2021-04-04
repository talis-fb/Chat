const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  pin: {
    type: String,
    required: true
  },
  messages: [{
      sender: Number,
      text: String,
      type: Number
  }]
});

module.exports = mongoose.model('Messages', MessagesSchema);