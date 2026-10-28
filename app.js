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
const mongoose = require('mongoose')
const bot = require('./helpers/bot')
const config = require('./config')
const db = require('./helpers/db')
const language = require('./helpers/language')
const help = require('./helpers/help')
const lock = require('./helpers/lock')
const requests = require('./helpers/requests')
const admins = require('./helpers/admins')
const limit = require('./helpers/limit')
const time = require('./helpers/time')
const votekickWord = require('./helpers/votekickWord')
const { pollWithHandover } = require('./helpers/handover')
const promo = require('./helpers/promoHook')
const { startPayload } = require('./helpers/promo')

global.Promise = require('bluebird')

global.Promise.config({ cancellation: true })

/** Setup mongoose */
mongoose.Promise = require('bluebird')

mongoose.connect(config.database, {
  socketTimeoutMS: 0,
  connectTimeoutMS: 0,
})
mongoose.connection.on('disconnected', () => {
  mongoose.connect(config.database, {
    socketTimeoutMS: 0,
    connectTimeoutMS: 0,
  })
})
// Mongoose 6 defaults to dropping unknown fields from query filters; keep v5's behavior
mongoose.set('strictQuery', false)

let timeoutOver = false
setTimeout(() => {
  timeoutOver = true
}, 5000)

bot.on('message', (msg) => {
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
  db.findChat(msg.chat)
    .then((chat) => {
      // Prime Radiant experiments (promo.js): another bot's campaign link
      // brought this user, or someone it brought uses Banofbot
      if (
        msg.chat.type === 'private' &&
        isCommand &&
        msg.text.includes('start')
      )
        promo.arrived(
          msg.from.id,
          startPayload(msg.text),
          Date.now() - new Date(chat.createdAt).getTime() < 600000
        )
      let isReply =
        msg.reply_to_message &&
        msg.text &&
        (msg.text.includes('banofbot') ||
          msg.text.includes('@ban') ||
          msg.text.includes('voteban') ||
          msg.text.includes('Voteban') ||
          msg.text.includes('/spam') ||
          (chat.votekickWord &&
            chat.votekickWord.split(', ').reduce((p, c) => {
              return (
                p ||
                new RegExp(
                  `(?<=[\\s,.:;"']|^)${c}(?=[\\s,.:;"']|$)`,
                  'gum'
                ).test(msg.text)
              )
            }, false)))
      if (
        msg.reply_to_message &&
        msg.sticker &&
        msg.sticker.file_id === 'CAADAQADyQIAAgdEiQTkPSm3CRyNIQI'
      ) {
        isReply = true
      }
      if (isCommand) {
        if (isPrivateChat || !chat.admin_locked) {
          if (msg.text.includes('start')) {
            language.sendLanguage(bot, chat, false)
          } else if (msg.text.includes('help')) {
            help.sendHelp(bot, chat)
          } else if (msg.text.includes('language')) {
            language.sendLanguage(bot, chat, true)
          } else if (msg.text.includes('limit')) {
            if (!isPrivateChat) {
              limit.sendLimit(bot, chat, msg.text)
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
          } else if (msg.text.includes('/banme')) {
            if (!isPrivateChat) {
              bot.kickChatMember(msg.chat.id, msg.from.id, {
                until_date: Math.floor(Date.now() / 1000) + 60,
              })
            }
          } else if (msg.text.includes('/votekickWord')) {
            if (!isPrivateChat) {
              votekickWord.check(bot, chat, msg.text)
            }
          }
        } else {
          admins
            .isAdmin(bot, chat.id, msg.from.id)
            .then((isAdmin) => {
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
                  limit.sendLimit(bot, chat, msg.text)
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
              } else if (msg.text.includes('/banme')) {
                if (!isPrivateChat) {
                  bot.kickChatMember(msg.chat.id, msg.from.id, {
                    until_date: Math.floor(Date.now() / 1000) + 60,
                  })
                }
              } else if (msg.text.includes('/votekickWord')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                if (!isPrivateChat) {
                  votekickWord.check(bot, chat, msg.text)
                }
              }
            })
            .catch(/** todo: handle error */)
        }
      } else if (isEntry) {
        if (msg.from) promo.used(msg.from.id)
        language.sendLanguage(bot, chat, false)
      } else if (isReply) {
        promo.used(msg.from.id)
        try {
          requests.startRequest(bot, msg)
        } catch (err) {
          console.error(err)
          // Do nothing
        }
      }
    })
    .catch(/** todo: handle error */)
}

bot.on('callback_query', (msg) => {
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

// The newest update fetched, for handing polling over on deploys
let lastUpdate = 0
const processUpdate = bot.processUpdate.bind(bot)
bot.processUpdate = (update) => {
  lastUpdate = Math.max(lastUpdate, update.update_id)
  const member = update.my_chat_member
  if (
    member &&
    member.chat.type === 'private' &&
    member.new_chat_member.status === 'kicked'
  )
    promo.blocked(member.from.id)
  processUpdate(update)
}
// A zero-timeout getUpdates confirms every update fetched, so the next poller does not get them
// again. Retried: a reused keep-alive socket can be reset
const confirmUpdates = async (attempt = 1) => {
  try {
    await bot.getUpdates({ offset: lastUpdate + 1, limit: 1, timeout: 0 })
  } catch (err) {
    if (attempt === 3) throw err
    await new Promise((resolve) => setTimeout(resolve, 300))
    await confirmUpdates(attempt + 1)
  }
}

if (!config.should_use_webhooks) {
  pollWithHandover(
    () => bot.startPolling(),
    async () => {
      // Abort the pending long poll (the library enables Bluebird cancellation). Without the
      // abort, the confirming getUpdates turns it into a 409, which the library answers with a
      // setWebHook and another long poll. The cancelled poll's finally() schedules the next poll
      // unless _abort is set, which stopPolling({ cancel }) does not do
      bot._polling._abort = true
      await bot.stopPolling({ cancel: true })
      await confirmUpdates()
    },
    // The handlers are fire-and-forget promise chains: give them a moment to
    // finish, then send the promo events still queued
    () =>
      new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
        promo.stop()
      )
  )
}
promo.start()

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
