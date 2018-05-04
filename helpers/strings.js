/**
 * Used for localization
 *
 * @module strings
 * @license MIT
 */

/** Dependencies */
const Localize = require('localize');

Localize.prototype.setChat = function (chat) {
  this.setLocale(chat.language);
};

/** Exports */
module.exports = () => new Localize({
  '👋 Please, select your language.': {
    en: '👋 Please, select your language.',
    ru: '👋 Пожалуйста, выберите ваш язык.',
  },
  '😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator\'s message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don\'t forget to set it as an admin, otherwise it wouldn\'t work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nLike this bot? Leave a review here: https://telegram.me/storebot?start=banofbot\n\nAddress any concerns and questions to my creator — @borodutch 🦄': {
    en: '😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator\'s message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don\'t forget to set it as an admin, otherwise it wouldn\'t work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nLike this bot? Leave a review here: https://telegram.me/storebot?start=banofbot\n\nAddress any concerns and questions to my creator — @borodutch 🦄',
    ru: '😎 *Banofbot* позволяет голосовать за бан участников чата. Появился спамер или еще какой негодяй, а админов нет рядом? Просто ответьте на сообщение провинившегося текстом `@banofbot` и бот начнет голосование.\n\n@banofbot отлично работает в групповых чатах — давайте, добавьте его в парочку! Не забудьте назначить бота админом, иначе он не сможет работать.\n\n/help — Показывает это сообщение 😱\n/language — Позволяет выбрать язык 📣\n\nНравится бот? Оставьте отзыв по ссылке: https://telegram.me/storebot?start=banofbot\n\nВопросы и предложения пишите моему создателю — @borodutch 🦄',
  },
  '😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator\'s message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user ✌️\n\nDon\'t forget to set @banofbot as an admin, otherwise it wouldn\'t work.\n\nLike this bot? Leave a review here: https://telegram.me/storebot?start=banofbot\n\nAddress any concerns and questions to my creator — @borodutch 🦄': {
    en: '😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator\'s message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user ✌️\n\nDon\'t forget to set @banofbot as an admin, otherwise it wouldn\'t work.\n\nLike this bot? Leave a review here: https://telegram.me/storebot?start=banofbot\n\nAddress any concerns and questions to my creator — @borodutch 🦄',
    ru: '😎 *Banofbot* позволяет голосовать за бан участников чата. Появился спамер или еще какой негодяй, а админов нет рядом? Просто ответьте на сообщение провинившегося текстом `@banofbot` и бот начнет голосование.\n\n/help — Показывает это сообщение 😱\n/language — Позволяет выбрать язык 📣\n/lock — Включить или выключить доступ не-админов к командам бота 🔑\n/limit — Сменить минимальное количество голосов для кика пользователя ✌️  \n\nНе забудьте назначить @banofbot админом, иначе он не сможет работать.\n\nНравится бот? Оставьте отзыв по ссылке: https://telegram.me/storebot?start=banofbot\n\nВопросы и предложения пишите моему создателю — @borodutch 🦄',
  },
  '@banofbot now speaks English. Thank you!': {
    en: '@banofbot now speaks English. Thank you!',
    ru: '@banofbot теперь говорит по-русски. Спасибо!',
  },
  '🔑 Great! *Banofbot* will now respond only to command calls sent by *admins* in this chat.': {
    en: '🔑 Great! *Banofbot* will now respond only to command calls sent by *admins* in this chat.',
    ru: '🔑 Чудно! *Banofbot* теперь реагирует только на команды, посланные *админами*, в этом чате.',
  },
  '🔑 Great! *Banofbot* will now respond only to command calls from *anyone* in this chat.': {
    en: '🔑 Great! *Banofbot* will now respond only to command calls from *anyone* in this chat.',
    ru: '🔑 Чудно! *Banofbot* теперь реагирует на команды, посланные *любыми пользователями*, в этом чате.',
  },
  '$[1] would like to kick $[2]. Do you agree?': {
    en: '$[1] would like to kick $[2]. Do you agree?',
    ru: '$[1] хочет кикнуть $[2] из чата. Согласны?',
  },
  '🔫 Kick ($[1]/$[2])': {
    en: '🔫 Kick ($[1]/$[2])',
    ru: '🔫 Кикнуть ($[1]/$[2])',
  },
  '👼 Save ($[1]/$[2])': {
    en: '👼 Save ($[1]/$[2])',
    ru: '👼 Простить ($[1]/$[2])',
  },
  '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]': {
    en: '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]',
    ru: '👼 $[1] спасен — в этот раз его не кикнули.\n\nПроголосовавшие за спасение:\n$[2]',
  },
  '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]': {
    en: '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]',
    ru: '🔫 $[1] кикнут — вернуть этого пользователя можно только разбаном в настройках чата.\n\nПроголосовавшие за кик:\n$[2]',
  },
  'You have already voted for 👼': {
    en: 'You have already voted for 👼',
    ru: 'Вы уже проголосовали за 👼',
  },
  'You have already voted for 🔫': {
    en: 'You have already voted for 🔫',
    ru: 'Вы уже проголосовали за 🔫',
  },
  '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!': {
    en: '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!',
    ru: '🔥 Ой! Похоже, что @banofbot здесь еще не админ. Пожалуйста, попросите админов добавить @banofbot, как админа, иначее он не будет работать. Спасибо!',
  },
  '✌️ Please, select the minimum number of votes to kick a user. Current number is *$[1]*': {
    en: '✌️ Please, select the minimum number of votes to kick a user. Current number is *$[1]*',
    ru: '✌️ Пожалуйста, выберите минимальное количество голосов для кика пользователя. Текущее количество — *$[1]*',
  },
  '@banofbot will now kick a user if *$[1]* people vote for it. Thanks!': {
    en: '@banofbot will now kick a user if *$[1]* people vote for it. Thanks!',
    ru: '@banofbot теперь будет кикать пользователя, если *$[1]* людей проголосуют за это. Спасибо!',
  },
});
