/**
 * @module models/request
 * @license MIT
 */

/** Dependencies */
const mongoose = require('mongoose');

/** Schema */
const Schema = mongoose.Schema;
const requestSchema = new Schema({
  inline_chat_id: Number,
  inline_message_id: Number,
  reply_chat_id: Number,
  reply_message_id: Number,
  chat: {
    type: Schema.ObjectId,
    ref: 'chat',
    required: true,
  },
  candidate: {
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
  },
  starter: {
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
  },
  voters_ban: [{
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
    default: [],
  }],
  voters_noban: [{
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
    default: [],
  }],
}, { timestamps: true });

/** Exports */
module.exports = mongoose.model('request', requestSchema);
