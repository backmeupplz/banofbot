/**
 * Banofbot's reply-promo hook (promo.js), with its caps and arrivals kept in
 * the bot's own Mongo (collection promos)
 *
 * @module promoHook
 * @license MIT
 */

const mongoose = require('mongoose')
const { promos, mongoStore } = require('./promo')

module.exports = promos(
  'banofbot',
  mongoStore(mongoose.connection.collection('promos'))
)
