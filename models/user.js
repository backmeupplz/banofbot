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
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: String,
    username: String,
  },
  { timestamps: true, usePushEach: true }
)

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
    return `<a href="tg://user?id=${user.id}">${user.first_name || 'User'}${
      user.last_name ? ` ${user.last_name}` : ''
    }</a>`
  })
}

/** Exports */
module.exports = mongoose.model('user', userSchema)
