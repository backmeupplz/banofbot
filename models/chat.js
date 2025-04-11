// Dependencies
const mongoose = require('mongoose')

// Schema
const Schema = mongoose.Schema
const chatSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      index: true,
    },
    first_name: String,
    last_name: String,
    all_members_are_administrators: Boolean,
    language: {
      type: String,
      required: true,
      default: 'en',
    },
    admin_locked: {
      type: Boolean,
      required: true,
      default: false,
    },
    required_voters_count: {
      type: Number,
      required: true,
      default: 5,
    },
    last_ban: {
      type: Date,
      required: true,
      default: new Date(0),
      index: true, // Add index for time-based queries
    },
    seconds_between_bans: {
      type: Number,
      required: true,
      default: 30,
    },
    votekickWord: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, usePushEach: true }
)

// Create a unique index on the id field for faster lookups
chatSchema.index({ id: 1 }, { unique: true });

// Create a compound index for queries that might filter by type and sort by last_ban
chatSchema.index({ type: 1, last_ban: -1 });

// Create an index for the findChatsWithNewcomers function that looks for chats with newcomers
chatSchema.index({ 'newcomers.0': 1 });

// Exports
module.exports = mongoose.model('chat', chatSchema)
