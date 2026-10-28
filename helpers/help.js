/**
 * Used to send help message
 *
 * @module help
 * @license MIT
 */

const promo = require('./promoHook')
const { keyboard, markdown } = require('./promo')

/**
 * Sends help message to specified chat. In private chats it may carry a
 * promo line or button from a Prime Radiant experiment (promo.js), never in
 * groups.
 * @param {Telegam:Bot} bot Bot that should send help
 * @param {Mongoose:Chat} chat Chat where to send help
 */
async function sendHelp(bot, chat) {
  const strings = require('./strings')()

  const privateText =
    chat.type === 'private' || chat.type === 'channel'
      ? 'helpPrivate'
      : 'helpPublic'

  const text = strings.translate(privateText, chat.language)
  const options = {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  }
  const d =
    chat.type === 'private'
      ? await promo.decide(Number(chat.id), 'private', chat.language)
      : null
  const p = d ? d.promo : undefined
  try {
    const markup = keyboard(p)
    await bot.sendMessage(
      chat.id,
      text + markdown(p),
      markup ? { ...options, reply_markup: JSON.stringify(markup) } : options
    )
  } catch (err) {
    if (!p) return console.error('help', err.message)
    // a promo must never cost the help message: send it plain
    console.error('help with promo', err.message)
    return bot.sendMessage(chat.id, text, options).catch(() => {})
  }
  await promo.record(d)
}

/** Exports */
module.exports = {
  sendHelp,
}
