/**
 * Used to send time limit picker
 *
 * @module limit
 * @license MIT
 */

/** Dependencies */
const db = require('./db')

/**
 * Sends time limit message to specified chat
 * @param {Telegam:Bot} bot Bot that should send message
 * @param {Mongoose:Chat} chat Chat where to send message
 */
function sendTime(bot, chat) {
  const strings = require('./strings')()
  strings.setChat(chat)

  const text = strings.translate(
    '✌️ Please, select the minimum amount of time between ban requests. Current limit is *$[1]* seconds.',
    chat.seconds_between_bans
  )
  const options = {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: limitKeyboard() },
  }
  options.reply_markup = JSON.stringify(options.reply_markup)
  bot.sendMessage(chat.id, text, options)
}

/**
 * Called when inline button with time limit is touched
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message of inline button that was touched
 */
function setTime(bot, msg) {
  const options = msg.data.split('~')
  const limit = parseInt(options[1], 10)

  db.findChat(msg.message.chat)
    .then(chat => {
      chat.seconds_between_bans = limit
      return chat
        .save()
        .then(dbchat => updateMessagewithSuccess(bot, msg.message, dbchat))
    })
    .catch(err => updateMessagewithError(bot, msg.message, err))
}

/**
 * Updates passed message with error statement
 * @param {Telegram:Bot} bot Bot that should update the message
 * @param {Telegram:Message} msg Message to be updated
 * @param {Error} error Erorr to be displayed
 */
function updateMessagewithError(bot, msg, error) {
  bot.editMessageText(`❗️ _${error.message}_`, {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: 'Markdown',
  })
}

/**
 * Updates passed message with success statement
 * @param {Telegram:Bot} bot Bot that should update the message
 * @param {Telegram:Message} msg Message to be updated
 * @param {Mongoose:Chat} chat Chat that had limit updated
 */
function updateMessagewithSuccess(bot, msg, chat) {
  const strings = require('./strings')()
  strings.setChat(chat)

  bot.editMessageText(
    strings.translate(
      '@banofbot will now allow new ban requests *$[1]* seconds after the last ban. Thanks!',
      chat.seconds_between_bans
    ),
    {
      parse_mode: 'Markdown',
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    }
  )
}

/**
 * Returns an inline keyboard with all available time limit options
 * @return {Telegram:Inline} Inline keyboard with all available limits
 */
function limitKeyboard() {
  const list = [0, 30, 60, 120, 240, 300, 600, 1200, 5000]
  const keyboard = []
  let temp = []
  list.forEach(number => {
    temp.push({
      text: `${number}`,
      callback_data: `tlti~${number}`,
    })
    if (temp.length >= 3) {
      keyboard.push(temp)
      temp = []
    }
  })
  return keyboard
}

/** Exports */
module.exports = {
  sendTime,
  setTime,
}
