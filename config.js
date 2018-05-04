/**
 * Configuration file
 *
 * @module config
 * @license MIT
 */

module.exports = {
  token: process.env.TELEGRAM_API_KEY,
  database: process.env.MONGO_DB_URL,
  ssl_certificate_path: process.env.SSL_CERTIFICATE_PATH,
  ssl_key_path: process.env.SSL_KEY_PATH,
  should_use_webhooks: process.env.USE_WEBHOOKS || false,
  webhook_callback_url: process.env.WEBHOOK_CALLBACK_URL,
  botan: process.env.BOTAN_API_KEY
};
