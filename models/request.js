/**
 * @module models/request
 * @license MIT
 */

/** Dependencies */
const mongoose = require('mongoose')

/** Schema */
const Schema = mongoose.Schema
const requestSchema = new Schema(
  {
    inline_chat_id: Number,
    inline_message_id: Number,
    reply_chat_id: Number,
    reply_message_id: Number,
    chat: {
      type: Schema.ObjectId,
      ref: 'chat',
      required: true,
      index: true, // Add index for faster lookups by chat
    },
    candidate: {
      type: Schema.ObjectId,
      ref: 'user',
      required: true,
      index: true, // Add index for faster lookups by candidate
    },
    starter: {
      type: Schema.ObjectId,
      ref: 'user',
      required: true,
      index: true, // Add index for faster lookups by request starter
    },
    voters_ban: [
      {
        type: Schema.ObjectId,
        ref: 'user',
        required: true,
        default: [],
      },
    ],
    voters_noban: [
      {
        type: Schema.ObjectId,
        ref: 'user',
        required: true,
        default: [],
      },
    ],
  },
  { timestamps: true, usePushEach: true }
)

// Create compound indexes for common query patterns
// Index for queries that filter by chat and sort by createdAt (for finding recent requests in a chat)
requestSchema.index({ chat: 1, createdAt: -1 });

// Index for finding active requests (those with fewer votes than required)
requestSchema.index({ 'voters_ban.0': 1 });
requestSchema.index({ 'voters_noban.0': 1 });

// Index for finding requests by inline message details (used when updating votes)
requestSchema.index({ inline_chat_id: 1, inline_message_id: 1 });

/** Exports */
module.exports = mongoose.model('request', requestSchema)
