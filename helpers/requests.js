/**
 * Requests logic
 *
 * @module requests
 * @license MIT
 */

/** Dependencies */
const db = require('./db')
const _ = require('lodash')
const admins = require('./admins')

/**
 * Starts ban request
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message to start ban request
 */
async function startRequest(bot, msg) {
  const chat = await db.findChat(msg.chat)
  const starter = await db.findUser(msg.from)
  const candidate = await db.findUser(msg.reply_to_message.from)

  const isBotAdmin = await admins.isBotAdmin(bot, chat.id)
  if (!isBotAdmin) {
    sendAdminError(bot, chat)
    return
  }

  const isCandidateAdmin = await admins.isAdmin(bot, chat.id, candidate.id)
  if (isCandidateAdmin) {
    return
  }

  if (candidate.username === 'banofbot') {
    return
  }

  const mockRequest = {
    reply_chat_id: msg.reply_to_message.chat.id,
    reply_message_id: msg.reply_to_message.message_id,
    chat,
    candidate,
    starter,
    voters_ban: [starter],
  }
  const request = await db.createRequest(mockRequest)

  const strings = require('./strings')()
  strings.setChat(request.chat)

  const starterName = await request.starter.realNameWithMarkdown(bot, chat.id)
  const candidateName = await request.candidate.realNameWithMarkdown(
    bot,
    chat.id
  )

  const text = strings.translate(
    '$[1] would like to kick $[2]. Do you agree?',
    starterName,
    candidateName
  )
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: kickKeyboard(
        1,
        0,
        request._id,
        strings,
        request.chat.required_voters_count
      ),
    },
  }
  options.reply_markup = JSON.stringify(options.reply_markup)
  const data = await bot.sendMessage(request.chat.id, text, options)

  request.inline_chat_id = data.chat.id
  request.inline_message_id = data.message_id
  await request.save()
}

/**
 * Function to be called when somebody votes for ban
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Teleram:Message} msg Message that triggered inline
 */
async function voteQuery(bot, msg) {
  const options = msg.data.split('~')
  const requestId = options[1]
  const against = parseInt(options[2], 10) === 1

  let request = await db
    .findRequest(requestId)
    .populate('chat candidate starter voters_ban voters_noban')
  const voter = await db.findUser(msg.from)

  const strings = require('./strings')()
  strings.setChat(request.chat)

  if (against) {
    const alreadyThere = _.find(request.voters_noban, arrayVoter =>
      arrayVoter._id.equals(voter._id)
    )
    if (alreadyThere) {
      return await bot.answerCallbackQuery(msg.id, {
        text: strings.translate('You have already voted for 👼'),
        show_alert: true,
      })
    }
    request.voters_ban = request.voters_ban.filter(
      arrayVoter => !arrayVoter._id.equals(voter._id)
    )
    request.voters_noban.push(voter)
  } else {
    const alreadyThere = _.find(request.voters_ban, arrayVoter =>
      arrayVoter._id.equals(voter._id)
    )
    if (alreadyThere) {
      return await bot.answerCallbackQuery(msg.id, {
        text: strings.translate('You have already voted for 🔫'),
        show_alert: true,
      })
    }
    request.voters_noban = request.voters_noban.filter(
      arrayVoter => !arrayVoter._id.equals(voter._id)
    )
    request.voters_ban.push(voter)
  }
  request = await request.save()
  return await updateMessage(bot, request)
}

/**
 * Function to update existing request message
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Mongoose:Request} request Request whos message to be updated
 */
async function updateMessage(bot, request) {
  const finished =
    request.voters_noban.length >= request.chat.required_voters_count ||
    request.voters_ban.length >= request.chat.required_voters_count
  if (finished) {
    return await finishRequest(bot, request)
  }
  const strings = require('./strings')()
  strings.setChat(request.chat)

  const starterName = await request.starter.realNameWithMarkdown(
    bot,
    request.chat.id
  )
  const candidateName = await request.candidate.realNameWithMarkdown(
    bot,
    request.chat.id
  )

  const text = strings.translate(
    '$[1] would like to kick $[2]. Do you agree?',
    starterName,
    candidateName
  )
  const options = {
    parse_mode: 'Markdown',
    chat_id: request.inline_chat_id,
    message_id: request.inline_message_id,
    reply_markup: {
      inline_keyboard: kickKeyboard(
        request.voters_ban.length,
        request.voters_noban.length,
        request._id,
        strings,
        request.chat.required_voters_count
      ),
    },
  }
  options.reply_markup = JSON.stringify(options.reply_markup)

  return await bot.editMessageText(text, options)
}

/**
 * Finalizes request when there are enough people
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Mongoose:Request} request Request to be finalized
 */
async function finishRequest(bot, request) {
  const strings = require('./strings')()
  strings.setChat(request.chat)

  const saved =
    request.voters_noban.length >= request.chat.required_voters_count
  let voters
  if (saved) {
    const votersArray = []
    for (const voter of request.voters_noban) {
      const realName = await voter.realNameWithMarkdown(bot, request.chat.id)
      votersArray.push(realName)
    }
    voters = votersArray.join(', ')
  } else {
    const votersArray = []
    for (const voter of request.voters_ban) {
      const realName = await voter.realNameWithMarkdown(bot, request.chat.id)
      votersArray.push(realName)
    }
    voters = votersArray.join(', ')
  }

  const candidateName = await request.candidate.realNameWithMarkdown(
    bot,
    request.chat.id
  )

  const text = saved
    ? strings.translate(
        '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]',
        candidateName,
        voters
      )
    : strings.translate(
        '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]',
        candidateName,
        voters
      )

  if (!saved) {
    bot.kickChatMember(request.chat.id, request.candidate.id)
    if (request.reply_chat_id && request.reply_message_id) {
      bot.deleteMessage(request.reply_chat_id, request.reply_message_id)
    }
  }

  const options = {
    parse_mode: 'Markdown',
    chat_id: request.inline_chat_id,
    message_id: request.inline_message_id,
  }
  return bot.editMessageText(text, options)
}

/**
 * Keyboard to kick user
 * @param {Number} forkick Number of users to kick
 * @param {Number} against Number of users against kick
 * @param {Mongoose:ObjectId} requestId Id of the request
 * @param {strings.js} strings Localization object
 * @param {Number} voteCount Minimal number of votes to kick or save
 * @return {Telegram:InlineKeyboard} Keyboard to kick or not to kick user
 */
function kickKeyboard(forkick, against, requestId, strings, voteCount) {
  return [
    [
      {
        text: strings.translate('🔫 Kick ($[1]/$[2])', forkick, voteCount),
        callback_data: `vi~${String(requestId)}~0`,
      },
    ],
    [
      {
        text: strings.translate('👼 Save ($[1]/$[2])', against, voteCount),
        callback_data: `vi~${String(requestId)}~1`,
      },
    ],
  ]
}

/**
 * Function to send error that bot is not an admin to the chat
 * @param {Telegram:Bot} bot Bot that should send message
 * @param {Mongoose:Chat} chat Chat that should receive the message
 */
function sendAdminError(bot, chat) {
  const strings = require('./strings')()
  strings.setChat(chat)

  return bot.sendMessage(
    chat.id,
    strings.translate(
      '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!'
    )
  )
}

/** Exports */
module.exports = {
  startRequest,
  voteQuery,
}
