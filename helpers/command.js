/** Commands Banofbot answers to */
const commands = [
  'start',
  'help',
  'language',
  'limit',
  'time',
  'lock',
  'filterNewcomers',
  'banme',
  'votekickWord',
  'promos',
  'privacy',
]

/**
 * Banofbot's command the message starts with, or undefined. Other commands ("/Execute",
 * "/spam", a command mid-text) are not ours: matching words anywhere in the text made the
 * bot delete ordinary messages in admin-locked chats. A command addressed to another
 * bot ("/promos@randymbot") isn't ours either
 * @param {Telegram:Message} msg Message received
 * @return {String|undefined} Command name without the slash and @banofbot
 */
function commandOf(msg) {
  const entity = msg.entities && msg.entities[0]
  if (!msg.text || !entity || entity.type !== 'bot_command' || entity.offset)
    return undefined
  const [command, to] = msg.text.slice(1, entity.length).split('@')
  // "/promos@randymbot off" is for another bot in the same group
  if (to && to.toLowerCase() !== 'banofbot') return undefined
  return commands.includes(command) ? command : undefined
}

module.exports = { commandOf }
