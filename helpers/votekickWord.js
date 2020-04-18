function check(bot, chat, text) {
  bot.sendMessage(chat.id, '👍')

  const votekickWordString = text.substr('votekickWord '.length).trim()
  bot.sendMessage(chat.id, `👍 ${votekickWordString}`)
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
