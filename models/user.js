/**
 * @module models/user
 * @license MIT
 */

/** Dependencies */
const mongoose = require('mongoose')

/** Schema */
const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true, // Add index for faster lookups by Telegram user ID
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: String,
    username: {
      type: String,
      index: true, // Add index for username lookups
    },
  },
  { timestamps: true, usePushEach: true }
)

// Create a unique index on the id field for faster lookups
userSchema.index({ id: 1 }, { unique: true });

// Create index for searching users by name
userSchema.index({ first_name: 1, last_name: 1 });

userSchema.methods.name = function name() {
  if (this.username) {
    return `@${this.username}`
  } else if (this.last_name) {
    return `${this.first_name} ${this.last_name}`
  }
  return this.first_name
}

userSchema.methods.realNameWithHTML = function(bot, chatId) {
  return bot.getChatMember(chatId, this.id).then(res => {
    const user = res.user
    if (user.username) {
      return `<a href="tg://user?id=${user.id}">@${user.username}</a>`
    }
    return `<a href="tg://user?id=${user.id}">${(user.first_name || 'User')
      .replace('<', '')
      .replace('>', '')}${
      user.last_name
        ? ` ${user.last_name.replace('<', '').replace('>', '')}`
        : ''
    }</a>`
  })
}

/** Exports */
module.exports = mongoose.model('user', userSchema)
