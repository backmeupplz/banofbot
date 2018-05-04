/**
 * Used to get chat admins
 *
 * @module admins
 * @license MIT
 */

/**
 * Function to get chat admin ids
 * @param {Telegram:Bot} bot Bot that should perform the action
 * @param {Telegram:ChatId} chatId Id of the chat
 * @return {Promise([Telegram:UserId])} Ids of admins
 */
function getAdminIds(bot, chatId) {
  return new Promise((resolve, reject) => {
    bot.getChatAdministrators(chatId)
      .then((data) => {
        resolve(data.map(v => v.user.id));
      })
      .catch(err => reject(err));
  });
}

/**
 * Function to check if user id is admin
 * @param {Telegram:Bot} bot Bot that should perform the action
 * @param {Telegram:ChatId} chatId Id of the chat to get admins
 * @param {Telegram:UserId} userId Id of the user to check if admin
 * @return {Promise(Boolean)} Promise that's called on completion
 */
function isAdmin(bot, chatId, userId) {
  return new Promise((resolve, reject) => {
    getAdminIds(bot, chatId)
      .then((ids) => {
        resolve(ids.includes(userId));
      })
      .catch(err => reject(err));
  });
}

/**
 * Function to check if the bot is admin in the cat
 * @param {Telegram:Bot} bot Bot that needs to check that
 * @param {Telegram:ChatId} chatId Id of the chat that's checked
 * @return {Promise(Boolean)} Promise with true if bot is admin at the chat
 */
function isBotAdmin(bot, chatId) {
  return bot.getMe()
    .then(me =>
      getAdminIds(bot, chatId)
        .then(admins => admins.includes(me.id)));
}

/** Exports */
module.exports = {
  getAdminIds,
  isAdmin,
  isBotAdmin,
};
