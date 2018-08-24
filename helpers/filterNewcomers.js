/**
 * Used to handle /filterNewcomers command
 *
 * @module filterNewcomers
 * @license MIT
 */

/**
 * Function to toggle adminLocked of the chat
 * @param {Telegram:Bot} bot Bot that should send success message
 * @param {Mongoose:Chat} chat Chat that should get adminLocked changed
 */
function toggle(bot, chat) {
  const strings = require('./strings')();
  strings.setChat(chat);

  chat.filter_newcomers = !chat.filter_newcomers;
  chat.save()
    .then((newChat) => {
      const text = newChat.filter_newcomers ?
        '💀 Great! *Banofbot* will filter newcomers.' :
        '💀 Great! *Banofbot* will not filter newcomers.';
      bot.sendMessage(newChat.id, strings.translate(text), {
        parse_mode: 'Markdown',
      });
    })
    .catch(/** todo: handle error */);
}

/** Exports */
module.exports = {
  toggle,
};
