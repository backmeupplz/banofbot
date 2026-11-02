const assert = require('assert')
const { test } = require('node:test')
const { commandOf } = require('./command')

const msg = (text) => {
  const m = /\/\S+/.exec(text)
  return {
    text,
    entities: m && [
      { type: 'bot_command', offset: m.index, length: m[0].length },
    ],
  }
}

test('commandOf', () => {
  assert.strictEqual(commandOf(msg('/start p1-a-vdb')), 'start')
  assert.strictEqual(commandOf(msg('/limit@banofbot 5')), 'limit')
  assert.strictEqual(
    commandOf(msg('/votekickWord kick, trial')),
    'votekickWord'
  )
  // Issue #83: not ours, even with "time"/"lock"/"help" somewhere in the text
  assert.strictEqual(
    commandOf(msg('/Execute example.com sometimes, block, help')),
    undefined
  )
  assert.strictEqual(commandOf(msg('/spam')), undefined)
  assert.strictEqual(commandOf(msg('see /help')), undefined)
  assert.strictEqual(commandOf({ text: 'help' }), undefined)
})
