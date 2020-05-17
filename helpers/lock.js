/**
 * Used to handle /lock command
 *
 * @module lock
 * @license MIT
 */

/**
 * Function to toggle adminLocked of the chat
 * @param {Telegram:Bot} bot Bot that should send success message
 * @param {Mongoose:Chat} chat Chat that should get adminLocked changed
 */
function toggle(bot, chat) {
  const strings = require('./strings')()

  chat.admin_locked = !chat.admin_locked
  chat
    .save()
    .then((newChat) => {
      const text = newChat.admin_locked ? 'lockOnBanofbot' : 'lockOffBanofbot'
      bot.sendMessage(newChat.id, strings.translate(text, chat.language), {
        parse_mode: 'Markdown',
      })
    })
    .catch(/** todo: handle error */)
}

/** Exports */
module.exports = {
  toggle,
}
