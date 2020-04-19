/**
 * Used for localization
 *
 * @module strings
 * @license MIT
 */

/** Dependencies */
const Localize = require('localize')

Localize.prototype.setChat = function (chat) {
  this.setLocale(chat.language)
}

/** Exports */
module.exports = () =>
  new Localize({
    '👋 Please, select your language.': {
      uk: '👋 Будь-ласка, виберіть вашу мову.',
      en: '👋 Please, select your language.',
      pt: '👋 Por favor, selecione o idioma.',
      ru: '👋 Пожалуйста, выберите ваш язык.',
      uz: '👋 Iltimos, tilni tanlang.',
      kz: '👋 Sіzdіń tіlіńіzdі tańdańyz.',
      tr: '👋 Lütfen dilinizi seçin.',
    },
    "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don't forget to set it as an admin, otherwise it wouldn't work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nGot questions? Check with our support channel — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.": {
      uk:
        "😎 *Banofbot* дозволяє голосувати за бан участників чату. Появився спамер або ще який негідник, а адмінів нема поруч? Просто дайте відповідь на повідомлення порушника текстом `@banofbot` і бот почне голосування.\n\n@banofbot чудово працює в групових чатах — давайте, додайте його в кілька! Не забудьте назначити бота адміном, інакше він не зможе працювати.\n\n/help — Показує це повідомлення 😱\n/language — Дозволяє вибрати мову 📣\n\nНе забудьте назначити @banofbot адміном, інакше він не зможе працювати.\n\nЗалишились питання? Почитайте наш канал підтримки — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      en:
        "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n@banofbot works well in group chats — so go on, add it to one of your precious chats! Don't forget to set it as an admin, otherwise it wouldn't work.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n\nGot questions? Check with our support channel — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      pt:
        "😎 *Banofbot* permite que você vote para banir usuários. Tem alguém fazendo spam ou flood e não tem um admin disponível para dar ban? Simplesmente responda à mensagem do infrator com o texto `@banofbot` e o bot iniciará a votação.\n\n@banofbot funciona bem em grupos — então o adicione a um de seus preciosos bate-papos! Não se esqueça de configurá-lo como administrador, caso contrário não vai adiantar nada.\n\n/help — Mostra esta mensagem 😱 \n/language — Permite escolher o idioma 📣\n\nPerguntas? Verifique com nosso canal de suporte — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      ru:
        '😎 *Banofbot* позволяет голосовать за бан участников чата. Появился спамер или еще какой негодяй, а админов нет рядом? Просто ответьте на сообщение провинившегося текстом `@banofbot` и бот начнет голосование.\n\n@banofbot отлично работает в групповых чатах — давайте, добавьте его в парочку! Не забудьте назначить бота админом, иначе он не сможет работать.\n\n/help — Показывает это сообщение 😱\n/language — Позволяет выбрать язык 📣\n\nОстались вопросы? Почитайте наш канал поддержки — @borodutch\\_support 🦄\n\nПопробуйте еще один мой проект — [Тудурант](https://todorant.com) ([iOS](https://apps.apple.com/ru/app/todorant/id1482078243), [Андроид](https://play.google.com/store/apps/details?id=com.todorant)). Это умный список задач, который использует поведенческую психологию для того, чтобы заставить ваш мозг выполнять задачи. Полностью бесплатен 30 дней без каких-либо обязательств, поэтому почему бы не попробовать улучшить свою продуктивность? Тудурант помог мне, поможет и вам!',
      uz:
        "😎 *Banofbot* guruh a'zolarini ban qilish uchun ovoz berishga yordam beradi. Spamer yoki qandaydir bezori paydo bo`ldi, lekin adminlar bandmi? Shunchaki bezorining habariga javob qilib `@banofbot` so`zini yuboring va bot ban qilish uchun ovoz to`plashni boshlaydi.\n\n@banofbot guruhlarda zo`r ishlaydi — uni bir nechta guruhlarga qo`shing va rivojlantirishga yordam bering! Botni admin qilib tayinlashni unutmang, aks holda u ishlamaydi.\n\n/help — Ushbu habarni ko`rsatadi 😱\n/language — Foydalanish tilini tanlashga yordam beradi 📣\n`z fikringizni bildiring.\n\nSavollar bormi? Qo`llab-quvvatlash kanalimizni o`qing — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      kz:
        "😎 *Banofbot* chattyń paıdalanýshylaryn ban etýge daýys berý múmkіndіgіn beredі. Spammer nemese basqa da qasqyr chatta otyr, bіraq jaqynda admın joq pa? Tek qana `@banofbot` mátіnі bar habarlamamen buzaqyǵa jaýap berіńіz de, bot daýys berýdі bastaıdy. \n\nBotty admın qyldyrýǵa umytpańyz, áıtpese ol jumys іstemeıdі! \n\n/help — Bul habardy kórsetedі 😱\n/language — Tіldі tańdaýǵa múmkіndіk beredі 📣\n\nSuraqtar barma? Bіzdіń qoldaý arnamyzdy oqyńyz — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      tr:
        '😎 *Banofbot* kullanıcıları yasaklamak için oy kullanmanıza izin verir. İstenmeyen ileti gönderen bir kullanıcı var veya bir tane yasaklayacak kimse yok mu? İhlalci iletisine `@banofbot` yazıp cevaplamanız yeterli: Bot hemen oylamaya başlayacaktır.\n\n/help — Bu mesajı gösterir 😱\n/language — Dili seçmenizi sağlar 📣\n/lock — Komutları kullanarak yönetici olmayanların kilidini açar veya kapatır 🔑\n/limit — Bir kullanıcıyı kovmak için en az sayıda seçmen belirlemenizi sağlar (ayrıca "/limit 100" kullanabilirsiniz) ✌️\n/time — Yasaklamalar arasındaki minimum süreyi seçmenizi sağlar\n\n@banofbot botunu bir yönetici olarak ayarlamayı unutmayın, aksi halde işe yaramaz.\n\nBaşka sorularınız mı var? Destek kanalımızı kontrol edin: @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It\'s free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.',
    },
    "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user (you can also use \"/limit 100\") ✌️\n/time — Allows you to select the minimum time between bans\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nDon't forget to set @banofbot as an admin, otherwise it wouldn't work.\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.": {
      uk:
        "😎 *Banofbot* дозволяє голосувати за бан участників чату. Появився спамер або ще який негідник, а адмінів нема поруч? Просто дайте відповідь на повідомлення порушника текстом `@banofbot` і бот почне голосування.\n\n@banofbot чудово працює в групових чатах — давайте, додайте його в кілька! Не забудьте назначити бота адміном, інакше він не зможе працювати.\n\n/help — Показує це повідомлення 😱\n/language — Дозволяє вибрати мову 📣\n/lock — Увімкнути або вимкнути доступ не-адмінів до командам бота 🔑\n/limit — Змінити мінімальну кількість голосів для кіку користувача ✌️\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nНе забудьте назначити @banofbot адміном, інакше він не зможе працювати.\n\nЗалишились питання? Почитайте наш канал підтримки — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      en:
        "😎 *Banofbot* allows you to vote to ban users. Got a spammer or flamer but nobody is out there to ban one? Simply reply to the violator's message with the text `@banofbot` and the bot will start the voting.\n\n/help — Shows this message 😱\n/language — Lets you pick the language 📣\n/lock — Toggles lock or unlock of non-admins using commands 🔑\n/limit — Lets you set minimal number of voters to kick a user (you can also use \"/limit 100\") ✌️\n/time — Allows you to select the minimum time between bans\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nDon't forget to set @banofbot as an admin, otherwise it wouldn't work.\n\nGot questions? Check with our support channel  — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      pt:
        "😎 * Banofbot * permite que você vote para banir usuários. Tem alguém fazendo spam ou flood, mas não tem um admin disponível para dar ban? Simplesmente responda à mensagem do infrator com o texto `@banofbot` e o bot iniciará a votação.\n\n/help - Mostra esta mensagem 😱 \n/language — Permite escolher o idioma 📣\n/lock — Alterna o bloqueio de não-administradores poderem usar os comandos 🔑\n/limit — Permite que você defina um número mínimo de membros para expulsar um usuário ✌️\n/time — permite que você selecione o tempo mínimo entre banimentos\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nNão se esqueça de configurar @banofbot como administrador, caso contrário não vai funcionar.\n\nDúvidas? Visite nosso canal de suporte — @borodutch\\_ support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      ru:
        '😎 *Banofbot* позволяет голосовать за бан участников чата. Появился спамер или еще какой негодяй, а админов нет рядом? Просто ответьте на сообщение провинившегося текстом `@banofbot` и бот начнет голосование.\n\n/help — Показывает это сообщение 😱\n/language — Позволяет выбрать язык 📣\n/lock — Включить или выключить доступ не-админов к командам бота 🔑\n/limit — Сменить минимальное количество голосов для кика пользователя (также вы можете использовать формат "/limit 100") ✌️\n/time — Настроить минимальное время между банами\n/votekickWord — настройка дополнительных слов начала голосований. Используйте в формате `/votekickWord кик, челлендж, драка` 🐸\n\nНе забудьте назначить @banofbot админом, иначе он не сможет работать.\n\nОстались вопросы? Почитайте наш канал поддержки — @borodutch\\_support 🦄\n\nПопробуйте еще один мой проект — [Тудурант](https://todorant.com) ([iOS](https://apps.apple.com/ru/app/todorant/id1482078243), [Андроид](https://play.google.com/store/apps/details?id=com.todorant)). Это умный список задач, который использует поведенческую психологию для того, чтобы заставить ваш мозг выполнять задачи. Полностью бесплатен 30 дней без каких-либо обязательств, поэтому почему бы не попробовать улучшить свою продуктивность? Тудурант помог мне, поможет и вам!',
      uz:
        "😎 *Banofbot* guruh a'zolarini ban qilish uchun ovoz berishga yordam beradi. Spamer yoki qandaydir bezori paydo bo`ldi, lekin adminlar bandmi? Shunchaki bezorining habariga javob qilib `@banofbot` so`zini yuboring va bot ban qilish uchun ovoz to`plashni boshlaydi.\n\n/help — Ushbu habarni ko`rsatadi 😱\n/language — Foydalanish tilini tanlashga yordam beradi 📣\n/lock — Oddiy foydalanuvchilarga (admin bo`lmaganlarga) bot buyruqlarini ishlatishni ta'qiqlaydi 🔑\n/limit — Foydalanuvchini ban qilish uchun kerak bo`lgan eng kam ovozlar sonini belgilaydi ✌️\n/time — Banlar orasidagi eng kam vaqtni belgilaydi\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nBotni admin qilib tayinlashni unutmang, aks holda u ishlamaydi.\n\nSavollar bormi? Qo`llab-quvvatlash kanalimizni o`qing — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      kz:
        "😎 *Banofbot* chattyń paıdalanýshylaryn ban etýge daýys berý múmkіndіgіn beredі. Spammer nemese basqa da qasqyr chatta otyr, bіraq jaqynda admın joq pa? Tek qana `@banofbot` mátіnі bar habarlamamen buzaqyǵa jaýap berіńіz de, bot daýys berýdі bastaıdy.\n\n/help — Bul habardy kórsetedі 😱\n/language — Tіldі tańdaýǵa múmkіndіk beredі 📣\n/lock — Bot komandalaryna admın emes qoldanýshylarǵa qatynaý berý nemese alý. 🔑\n/limit — Shyǵaryp jіberý úshіn eń az daýys sanyn tańdaý ✌️\n/time — Banǵa daýys berý aralyǵyndagy en az sekýndtar sanyn tańdaý\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\nBotty admın qyldyrýǵa umytpańyz, áıtpese ol jumys іstemeıdі!\n\nSuraqtar barma? Bіzdіń qoldaý arnamyzdy oqyńyz — @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It's free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.",
      tr:
        '😎 *Banofbot* kullanıcıları yasaklamak için oy kullanmanıza izin verir. İstenmeyen ileti gönderen bir kullanıcı var veya bir tane yasaklayacak kimse yok mu? İhlalci iletisine `@banofbot` yazıp cevaplamanız yeterli: Bot hemen oylamaya başlayacaktır.\n\n/help — Bu mesajı gösterir 😱\n/language — Dili seçmenizi sağlar 📣\n/lock — Komutları kullanarak yönetici olmayanların kilidini açar veya kapatır 🔑\n/limit — Bir kullanıcıyı kovmak için en az sayıda seçmen belirlemenizi sağlar (ayrıca "/limit 100" kullanabilirsiniz) ✌️\n/time — Yasaklamalar arasındaki minimum süreyi seçmenizi sağlar\n/votekickWord — allows you to set more votekick words. Use like `/votekickWord kick, trial, challenge` 🐸\n\n@banofbot botunu bir yönetici olarak ayarlamayı unutmayın, aksi halde işe yaramaz.\n\nBaşka sorularınız mı var? Destek kanalımızı kontrol edin: @borodutch\\_support 🦄\n\nAlso check out another one of my projects — [Todorant](https://todorant.com) ([iOS](https://apps.apple.com/us/app/todorant/id1482078243), [Android](https://play.google.com/store/apps/details?id=com.todorant)). It is a smart todo list app that uses cognitive psychology to trick your brain into finishing projects and showing results. It\'s free for 30 days with no strings attached, so go give it a shot if you want to improve your productivity. It helped me — it can help you as well.',
    },
    '@banofbot now speaks English. Thank you!': {
      uk: '@banofbot тепер розмовляє українською. Дякую!',
      en: '@banofbot now speaks English. Thank you!',
      pt: '@banofbot agora fala português. Obrigado!',
      ru: '@banofbot теперь говорит по-русски. Спасибо!',
      uz: '@banofbot endi o\\`zbekcha gapiradi. Rahmat!',
      kz: '@banofbot endі qazaqsha sóıleıdі. Rahmet!',
      tr: '@banofbot artık Türkçe konuşuyor. Teşekkür ederiz!',
    },
    '🔑 Great! *Banofbot* will now respond only to command calls sent by *admins* in this chat.': {
      uk:
        '🔑 Чудно! *Banofbot* тепер реагує на команди, відправлені *адмінами*, в цьому чаті.',
      en:
        '🔑 Great! *Banofbot* will now respond only to command calls sent by *admins* in this chat.',
      pt:
        '🔑 OK! *Banofbot* somente vai atender a comandos enviados por *admins".',
      ru:
        '🔑 Чудно! *Banofbot* теперь реагирует только на команды, посланные *админами*, в этом чате.',
      uz:
        '🔑 Ajoyib! *Banofbot* endi faqat ushbu guruhdagi *adminlar* yuborgan buyruqlarga javob beradi.',
      kz:
        '🔑 Keremet! *Banofbot* endі osy chatta *admınnyń* komandalaryna ǵana jaýap beredі.',
      tr:
        '🔑 Harika! *Banofbot* artık bu sohbette yalnızca *yöneticiler* tarafından gönderilen komut çağrılarına yanıt verecek.',
    },
    '🔑 Great! *Banofbot* will now respond only to command calls from *anyone* in this chat.': {
      uk:
        '🔑 Чудно! *Banofbot* тепер реагує на команди, відправлені *будь-якими користувачами*, в цьому чаті.',
      en:
        '🔑 Great! *Banofbot* will now respond only to command calls from *anyone* in this chat.',
      pt: '🔑 OK! *Banofbot* vai atender a comandos de *qualquer membro*.',
      ru:
        '🔑 Чудно! *Banofbot* теперь реагирует на команды, посланные *любыми пользователями*, в этом чате.',
      uz:
        '🔑 Ajoyib! *Banofbot* endi ushbu guruhdagi *istalgan foydalanuvchi* yuborgan buyruqlarga javob beradi.',
      kz:
        '🔑 Keremet! *Banofbot* endі osy chatta *kez kelgen paıdalanýshy* arqyly jіberіlgen komandalarǵa jaýap beredі.',
      tr:
        '🔑 Harika! *Banofbot* artık bu sohbette *herkes* tarafından gönderilen komut çağrılarına cevap verecek.',
    },
    '$[1] would like to kick $[2]. Do you agree?': {
      uk: '$[1] хоче кікнути $[2] з чату. Згідні?',
      en: '$[1] would like to kick $[2]. Do you agree?',
      pt: '$[1] acha que $[2] deveria ser retirado do grupo. Concordam?',
      ru: '$[1] хочет кикнуть $[2] из чата. Согласны?',
      uz: '$[1] guruhdan $[2]ni ban qilishni istayapti. Rozimisiz?',
      kz: '$[1] chattań $[2]-ti shyǵatynyn qalaıdy. Sіz kelіsesіz be?',
      tr: '$[1], $[2] kullanıcısını kovmak istiyor. Katılıyor musunuz?',
    },
    '🔫 Kick ($[1]/$[2])': {
      uk: '🔫 Кікнути ($[1]/$[2])',
      en: '🔫 Kick ($[1]/$[2])',
      pt: '🔫 Retirar ($[1]/$[2])',
      ru: '🔫 Кикнуть ($[1]/$[2])',
      uz: '🔫 Ban qilish ($[1]/$[2])',
      kz: '🔫 Shyǵaryp jіberý ($[1]/$[2])',
      tr: '🔫 Kov ($[1]/$[2])',
    },
    '👼 Save ($[1]/$[2])': {
      uk: '👼 Вибачити ($[1]/$[2])',
      en: '👼 Save ($[1]/$[2])',
      pt: '👼 Absolver ($[1]/$[2])',
      ru: '👼 Простить ($[1]/$[2])',
      uz: '👼 Kechirish ($[1]/$[2])',
      kz: '👼 Keshіrý',
      tr: '👼 Tut ($[1]/$[2])',
    },
    '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]': {
      uk:
        '👼 $[1] врятований — в цей раз його не кікнули.\n\nПроголосувавші за порятунок:\n$[2]',
      en:
        '👼 $[1] has been saved — no kick for you this time.\n\nVoters who chose to save:\n$[2]',
      pt:
        '👼 $[1] foi absolvido — sem expulsões por enquanto.\n\nQuem votou pela absolvição:\n$[2]',
      ru:
        '👼 $[1] спасен — в этот раз его не кикнули.\n\nПроголосовавшие за спасение:\n$[2]',
      uz:
        '👼 $[1] guruhda qoldirildi — bu safar u ban qilinmadi.\n\nGuruhda qoldirishga berilgan ovozlar:\n$[2]',
      kz:
        '👼 $[1] qutqaryldy — bul joly ony shyǵaryp jіbermedі. \n\nQutqarý úshіn daýys berdі:\n$[2]',
      tr:
        '👼 $[1] grupta tutuldu — bu seferlik sizin için kovma eylemi yok.\n\nGrupta tutulmasını isteyenler:\n$[2]',
    },
    '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]': {
      uk:
        '🔫 $[1] кікнуто — вернути цього користувача можна тільки розбаном в налаштуваннях чату.\n\nПроголосувавші за кік:\n$[2]',
      en:
        '🔫 $[1] has been kicked — the only way to get this user back is for admins to manualy unban in chat settings.\n\nVoters who chose to kick:\n$[2]',
      pt:
        '🔫 $[1] foi retirado do grupo — a única forma de retornar é um admin removendo o banimento do usuário nas configurações do grupo.\n\nQuem votou pela expulsão:\n$[2]',
      ru:
        '🔫 $[1] кикнут — вернуть этого пользователя можно только разбаном в настройках чата.\n\nПроголосовавшие за кик:\n$[2]',
      uz:
        '🔫 $[1] ban qilindi — foydalanuvchini qaytarish uchun uni guruh qora ro\\`yxatidan olib tashlash kerak.\n\nBan qilish uchun ovozlar soni:\n$[2]',
      kz:
        '🔫 $[1] shyǵaryp jіberіldі — bul paıdalanýshyny tek chat parametrlerі arqyly qaıtarylýy múmkіn.\n\nShyǵaryp jіberý úshіn daýys bergen:\n$[2]',
      tr:
        '🔫 $[1] kovuldu — bu kullanıcıyı geri almanın tek yolu, yöneticilerin sohbet ayarlarından yasağı elle kaldırmasıdır.\n\nGruptan kovulmasını isteyenler:\n$[2]',
    },
    'You have already voted for 👼': {
      uk: 'Ви вже проголосували за 👼',
      en: 'You have already voted for 👼',
      pt: 'Você já vou em 👼',
      ru: 'Вы уже проголосовали за 👼',
      uz: 'Siz 👼 uchun ovoz berib bo\\`ldingiz',
      kz: 'Sіz daýys berіp qoıdynyz 👼',
      tr: 'Zaten oy kullandınız 👼',
    },
    'You have already voted for 🔫': {
      uk: 'Ви вже проголосували за 🔫',
      en: 'You have already voted for 🔫',
      pt: 'Você já votou em 🔫',
      ru: 'Вы уже проголосовали за 🔫',
      uz: 'Siz 🔫 uchun ovoz berib bo\\`ldingiz',
      kz: 'Sіz daýys berіp qoıdynyz 🔫',
      tr: 'Zaten oy kullandınız 🔫',
    },
    '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!': {
      uk:
        '🔥 Ой! Схоже, що @banofbot тут ще не адмін. Будь-ласка, попросіть адмінів додати @banofbot, як адміна, інакше він не буде. Дякую!',
      en:
        '🔥 Oops! Looks like @banofbot is not an admin here yet. Please ask admins to set @banofbot as an admin as well, otherwise it will not work. Thanks!',
      pt:
        '🔥 Ops! Parece que o @banofbot ainda não é um administrador. Por favor, peça aos administradores que definam @banofbot como administrador também, senão não funcionará. Obrigado!',
      ru:
        '🔥 Ой! Похоже, что @banofbot здесь еще не админ. Пожалуйста, попросите админов добавить @banofbot, как админа, иначее он не будет работать. Спасибо!',
      uz:
        "🔥 Vay! @banofbot ushbu guruhda admin emasga o\\`xshaydi. Iltimos, adminlardan @banofbot'ni guruh admini qilib tayinlashni so\\`rang, aks holda u ishlamaydi. Rahmat!",
      kz:
        '🔥 Oı! @Banofbot álі admın emes sııaqty. Admınderden @banofbot-dі admin dep qosýdy surańyz, áıtpese ol jumys іstemeıdі. Rahmet!',
      tr:
        '🔥 Hay aksi! Görünüşe göre @banofbot henüz bir yönetici değil. Lütfen yöneticilerinizden @banofbot botunu bir yönetici olarak ayarlamasını isteyin, aksi takdirde çalışmaz. Teşekkür ederiz!',
    },
    '✌️ Please, select the minimum number of votes to kick a user. Current number is *$[1]*': {
      uk:
        '✌️ Будь-ласка, виберіть мінімальну кількість голосів для кіка користувача. Зараз кількість — *$[1]*',
      en:
        '✌️ Please, select the minimum number of votes to kick a user. Current number is *$[1]*',
      pt:
        '✌️ Por favor, selecione o número mínimo de votos para retirar um usuário. O número atual é *$[1]*',
      ru:
        '✌️ Пожалуйста, выберите минимальное количество голосов для кика пользователя. Текущее количество — *$[1]*',
      uz:
        '✌️ Iltimos, foydalanuvchilarni ban qilish uchun kerak bo\\`lgan eng kam ovozlar sonini ayting. Hozir — *$[1]*',
      kz:
        '✌️ Paıdalanýshyny shyǵaryp jіberý úshіn eń az daýys sanyn tańdańyz. Aǵymdaǵy san — *$[1]*',
      tr:
        '✌️ Lütfen bir kullanıcıyı kovmak için minimum oy sayısını seçin. Mevcut sayı: *$[1]*',
    },
    '@banofbot will now kick a user if *$[1]* people vote for it. Thanks!': {
      uk:
        '@banofbot тепер буде кікати користувача, якщо*$[1]* людей проголосує за це. Дякую!',
      en:
        '@banofbot will now kick a user if *$[1]* people vote for it. Thanks!',
      pt:
        '@banofbot agora vai expulsar um usuário se *$[1]* pessoas votarem. Obrigado!',
      ru:
        '@banofbot теперь будет кикать пользователя, если *$[1]* людей проголосуют за это. Спасибо!',
      uz:
        '@banofbot endi foydalanuvchini *$[1]*ta qarshi ovozdan keyin kick qiladi. Rahmat!',
      kz:
        '@banofbot endі paıdalanýshyny *$[1]* adam daýys bergen kezde, ony shyǵaryp jіberedі. Rahmet!',
      tr:
        '@banofbot artık *$[1]* kişi oy verirse bir kullanıcıyı kovacak. Teşekkür ederiz!',
    },
    '🔥 Looks like you are trying to start a new ban request too soon. You can change the time limit for ban requests by using /time command. Thanks!': {
      uk:
        '🔥 Looks like you are trying to start a new ban request too soon. You can change the time limit for ban requests by using /time command. Thanks!',
      en:
        '🔥 Looks like you are trying to start a new ban request too soon. You can change the time limit for ban requests by using /time command. Thanks!',
      pt:
        '🔥 Parece que você está tentando iniciar uma nova solicitação cedo demais. Você pode alterar o limite de tempo para este tipo de solicitação usando o comando /time. Obrigado!',
      ru:
        '🔥 Похоже, вы пытаетесь начать голосование на кик слишком рано. Вы можете изменить лимит по времени между голосованиями при помощи комманды /time. Спасибо!',
      uz:
        '🔥 Kick qilish uchun ovoz to\\`plashni juda erta boshlashga urinyapsiz. Ban qilish uchun ovoz berish jarayonlari orasidagi vaqtni /time buyrug\\`i orqali o\\`zgartirishingiz mumkin. Rahmat!',
      kz:
        '🔥 Sіz tym erte shyǵaryp jіberýge daýys berýdі bastap jatyrsyz. Daýys berý arasyndaǵy ýaqyt aralyǵyn /time komandasymen ózgertýge bolady. Rahmet!',
      tr:
        '🔥 Çok kısa sürede yeni bir yasak isteği başlatmaya çalışıyor gibi görünüyorsun. /time komutunu kullanarak yasak isteklerinin zaman sınırını değiştirebilirsin. Teşekkür ederiz!',
    },
    '✌️ Please, select the minimum amount of time between ban requests. Current limit is *$[1]* seconds.': {
      uk:
        '✌️ Please, select the minimum amount of time between ban requests. Current limit is *$[1]* seconds.',
      en:
        '✌️ Please, select the minimum amount of time between ban requests. Current limit is *$[1]* seconds.',
      pt:
        '✌️ Por favor, selecione o tempo mínimo entre as solicitações. O limite atual é *$[1]* segundos.',
      ru:
        '✌️ Пожалуйста, выберите минимальное количество секунд между голосованиями на бан. Текущий лимит — *$[1]* секунд.',
      uz:
        '✌️ Iltimos, ban qilish uchun ovoz berish jarayonlari orasidagi eng kam vaqtni belgilang. Hozirgi cheklov — *$[1]* soniya.',
      kz:
        '✌️ Banǵa daýys berý aralyǵyndagy en az sekýndtar sanyn tańdanyz. Kazіrgі lımıt — *$[1]* sekýnd',
      tr:
        '✌️ Lütfen yasak istekleri arasındaki minimum süreyi seçin. Mevcut süre: *$[1]* saniye.',
    },
    '@banofbot will now allow new ban requests *$[1]* seconds after the last ban. Thanks!': {
      uk:
        '@banofbot will now allow new ban requests *$[1]* seconds after the last ban. Thanks!',
      en:
        '@banofbot will now allow new ban requests *$[1]* seconds after the last ban. Thanks!',
      pt:
        '@banofbot agora permitirá novas solicitações *$[1]* segundos após a última. Obrigado!',
      ru:
        '@banofbot теперь будет начинать голосования на бан, спустя *$[1]* секунд после последнего бана. Спасибо!',
      uz:
        '@banofbot endi ban qilish uchun ovoz berishni oxirgi bandan *$[1]* soniyadan keyin boshlaydi. Rahmat!',
      kz:
        '@banofbot sońǵy bannan keıіn *$[1]* sekýnd ótkennen soń banǵa daýys berý bastaıdy. Rahmet!',
      tr:
        '@banofbot artık yeni yasaklama isteklerine son yasaklamadan *$[1]* saniye sonra izin verecek. Teşekkür ederiz!',
    },
  })
