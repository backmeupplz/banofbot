/**
 * /promos [on|off] and /privacy: group admins turn Prime Radiant's group
 * promos (a button for another bot by the same maker under a vote's result,
 * promo.js) on or off, and anyone can read what they do
 *
 * @module promos
 * @license MIT
 */

const admins = require('./admins')
const promo = require('./promoHook')
const { chatKind } = require('./promo')

/**
 * Whether the sender is the group's admin: an anonymous admin (the group
 * posting as itself) or an admin by user id
 * @param {Telegram:Bot} bot Bot that asks
 * @param {Telegram:Message} msg Message received
 * @return {Promise(Boolean)} Whether the sender is an admin
 */
async function isGroupAdmin(bot, msg) {
  if (msg.sender_chat && msg.sender_chat.id === msg.chat.id) return true
  if (!msg.from || msg.sender_chat) return false
  try {
    return await admins.isAdmin(bot, msg.chat.id, msg.from.id)
  } catch (err) {
    return false
  }
}

/**
 * Logs a failed /promos or /privacy answer (429, no right to post, a closed
 * topic): a native rejection nobody catches would stop the bot
 * @param {String} command Command that failed
 * @param {Error} err What went wrong
 */
function logFailure(command, err) {
  console.error(`/${command} failed:`, (err && err.message) || err)
}

/**
 * /promos: shows whether group promos are on here; /promos on|off changes it
 * (group admins only). Never rejects: a failed answer is logged
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message with the command
 * @param {Mongoose:Chat} chat Chat of the message
 */
async function sendPromos(bot, msg, chat) {
  try {
    await answerPromos(bot, msg, chat)
  } catch (err) {
    logFailure('promos', err)
  }
}

/**
 * The /promos answer itself (sendPromos)
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message with the command
 * @param {Mongoose:Chat} chat Chat of the message
 */
async function answerPromos(bot, msg, chat) {
  const strings = require('./strings')()
  const reply = (key) =>
    bot.sendMessage(msg.chat.id, strings.translate(key, chat.language))
  if (chatKind(msg.chat.type) !== 'group') return reply('promosGroupOnly')
  const arg = (msg.text || '').trim().split(/\s+/)[1]
  const want = (arg || '').toLowerCase()
  if (want !== 'on' && want !== 'off') {
    const on = await promo.groupOn(msg.chat.id)
    return reply(
      on === undefined
        ? 'promosError'
        : on
        ? 'promosStatusOn'
        : 'promosStatusOff'
    )
  }
  if (!(await isGroupAdmin(bot, msg))) return reply('promosAdminsOnly')
  return reply(
    (await promo.setGroup(msg.chat.id, want === 'on'))
      ? want === 'on'
        ? 'promosOn'
        : 'promosOff'
      : 'promosError'
  )
}

/**
 * /privacy: what group promos do, then the shared privacy policy. Never
 * rejects: a failed answer is logged
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Mongoose:Chat} chat Chat to answer in
 */
async function sendPrivacy(bot, chat) {
  const strings = require('./strings')()
  try {
    await bot.sendMessage(
      chat.id,
      `${strings.translate(
        'promosPrivacy',
        chat.language
      )}\n\nhttps://privacy.borodutch.com`,
      { disable_web_page_preview: true }
    )
  } catch (err) {
    logFailure('privacy', err)
  }
}

module.exports = { isGroupAdmin, sendPromos, sendPrivacy }
