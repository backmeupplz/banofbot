/**
 * Used to send limit picker
 *
 * @module limit
 * @license MIT
 */

/** Dependencies */
const db = require('./db')

/**
 * Sends limit message to specified chat
 * @param {Telegam:Bot} bot Bot that should send message
 * @param {Mongoose:Chat} chat Chat where to send message
 */
function sendLimit(bot, chat, text) {
  const strings = require('./strings')()

  // Check if limit is set
  const limitNumber = +text.substr(7).trim()
  if (!isNaN(limitNumber) && limitNumber > 0 && limitNumber < 100000) {
    chat.required_voters_count = limitNumber
    return chat
      .save()
      .then(() =>
        bot.sendMessage(
          chat.id,
          strings.translate(
            'limitSuccess',
            chat.language,
            chat.required_voters_count
          ),
          {
            parse_mode: 'Markdown',
          }
        )
      )
      .catch((err) => bot.sendMessage(chat.id, `❗️ _${error.message}_`))
  }

  const replyText = strings.translate(
    'limitMessage',
    chat.language,
    chat.required_voters_count
  )
  const options = {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: limitKeyboard() },
  }
  options.reply_markup = JSON.stringify(options.reply_markup)
  bot.sendMessage(chat.id, replyText, options)
}

/**
 * Called when inline button with limit is touched
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message of inline button that was touched
 */
function setLimit(bot, msg) {
  const options = msg.data.split('~')
  const limit = parseInt(options[1], 10)

  db.findChat(msg.message.chat)
    .then((chat) => {
      chat.required_voters_count = limit
      return chat
        .save()
        .then((dbchat) => updateMessagewithSuccess(bot, msg.message, dbchat))
    })
    .catch((err) => updateMessagewithError(bot, msg.message, err))
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

  bot.editMessageText(
    strings.translate(
      'limitSuccess',
      chat.language,
      chat.required_voters_count
    ),
    {
      parse_mode: 'Markdown',
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    }
  )
}

/**
 * Returns an inline keyboard with all available limit options
 * @return {Telegram:Inline} Inline keyboard with all available limits
 */
function limitKeyboard() {
  const list = [3, 5, 8, 10, 20, 30, 40, 50, 100]
  const keyboard = []
  let temp = []
  list.forEach((number) => {
    temp.push({
      text: `${number}`,
      callback_data: `lti~${number}`,
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
  sendLimit,
  setLimit,
}
