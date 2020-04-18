function check(bot, chat, text) {
  const strings = require('./strings')()
  strings.setChat(chat)

  const votekickWordString = text.substr('votekickWord '.length).trim()
  if (!votekickWordString.length) {
    return
  }

  chat.votekickWord = votekickWordString
  chat
    .save()
    .then((newChat) => {
      bot.sendMessage(newChat.id, '👍')
    })
    .catch(() => {
      // Do nothing
    })
}

module.exports = {
  check,
}
