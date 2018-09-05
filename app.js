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
const newcomers = require('./helpers/filterNewcomers')

global.Promise = require('bluebird')

global.Promise.config({ cancellation: true })

/** Setup mongoose */
mongoose.Promise = require('bluebird')

mongoose.connect(
  config.database,
  {
    server: {
      socketOptions: {
        socketTimeoutMS: 0,
        connectTimeoutMS: 0,
      },
    },
  }
)
mongoose.connection.on('disconnected', () => {
  mongoose.connect(
    config.database,
    {
      server: {
        socketOptions: {
          connectTimeoutMS: 0,
        },
      },
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
  const isNewcomer =
    msg.new_chat_participant &&
    (!msg.new_chat_participant.username ||
      !msg.new_chat_participant.username.includes('banofbot'))
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
          } else if (msg.text.includes('lock')) {
            if (!isPrivateChat) {
              lock.toggle(bot, chat)
            }
          } else if (msg.text.includes('filterNewcomers')) {
            if (!isPrivateChat) {
              newcomers.toggle(bot, chat)
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
              } else if (msg.text.includes('lock')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                if (!isPrivateChat) {
                  lock.toggle(bot, chat)
                }
              } else if (msg.text.includes('filterNewcomers')) {
                if (!isAdmin) return deleteMessage(msg.chat.id, msg.message_id)
                if (!isPrivateChat) {
                  newcomers.toggle(bot, chat)
                }
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
  } else if (isNewcomer) {
    if (isPrivateChat) return
    db.findChat(msg.chat)
      .then(chat => {
        if (!chat.filter_newcomers) return
        const strings = require('./helpers/strings')()
        strings.setChat(chat)
        return bot
          .getChatMember(chat.id, msg.new_chat_participant.id)
          .then(async member => {
            const sent = await bot.sendMessage(
              chat.id,
              `[${getUsername(member)}](tg://user?id=${
                member.user.id
              }), ${strings.translate(
                'please, send any message to this chat within the next 60 seconds, otherwise you will be kicked. Thanks!'
              )}`,
              {
                parse_mode: 'Markdown',
              }
            )
            chat.newcomers.push(
              `${member.user.id}*~*~*!${Date.now()}*~*~*!${sent.message_id}`
            )
            console.log(
              `${member.user.id}*~*~*!${Date.now()}*~*~*!${sent.message_id}`
            )
            chat.save()
          })
      })
      .catch(console.error)
  }

  if (!isNewcomer && !isPrivateChat) {
    removeFromNewcomers(msg)
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
    deleteMessage(c, m)
  } catch (err) {
    // Do nothing
  }
}

setInterval(() => {
  db.findChatsWithNewcomers().then(chats => {
    const date = Date.now()
    chats.forEach(async chat => {
      // if (!(chat.newcomers instanceof Array)) {
      chat.newcomers = []
      chat = await chat.save()
      // }
      const newcomersToDelete = []
      console.log(`Checking newcomers: ${chat.newcomers}`)
      chat.newcomers.forEach(async newcomer => {
        const ops = newcomer.split('*~*~*!')
        const id = Number(ops[0])
        const dateCame = Number(ops[1])
        const msgId = Number(ops[2] || 0)
        console.log(id, dateCame, date, date - dateCame, msgId)
        if (date - dateCame > 60 * 1000) {
          try {
            console.log(`Banning ${chat.id} ${id}`)
            const banned = await bot.kickChatMember(chat.id, id)
            console.log(`Banned ${chat.id} ${id} ${banned}`)
            if (msgId) {
              try {
                await bot.deleteMessage(chat.id, msgId)
              } catch (err) {
                // console.error(err)
              }
            }
            console.log(`Removing newcomer ${newcomer} from list`)
            newcomersToDelete.push(newcomer)
          } catch (err) {
            console.error(err)
          }
        }
      })
      chat.newcomers = chat.newcomers.filter(
        v => !newcomersToDelete.includes(v)
      )
      chat.save()
    })
  })
}, 15 * 1000)

function removeFromNewcomers(msg) {
  const id = msg.from.id
  db.findChat(msg.chat)
    .then(async chat => {
      if (!chat.filter_newcomers) return

      try {
        let newcomer
        chat.newcomers.forEach(v => {
          if (v.includes(id)) {
            newcomer = v
          }
        })
        if (newcomer) {
          const ops = newcomer.split('*~*~*!')
          const msgId = Number(ops[2] || 0)
          if (msgId) {
            try {
              await bot.deleteMessage(chat.id, msgId)
            } catch (err) {
              // DO nothing
            }
          }
        }
      } catch (err) {
        console.error(err)
      }

      chat.newcomers = chat.newcomers.filter(v => !v.includes(id))
      chat.save()
    })
    .catch(console.error)
}
