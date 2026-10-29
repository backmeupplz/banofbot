# [@banofbot](https://t.me/banofbot): vote bans for Telegram groups

**[@banofbot](https://t.me/banofbot)** lets a Telegram group vote someone out. Reply to the offender's message with `@banofbot`, members vote, and once enough votes are in (five by default) the bot bans the user and deletes the message, so a group can deal with spammers and trolls without waiting for an admin. Add it to the group as an admin that can ban users and delete messages. This repository also holds the code of [@silent_banofbot](https://t.me/silent_banofbot). Open source (MIT).

Website: **[banofbot.borodutch.com](https://banofbot.borodutch.com)** (vote bans for Telegram groups: how it works, settings, FAQ).

The code for the bots follows. Contributions are welcome.

# Installation and local launch
1. Clone this repo: `git clone https://github.com/backmeupplz/banofbot`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` file with `TELEGRAM_API_KEY` and `MONGO_DB_URL`
4. Run `npm i` in the root folder
5. Run `npm run start`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Continuous integration
Any commit pushed to master gets deployed to both @banofbot and @silent_banofbot via [CI Ninja](https://github.com/backmeupplz/ci-ninja).

# License
MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
