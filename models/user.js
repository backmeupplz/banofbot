/**
 * @module models/user
 * @license MIT
 */

/** Dependencies */
const mongoose = require('mongoose');

/** Schema */
const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: String,
  username: String,
}, { timestamps: true });

userSchema.methods.name = function () {
  if (this.username) {
    return `@${this.username}`;
  } else if (this.last_name) {
    return `${this.first_name} ${this.last_name}`;
  }
  return this.first_name;
};

/** Exports */
module.exports = mongoose.model('user', userSchema);
