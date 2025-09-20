const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose
const ChatSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Two users in a one-on-one chat
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // Array of messages
  });

  const Chat = mongoose.model('Chat', ChatSchema);

  module.exports = Chat
