const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  conversations: {
    //parte dos outros
  }
});

module.exports = mongoose.model('Users', UsersSchema);