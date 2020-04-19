/**
 * Used to send help message
 *
 * @module help
 * @license MIT
 */

/**
 * Sends help message to specified chat
 * @param {Telegam:Bot} bot Bot that should send help
 * @param {Mongoose:Chat} chat Chat where to send help
 */
function sendHelp(bot, chat) {
  const strings = require('./strings')()
  strings.setChat(chat)

  const privateText =
    chat.type === 'private' || chat.type === 'channel'
      ? "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don't forget to set it as an admin, otherwise it wouldn't work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nGot questions? Check with our support channel — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well."
      : "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user (you can also use \"/limit 100\") ✌️\n/time — Allows you to select the minimum time between bans\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nDon't forget to set @banofbot as an admin, otherwise it wouldn't work.\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well."

  const text = strings.translate(privateText)
  bot.sendMessage(chat.id, text, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  })
}

/** Exports */
module.exports = {
  sendHelp,
}
