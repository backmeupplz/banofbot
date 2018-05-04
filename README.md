# [@banofbot](https://telegram.me/banofbot) and [@silent_banofbot](https://telegram.me/banofbot) code
This repository contains the code for the democracy bots I've built. Readme is still in work, any contributions are welcome.

# Installation and local launch
1. Clone this repo: `git clone https://github.com/backmeupplz/banofbot`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` file with `TELEGRAM_API_KEY`, `MONGO_DB_URL` and `BOTAN_API_KEY`
4. Run `npm i` in the root folder
5. Run `npm run start`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Continuous integration
Any commit pushed to master gets deployed to both @banofbot and @silent_banofbot via [CI Ninja](https://github.com/backmeupplz/ci-ninja).

# License
MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
