// Dependencies
const db = require('./db')
const help = require('./help')

/**
 * Sends language message to specified chat
 * @param {Telegam:Bot} bot Bot that should send message
 * @param {Mongoose:Chat} chat Chat where to send message
 * @param {Boolean} isCommand Whether action was triggered by /language or start of the bot
 */
function sendLanguage(bot, chat, isCommand) {
  const strings = require('./strings')()

  const text = strings.translate('selectLanguage', chat.language)
  const options = {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: languageKeyboard(isCommand) },
  }
  options.reply_markup = JSON.stringify(options.reply_markup)
  bot.sendMessage(chat.id, text, options)
}

/**
 * Called when inline button with language is touched
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message of inline button that was touched
 */
function setLanguage(bot, msg) {
  const options = msg.data.split('~')
  const isCommand = parseInt(options[1], 10) === 1
  const code = options[2]

  db.findChat(msg.message.chat)
    .then((chat) => {
      chat.language = code
      return chat.save().then((dbchat) => {
        updateMessagewithSuccess(bot, msg.message, dbchat)
        if (!isCommand) {
          help.sendHelp(bot, dbchat)
        }
      })
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
 * @param {Mongoose:Chat} chat Chat that had language updated
 */
function updateMessagewithSuccess(bot, msg, chat) {
  const strings = require('./strings')()

  bot.editMessageText(
    strings.translate('languageSelectedBanofbot', chat.language),
    {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      parse_mode: 'Markdown',
    }
  )
}

/**
 * Returns an inline keyboard with all available languages
 * @param {Boolean} isCommand Whether action was triggered by /language or start of the bot
 * @return {Telegram:Inline} Inline keyboard with all available languages
 */
function languageKeyboard(isCommand) {
  const list = languages()
  const keyboard = Object.keys(list).map((key) => {
    const code = list[key]
    return [
      {
        text: key,
        callback_data: `li~${isCommand ? 1 : 0}~${code}`,
      },
    ]
  })
  return keyboard
}

/**
 * Returns a list of supported languages
 * @return {[String]]} List of the supported languages
 */
function languages() {
  return {
    Russian: 'ru',
    English: 'en',
    Ukrainian: 'uk',
    Uzbek: 'uz',
    Kazakh: 'kz',
    Português: 'pt',
    Turkish: 'tr',
  }
}

// Exports
module.exports = {
  sendLanguage,
  setLanguage,
}
