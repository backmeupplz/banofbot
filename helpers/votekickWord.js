function check(bot, chat, text) {
  const votekickWordString = text.substr('votekickWord '.length).trim()
  if (!votekickWordString.length) {
    chat.votekickWord = undefined
    chat
      .save()
      .then((newChat) => {
        bot.sendMessage(newChat.id, `👍`)
      })
      .catch(() => {
        // Do nothing
      })
    return
  }

  chat.votekickWord = votekickWordString
  chat
    .save()
    .then((newChat) => {
      bot.sendMessage(newChat.id, `👍 ${votekickWordString}`)
    })
    .catch(() => {
      // Do nothing
    })
}

module.exports = {
  check,
}
