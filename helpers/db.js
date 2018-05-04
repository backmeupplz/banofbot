/**
 * @module db
 * @license MIT
 */

/** Get schemas **/
const {
  Chat,
  User,
  Request,
} = require('../models');

/**
 * Function to get chat, creates if none exists yet
 * @param {Telegram:Chat} chat Chat object that was passed from Telegram
 * @return {Promise(Mongoose:Chat)} Chat that was created by mongoose
 */
function findChat(chat) {
  return Chat.findOne({ id: chat.id })
    .then((dbchat) => {
      if (dbchat) {
        return dbchat;
      }
      return new Chat(chat).save();
    });
}

/**
 * Function to get user, creates if none exists yet
 * @param {Telegram:User} user User object that was passed from Telegram
 * @return {Promise(Mongoose:User)} User that was created by mongoose
 */
function findUser(user) {
  return User.findOne({ id: user.id })
    .then((dbuser) => {
      if (dbuser) {
        return dbuser;
      }
      return new User(user).save();
    });
}

/**
 * Function to get request from db
 * @param {Mongoose:ObjectId} id Id of the request
 * @return {Promise(Mongoose:Request)} Found request
 */
function findRequest(id) {
  return Request.findById(id);
}

/**
 * Function to create a request
 * @param {Mongoose:Request} request Request object without _id
 * @return {Promise(Mongoose:Request)} Created request
 */
function createRequest(request) {
  const req = new Request(request);
  return req.save();
}

/** Exports */
module.exports = {
  findChat,
  findUser,
  findRequest,
  createRequest,
};
