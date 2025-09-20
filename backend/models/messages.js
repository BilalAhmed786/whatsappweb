const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for reactions
const ReactionSchema = new Schema(
  {
    text: { type: String, default: '' },
    emoji: { type: String, required: true }, // Emoji as a string, e.g., ":heart:"
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blockedbyuser: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of blocked users
    isviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Schema for media with timestamps
const MediaSchema = new Schema(
  {
    text: { type: String, default: '' },
    isviewed: { type: Boolean, default: false },
    deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
    reactions: [ReactionSchema], // Use the ReactionSchema here
  },
  { timestamps: true } // Add timestamps to each media item
);

// Main schema for messages
const MessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true }, // Reference to Chat
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    text: { type: String, default: '' }, // Text message content
    media: [MediaSchema], 
    isviewed: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
    replyTo: {
      messageId: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
      objectId: { type: Schema.Types.ObjectId, default: null },
    }, // Replying to another message
    reactions: { type: [ReactionSchema], default: [] }, // Array of reactions
    deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: null }],
  },
  { timestamps: true }
);

// Creating and exporting the Message model
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
