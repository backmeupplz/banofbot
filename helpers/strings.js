/**
 * Used for localization
 *
 * @module strings
 * @license MIT
 */

/** Dependencies */
const Localize = require('localize')

Localize.prototype.setChat = function(chat) {
  this.setLocale(chat.language)
}

/** Exports */
module.exports = () =>
  new Localize({
    '👋 Please, select your language.': {
      uk: '👋 Будь-ласка, виберіть вашу мову.',
      en: '👋 Please, select your language.',
      ru: '👋 Пожалуйста, выберите ваш язык.',
    },
    "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don't forget to set it as an admin, otherwise it wouldn't work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nLike this bot? Leave a review [here](https://telegram.me/storebot?start=banofbot).\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄": {
      uk: 
        '😎 *Banofbot* дозволяє голосувати за бан участників чату. Появився спамер або ще який негідник, а адмінів нема поруч? Просто дайте відповідь на повідомлення порушника текстом `@banofbot` і бот почне голосування.\n\n@banofbot чудово працює в групових чатах — давайте, додайте його в кілька! Не забудьте назначити бота адміном, інакше він не зможе працювати.\n\n/help — Показує це повідомлення 😱\n/language — Дозволяє вибрати мову 📣\n\nНе забудьте назначити @banofbot адміном, інакше він не зможе працювати.\n\nПодобаєтьсч бот? Залиште відгук [за посиланням](https://telegram.me/storebot?start=banofbot).\n\nЗалишились питання? Почитайте наш канал підтримки — @borodutch\\_support 🦄',
      en:
        "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don't forget to set it as an admin, otherwise it wouldn't work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nLike this bot? Leave a review [here](https://telegram.me/storebot?start=banofbot).\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄",
      ru:
        '😎 *Banofbot* позволяет голосовать за бан участников чата. Появился спамер или еще какой негодяй, а админов нет рядом? Просто ответьте на сообщение провинившегося текстом `@banofbot` и бот начнет голосование.\n\n@banofbot отлично работает в групповых чатах — давайте, добавьте его в парочку! Не забудьте назначить бота админом, иначе он не сможет работать.\n\n/help — Показывает это сообщение 😱\n/language — Позволяет выбрать язык 📣\n\nНравится бот? Оставьте отзыв [по ссылке](https://telegram.me/storebot?start=banofbot).\n\nОстались вопросы? Почитайте наш канал поддержки — @borodutch\\_support 🦄',
    },
    "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user ✌️\n\nDon't forget to set @banofbot as an admin, otherwise it wouldn't work.\n\nLike this bot? Leave a review [here](https://telegram.me/storebot?start=banofbot).\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄": {
      uk: '😎 *Banofbot* дозволяє голосувати за бан участників чату. Появився спамер або ще який негідник, а адмінів нема поруч? Просто дайте відповідь на повідомлення порушника текстом `@banofbot` і бот почне голосування.\n\n@banofbot чудово працює в групових чатах — давайте, додайте його в кілька! Не забудьте назначити бота адміном, інакше він не зможе працювати.\n\n/help — Показує це повідомлення 😱\n/language — Дозволяє вибрати мову 📣\n/lock — Увімкнути або вимкнути доступ не-адмінів до командам бота 🔑\n/limit — Змінити мінімальну кількість голосів для кіку користувача ✌️\n\nНе забудьте назначити @banofbot адміном, інакше він не зможе працювати.\n\nПодобаєтьсч бот? Залиште відгук [за посиланням](https://telegram.me/storebot?start=banofbot).\n\nЗалишились питання? Почитайте наш канал підтримки — @borodutch\\_support 🦄',
      en:
        "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user ✌️\n\nDon't forget to set @banofbot as an admin, otherwise it wouldn't work.\n\nLike this bot? Leave a review [here](https://telegram.me/storebot?start=banofbot).\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄",
      ru:
        '😎 *Banofbot* позволяет голосовать за бан участников чата. Появился спамер или еще какой негодяй, а админов нет рядом? Просто ответьте на сообщение провинившегося текстом `@banofbot` и бот начнет голосование.\n\n/help — Показывает это сообщение 😱\n/language — Позволяет выбрать язык 📣\n/lock — Включить или выключить доступ не-админов к командам бота 🔑\n/limit — Сменить минимальное количество голосов для кика пользователя ✌️  \n\nНе забудьте назначить @banofbot админом, иначе он не сможет работать.\n\nНравится бот? Оставьте отзыв [по ссылке](https://telegram.me/storebot?start=banofbot).\n\nОстались вопросы? Почитайте наш канал поддержки — @borodutch\\_support 🦄',
    },
    '@banofbot now speaks English. Thank you!': {
      uk: '@banofbot тепер розмовляє українською. Дякую!',
      en: '@banofbot now speaks English. Thank you!',
      ru: '@banofbot теперь говорит по-русски. Спасибо!',
    },
    '🔑 Great! *Banofbot* will now respond only to command calls sent by *admins* in this chat.': {
      uk:
        '🔑 Чудно! *Banofbot* тепер реагує на команди, відправлені *адмінами*, в цьому чаті.',
      en:
        '🔑 Great! *Banofbot* will now respond only to command calls sent by *admins* in this chat.',
      ru:
        '🔑 Чудно! *Banofbot* теперь реагирует только на команды, посланные *админами*, в этом чате.',
    },
    '🔑 Great! *Banofbot* will now respond only to command calls from *anyone* in this chat.': {
      uk:
        '🔑 Чудно! *Banofbot* тепер реагує на команди, відправлені *будь-якими користувачами*, в цьому чаті.',
      en:
        '🔑 Great! *Banofbot* will now respond only to command calls from *anyone* in this chat.',
      ru:
        '🔑 Чудно! *Banofbot* теперь реагирует на команды, посланные *любыми пользователями*, в этом чате.',
    },
    '$[1] would like to kick $[2]. Do you agree?': {
      uk: '$[1] хоче кікнути $[2] з чату. Згідні?',
      en: '$[1] would like to kick $[2]. Do you agree?',
      ru: '$[1] хочет кикнуть $[2] из чата. Согласны?',
    },
    '🔫 Kick ($[1]/$[2])': {
      uk: '🔫 Кікнути ($[1]/$[2])',
      en: '🔫 Kick ($[1]/$[2])',
      ru: '🔫 Кикнуть ($[1]/$[2])',
    },
    '👼 Save ($[1]/$[2])': {
      uk: '👼 Вибачити($[1]/$[2])',
      en: '👼 Save ($[1]/$[2])',
      ru: '👼 Простить ($[1]/$[2])',
    },
    '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]': {
      uk:
        '👼 $[1] врятований — в цей раз його не кікнули.\n\nПроголосувавші за порятунок:\n$[2]',
      en:
        '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]',
      ru:
        '👼 $[1] спасен — в этот раз его не кикнули.\n\nПроголосовавшие за спасение:\n$[2]',
    },
    '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]': {
      uk:
        '🔫 $[1] кікнуто — вернути цього користувача можна тільки розбаном в налаштуваннях чату.\n\nПроголосувавші за кік:\n$[2]',
      en:
        '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]',
      ru:
        '🔫 $[1] кикнут — вернуть этого пользователя можно только разбаном в настройках чата.\n\nПроголосовавшие за кик:\n$[2]',
    },
    'You have already voted for 👼': {
      uk: 'Ви вже проголосували за 👼',
      en: 'You have already voted for 👼',
      ru: 'Вы уже проголосовали за 👼',
    },
    'You have already voted for 🔫': {
      uk: 'Ви вже проголосували за 🔫',
      en: 'You have already voted for 🔫',
      ru: 'Вы уже проголосовали за 🔫',
    },
    '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!': {
      uk:
        '🔥 Ой! Схоже, що @banofbot тут ще не адмін. Будь-ласка, попросіть адмінів додати @banofbot, як адміна, інакше він не буде. Дякую!',
      en:
        '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!',
      ru:
        '🔥 Ой! Похоже, что @banofbot здесь еще не админ. Пожалуйста, попросите админов добавить @banofbot, как админа, иначее он не будет работать. Спасибо!',
    },
    '✌️ Please, select the minimum number of votes to kick a user. Current number is *$[1]*': {
      uk:
        '✌️ Будь-ласка, виберіть мінімальну кількість голосів для кіка користувача. Зараз кількість — *$[1]*',
      en:
        '✌️ Please, select the minimum number of votes to kick a user. Current number is *$[1]*',
      ru:
        '✌️ Пожалуйста, выберите минимальное количество голосов для кика пользователя. Текущее количество — *$[1]*',
    },
    '@banofbot will now kick a user if *$[1]* people vote for it. Thanks!': {
      uk:
        '@banofbot тепер буде кікати користувача, якщо*$[1]* людей проголосує за це. Дякую!',
      en:
        '@banofbot will now kick a user if *$[1]* people vote for it. Thanks!',
      ru:
        '@banofbot теперь будет кикать пользователя, если *$[1]* людей проголосуют за это. Спасибо!',
    },
  })
