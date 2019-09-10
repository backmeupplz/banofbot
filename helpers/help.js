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
      ? "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don't forget to set it as an admin, otherwise it wouldn't work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nLike this bot? Leave a review [here](https://telegram.me/storebot?start=banofbot).\n\nGot questions? Check with our support channel — @borodutch\\_support 🦄"
      : "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user (you can also use \"/limit 100\") ✌️\n/time — Allows you to select the minimum time between bans\n\nDon't forget to set @banofbot as an admin, otherwise it wouldn't work.\n\nLike this bot? Leave a review [here](https://telegram.me/storebot?start=banofbot).\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄"

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
