/**
 * Main app logic
 *
 * @module app
 * @license MIT
 */

/** Dependencies */
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '/.env'),
})
const bot = require('./helpers/bot')
const mongoose = require('mongoose')
const config = require('./config')
const db = require('./helpers/db')
const language = require('./helpers/language')
const help = require('./helpers/help')
const lock = require('./helpers/lock')
const requests = require('./helpers/requests')
const admins = require('./helpers/admins')
const limit = require('./helpers/limit')
const time = require('./helpers/time')

global.Promise = require('bluebird')

global.Promise.config({ cancellation: true })

/** Setup mongoose */
mongoose.Promise = require('bluebird')

mongoose.connect(
  config.database,
  {
    useMongoClient: true,
    socketTimeoutMS: 0,
    connectTimeoutMS: 0,
  }
)
mongoose.connection.on('disconnected', () => {
  mongoose.connect(
    config.database,
    {
      useMongoClient: true,
      socketTimeoutMS: 0,
      connectTimeoutMS: 0,
    }
  )
})

let timeoutOver = false
setTimeout(() => {
  timeoutOver = true
}, 5000)

bot.on('message', msg => {
  if (!timeoutOver) {
    return
  }
  handle(msg)
})

/**
 * Used to handle incoming message
 * @param {Telegram:Message} msg Message received
 */
function handle(msg) {
  if (!msg) {
    return
  }
  if (msg.text && msg.text.includes('@') && !msg.text.includes('banofbot')) {
    return
  }
  const isPrivateChat =
    msg.chat.type === 'private' || msg.chat.type === 'channel'
  const isCommand =
    msg.text &&
    msg.entities &&
    msg.entities[0] &&
    msg.entities[0].type === 'bot_command'
  const isEntry =
    (msg.new_chat_participant &&
      msg.new_chat_participant.username &&
      msg.new_chat_participant.username === 'banofbot') ||
    msg.group_chat_created
  let isReply =
    msg.reply_to_message &&
    msg.text &&
    (msg.text.includes('banofbot') ||
      msg.text.includes('@ban') ||
      msg.text.includes('voteban') ||
      msg.text.includes('Voteban') ||
      msg.text.includes('/spam'))
  if (
    msg.reply_to_message &&
    msg.sticker &&
    msg.sticker.file_id === 'CAADAQADyQIAAgdEiQTkPSm3CRyNIQI'
  ) {
    isReply = true
  }
  if (isCommand) {
    db.findChat(msg.chat)
      .then(chat => {
        if (isPrivateChat || !chat.admin_locked) {
          if (msg.text.includes('start')) {
            language.sendLanguage(bot, chat, false)
          } else if (msg.text.includes('help')) {
            help.sendHelp(bot, chat)
          } else if (msg.text.includes('language')) {
            language.sendLanguage(bot, chat, true)
          } else if (msg.text.includes('limit')) {
            if (!isPrivateChat) {
              limit.sendLimit(bot, chat)
            }
          } else if (msg.text.includes('time')) {
            if (!isPrivateChat) {
              time.sendTime(bot, chat)
            }
          } else if (msg.text.includes('lock')) {
            if (!isPrivateChat) {
              lock.toggle(bot, chat)
            }
          } else if (msg.text.includes('filterNewcomers')) {
            if (!isPrivateChat) {
              bot.sendMessage(chat.id, 'Please, use @shieldy_bot instead.')
            }
          }
        } else {
          admins
            .isAdmin(bot, chat.id, msg.from.id)
            .then(isAdmin => {
              if (msg.text.includes('start')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                language.sendLanguage(bot, chat, false)
              } else if (msg.text.includes('help')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                help.sendHelp(bot, chat)
              } else if (msg.text.includes('language')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                language.sendLanguage(bot, chat, true)
              } else if (msg.text.includes('limit')) {
                if (!isPrivateChat) {
                  if (!isAdmin)
                    return deleteMessage(msg.chat.id, msg.message_id)
                  limit.sendLimit(bot, chat)
                }
              } else if (msg.text.includes('time')) {
                if (!isPrivateChat) {
                  if (!isAdmin)
                    return deleteMessage(msg.chat.id, msg.message_id)
                  time.sendTime(bot, chat)
                }
              } else if (msg.text.includes('lock')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                if (!isPrivateChat) {
                  lock.toggle(bot, chat)
                }
              } else if (msg.text.includes('filterNewcomers')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                bot.sendMessage(chat.id, 'Please, use @shieldy_bot instead.')
              }
            })
            .catch(/** todo: handle error */)
        }
      })
      .catch(/** todo: handle error */)
  } else if (isEntry) {
    db.findChat(msg.chat)
      .then(chat => {
        language.sendLanguage(bot, chat, false)
      })
      .catch(/** todo: handle error */)
  } else if (isReply) {
    try {
      requests.startRequest(bot, msg)
    } catch (err) {
      // Do nothing
    }
  }
}

bot.on('callback_query', msg => {
  const options = msg.data.split('~')
  const inline = options[0]
  if (inline === 'li') {
    language.setLanguage(bot, msg)
  } else if (inline === 'vi') {
    try {
      requests.voteQuery(bot, msg)
    } catch (err) {
      // Do nothing
    }
  } else if (inline === 'lti') {
    limit.setLimit(bot, msg)
  } else if (inline === 'tlti') {
    time.setTime(bot, msg)
  }
})

console.info('Bot is up and running')

function getUsername(member) {
  return `${
    member.user.username
      ? `@${member.user.username}`
      : `${member.user.first_name}${
          member.user.last_name ? ` ${member.user.last_name}` : ''
        }`
  }`
}

function deleteMessage(c, m) {
  try {
    bot.deleteMessage(c, m)
  } catch (err) {
    // Do nothing
  }
}
