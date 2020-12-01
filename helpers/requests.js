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
const { Lock } = require('semaphore-async-await')
const { isRuChat } = require('./isRuChat')

const promoAdditions = {
  ru:
    'При поддержке <a href="https://todorant.com/?ref=banofbot">Тудуранта</a>',
  en: 'Powered by <a href="https://todorant.com/?ref=banofbot">Todorant</a>',
}

/**
 * Starts ban request
 * @param {Telegram:Bot} bot Bot that should respond
 * @param {Telegram:Message} msg Message to start ban request
 */
async function startRequest(bot, msg) {
  const chat = await db.findChat(msg.chat)
  const starter = await db.findUser(msg.from)
  const candidate = await db.findUser(msg.reply_to_message.from)

  // Check if it can create new ban request
  const now = new Date().getTime()
  const lastBan = chat.last_ban.getTime()
  const requiredMilliseconds = chat.seconds_between_bans * 1000
  if (now - lastBan < requiredMilliseconds) {
    return sendBanLimitError(bot, chat)
  }

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

  const starterName = await request.starter.realNameWithHTML(bot, chat.id)
  const candidateName = await request.candidate.realNameWithHTML(bot, chat.id)

  const promoAddition = promoAdditions[isRuChat(chat) ? 'ru' : 'en']

  const text = `${strings.translate(
    'kickRequest',
    request.chat.language,
    starterName,
    candidateName
  )}\n${promoAddition}`
  const options = {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: kickKeyboard(
        1,
        0,
        request._id,
        strings,
        request.chat.required_voters_count,
        request.chat.language
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
  const lock = new Lock(1)
  await lock.acquire()
  try {
    const options = msg.data.split('~')
    const requestId = options[1]
    const against = parseInt(options[2], 10) === 1

    const member = await bot.getChatMember(msg.message.chat.id, msg.from.id)

    if (!['creator', 'administrator', 'member'].includes(member.status)) {
      return bot.answerCallbackQuery(msg.id)
    }

    let request = await db
      .findRequest(requestId)
      .populate('chat candidate starter voters_ban voters_noban')
    const voter = await db.findUser(msg.from)

    const strings = require('./strings')()

    if (against) {
      const alreadyThere = _.find(request.voters_noban, (arrayVoter) =>
        arrayVoter._id.equals(voter._id)
      )
      if (alreadyThere) {
        await bot.answerCallbackQuery(msg.id, {
          text: strings.translate('voteSave', request.chat.language),
          show_alert: true,
        })
        return
      } else {
        await bot.answerCallbackQuery(msg.id)
      }
      request.voters_ban = request.voters_ban.filter(
        (arrayVoter) => !arrayVoter._id.equals(voter._id)
      )
      request.voters_noban.push(voter)
    } else {
      const alreadyThere = _.find(request.voters_ban, (arrayVoter) =>
        arrayVoter._id.equals(voter._id)
      )
      if (alreadyThere) {
        await bot.answerCallbackQuery(msg.id, {
          text: strings.translate('voteKick', request.chat.language),
          show_alert: true,
        })
        return
      } else {
        await bot.answerCallbackQuery(msg.id)
      }
      request.voters_noban = request.voters_noban.filter(
        (arrayVoter) => !arrayVoter._id.equals(voter._id)
      )
      request.voters_ban.push(voter)
    }
    request = await request.save()
    await updateMessage(bot, request)
  } catch (err) {
    console.error(err)
    // Do nothing
  } finally {
    lock.release()
  }
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

  const starterName = await request.starter.realNameWithHTML(
    bot,
    request.chat.id
  )
  const candidateName = await request.candidate.realNameWithHTML(
    bot,
    request.chat.id
  )

  const promoAddition = promoAdditions[isRuChat(request.chat) ? 'ru' : 'en']

  const text = `${strings.translate(
    'kickRequest',
    request.chat.language,
    starterName,
    candidateName
  )}\n${promoAddition}`
  const options = {
    parse_mode: 'HTML',
    chat_id: request.inline_chat_id,
    message_id: request.inline_message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: kickKeyboard(
        request.voters_ban.length,
        request.voters_noban.length,
        request._id,
        strings,
        request.chat.required_voters_count,
        request.chat.language
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

  const saved =
    request.voters_noban.length >= request.chat.required_voters_count
  let voters
  if (saved) {
    const votersArray = []
    for (const voter of request.voters_noban) {
      const realName = await voter.realNameWithHTML(bot, request.chat.id)
      votersArray.push(realName)
    }
    voters = votersArray.join(', ')
  } else {
    const votersArray = []
    for (const voter of request.voters_ban) {
      const realName = await voter.realNameWithHTML(bot, request.chat.id)
      votersArray.push(realName)
    }
    voters = votersArray.join(', ')
  }

  const candidateName = await request.candidate.realNameWithHTML(
    bot,
    request.chat.id
  )

  const promoAddition = promoAdditions[isRuChat(request.chat) ? 'ru' : 'en']

  const text = `${
    saved
      ? strings.translate(
          'resultSave',
          request.chat.language,
          candidateName,
          voters
        )
      : strings.translate(
          'resultKick',
          request.chat.language,
          candidateName,
          voters
        )
  }\n${promoAddition}`

  if (!saved) {
    bot.kickChatMember(request.chat.id, request.candidate.id)
    if (request.reply_chat_id && request.reply_message_id) {
      bot.deleteMessage(request.reply_chat_id, request.reply_message_id)
    }
    try {
      request.chat.last_ban = new Date()
      await request.chat.save()
    } catch (err) {
      // Do nothing
    }
  }

  const options = {
    parse_mode: 'HTML',
    chat_id: request.inline_chat_id,
    message_id: request.inline_message_id,
    disable_web_page_preview: true,
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
function kickKeyboard(
  forkick,
  against,
  requestId,
  strings,
  voteCount,
  language
) {
  return [
    [
      {
        text: strings.translate('kickAction', language, forkick, voteCount),
        callback_data: `vi~${String(requestId)}~0`,
      },
    ],
    [
      {
        text: strings.translate('saveAction', language, against, voteCount),
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

  return bot.sendMessage(
    chat.id,
    chat.language,
    strings.translate('adminError')
  )
}

/**
 * Function to send error that ban limit is not sufficient
 * @param {Telegram:Bot} bot Bot that should send message
 * @param {Mongoose:Chat} chat Chat that should receive the message
 */
function sendBanLimitError(bot, chat) {
  const strings = require('./strings')()

  return bot.sendMessage(
    chat.id,
    strings.translate('tooSoonError', chat.language)
  )
}

/** Exports */
module.exports = {
  startRequest,
  voteQuery,
}
