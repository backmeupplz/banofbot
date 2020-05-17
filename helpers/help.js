/**
 * Used to send help message
 *
 * @module help
 * @license MIT
 */

/**
 * Sends help message to specified chat
 * @param {Telegam:Bot} bot Bot that should send help
 * @param {Mongoose:Chat} chat Chat where to send help
 */
function sendHelp(bot, chat) {
  const strings = require('./strings')()

  const privateText =
    chat.type === 'private' || chat.type === 'channel'
      ? 'helpPrivate'
      : 'helpPublic'

  const text = strings.translate(privateText, chat.language)
  bot.sendMessage(chat.id, text, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  })
}

/** Exports */
module.exports = {
  sendHelp,
}
