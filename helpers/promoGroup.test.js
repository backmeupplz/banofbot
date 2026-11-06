// node --test helpers/promoGroup.test.js: group promos (approvals.md
// 2026-11-06, agentboard #482): the group hook in promo.js (a port of
// prime-radiant go/promo.test.ts), the button under a vote's result, /promos
const test = require('node:test')
const assert = require('node:assert')
const path = require('path')
const {
  decideGroup,
  groupArm,
  groupKey,
  memoryStore,
  promos,
  topical,
  unitOf,
} = require('./promo')

const BOT = 'banofbot'
const TOPICS = { en: ['spam', 'scam', 'crypto'], ru: ['спам', 'крипт'] }
const gcfg = (over = {}) => ({
  base: 'https://lumen.borodutch.com/go',
  bots: {
    [BOT]: { enabled: true, code: 'ban' },
    randy: { enabled: true, code: 'randy' },
  },
  campaigns: [
    {
      id: 'gp2',
      bot: BOT,
      status: 'running',
      target: 'https://t.me/jev_antispam_bot',
      chats: ['group'],
      cap_days: 7,
      langs: ['en', 'ru'],
      text: { en: 'Jev', ru: 'Jev' },
      variants: [
        {
          id: 'a',
          share: 0.25,
          format: 'button',
          text: { en: 'Stop spam', ru: 'Без спама' },
        },
      ],
      topics: TOPICS,
      ...over,
    },
    {
      id: 'gp9',
      bot: 'randy',
      status: 'running',
      target: 'https://t.me/jev_antispam_bot',
      chats: ['group'],
      cap_days: 7,
      langs: ['en'],
      text: { en: 'Jev' },
      variants: [{ id: 'a', share: 0.25, format: 'button' }],
      topics: TOPICS,
    },
  ],
})
const groups = Array.from({ length: 4000 }, (_, i) => -1001000000000 - i)
const gIn = (id, salt = 'S', c = gcfg().campaigns[0]) =>
  groups.filter((g) => {
    const a = groupArm(c, salt, g)
    return (a ? a.id : undefined) === id
  })

// The go service: the salt, the config, events, and POST /go/group (one claim
// per group hash per 7 days, whichever bot)
function fakeGo() {
  const sent = []
  const claims = new Map()
  const json = (o) => new global.Response(JSON.stringify(o))
  const go = {
    sent,
    claims,
    down: false,
    fetch: async (url, init) => {
      const body = init && init.body
      sent.push({ url, body })
      if (url.includes('/salt?bot=')) return json({ salt: 'S' })
      if (url.endsWith('campaigns.json')) return json(gcfg())
      if (url.endsWith('/go/group')) {
        if (go.down) return new global.Response('down', { status: 502 })
        const { g, k, at } = JSON.parse(body)
        const held = claims.get(g)
        if (k === 'release') {
          if (held === at) claims.delete(g)
          return json({ ok: true })
        }
        if (held !== undefined) return json({ ok: false, at: held })
        const now = Date.now()
        claims.set(g, now)
        return json({ ok: true, at: now })
      }
      return json({ stored: 1 })
    },
  }
  return go
}
const withFetch = async (go, f) => {
  const real = global.fetch
  global.fetch = go.fetch
  try {
    await f()
  } finally {
    global.fetch = real
  }
}
const tick = () => new Promise((resolve) => setImmediate(resolve))
const events = (go) =>
  go.sent
    .filter((s) => s.url.endsWith('/go/events'))
    .flatMap((s) => JSON.parse(s.body).events)
    .map((e) => `${e.c}:${e.v}:${e.k}`)

test('topical and decideGroup: topics, the group arm, the cap, buttons only', () => {
  assert.strictEqual(topical('This is SPAM!', TOPICS), true)
  assert.strictEqual(topical('криптовалюта', TOPICS), true)
  assert.strictEqual(topical('antispam', TOPICS), false)
  const [a] = gIn('a', 's')
  const [h] = gIn(undefined, 's')
  const d = decideGroup(gcfg(), BOT, 's', a, 'en', 'spam again', undefined)
  assert.deepStrictEqual(d.promo, {
    text: 'Stop spam',
    url: 'https://t.me/jev_antispam_bot?start=gp2-a-ban',
    format: 'button',
  })
  assert.strictEqual(
    decideGroup(gcfg(), BOT, 's', h, 'en', 'spam', undefined).arm,
    'holdout'
  )
  assert.strictEqual(
    decideGroup(gcfg(), BOT, 's', a, 'en', 'hello', undefined),
    null
  )
  assert.strictEqual(
    decideGroup(gcfg(), BOT, 's', a, 'de', 'spam', undefined),
    null
  )
  assert.ok(decideGroup(gcfg(), BOT, 's', a, 'en', ['gp2'], undefined))
  assert.strictEqual(
    decideGroup(gcfg(), BOT, 's', a, 'en', ['gp9'], undefined),
    null
  )
  const now = Date.now()
  assert.strictEqual(
    decideGroup(gcfg(), BOT, 's', a, 'en', 'spam', now - 6 * 86400000, now)
      .promo,
    undefined
  )
  assert.strictEqual(
    decideGroup(
      gcfg({ variants: [{ id: 'a', share: 0.25, format: 'caption' }] }),
      BOT,
      's',
      a,
      'en',
      'spam',
      undefined
    ),
    null
  )
})

test('group hook: cap per group across bots, /promos off, removed and optout, no text anywhere', async () => {
  const go = fakeGo()
  await withFetch(go, async () => {
    const store = memoryStore()
    const h = promos(BOT, store, { PROMO_TOKEN: 't' })
    const randy = promos('randy', memoryStore(), { PROMO_TOKEN: 't' })
    assert.deepStrictEqual(h.matches('spam'), []) // no config yet
    await h.refresh()
    await randy.refresh()
    const both = groups.filter((g) => {
      const x = groupArm(gcfg().campaigns[0], 'S', g)
      const y = groupArm(gcfg().campaigns[1], 'S', g)
      return x && x.id === 'a' && y && y.id === 'a'
    })
    const [a, b, c] = both
    const [ho] = gIn(undefined)
    const secret = 'my secret: this is spam'
    assert.deepStrictEqual(h.matches(secret), ['gp2'])
    assert.deepStrictEqual(h.matches('hello'), [])
    assert.strictEqual(await h.group(a, 'private', 'en', secret), null)
    assert.strictEqual(await h.group(a, 'supergroup', 'en', []), null)
    // two results at once in one group: one promo
    const [d1, d2] = await Promise.all([
      h.group(a, 'supergroup', 'en', ['gp2']),
      h.group(a, 'group', 'en', secret),
    ])
    assert.strictEqual([d1.promo, d2.promo].filter(Boolean).length, 1)
    await h.record(d1)
    await h.record(d2)
    assert.strictEqual(
      (await h.group(a, 'group', 'en', secret)).promo,
      undefined
    )
    // Randy in the same group, the same week: no button, still seen
    const r = await randy.group(a, 'supergroup', 'en', secret)
    assert.strictEqual(r.arm, 'a')
    assert.strictEqual(r.promo, undefined)
    // the go service can't say: no button, and the next reply asks again
    go.down = true
    assert.strictEqual(
      (await h.group(b, 'group', 'en', secret)).promo,
      undefined
    )
    go.down = false
    const db = await h.group(b, 'group', 'en', secret)
    assert.ok(db.promo)
    // the reply failed: released here and on the service
    h.release(db)
    await tick()
    assert.strictEqual(go.claims.has(groupKey('S', b)), false)
    const dh = await h.group(ho, 'group', 'en', secret)
    assert.strictEqual(dh.arm, 'holdout')
    await h.record(dh)
    // admins turn promos off: nothing more in that group, not even seen
    assert.strictEqual(await h.groupOn(c), true)
    assert.strictEqual(await h.setGroup(c, false), true)
    assert.strictEqual(await h.groupOn(c), false)
    assert.strictEqual(await h.group(c, 'group', 'en', secret), null)
    await h.removed(a)
    await h.removed(ho)
    await h.removed(-42) // never seen: nothing
    await h.flush()
    assert.deepStrictEqual(events(go), [
      'gp2:a:seen',
      'gp2:a:shown',
      'gp2:holdout:seen',
      'gp2:a:optout',
      'gp2:a:removed',
      'gp2:holdout:removed',
    ])
    const wire = JSON.stringify(go.sent)
    assert.ok(!wire.includes('secret') && !wire.includes(String(a).slice(1)))
    assert.ok(![...store.map.values()].join().includes('secret'))
    assert.strictEqual(String(unitOf('S', 'gp2', a)).length, 16)
  })
})

// requests.js with its database, admins and hook stood in for
const mock = (rel, exports) => {
  const p = path.join(__dirname, rel)
  require.cache[p] = { id: p, filename: p, loaded: true, exports }
}

test('a vote: topics matched when it starts, the button under its result', async () => {
  const asked = []
  const recorded = []
  const released = []
  let decision = null
  let hits = ['gp2']
  mock('promoHook.js', {
    matches: (text) => {
      asked.push(['matches', text])
      return hits
    },
    group: async (...args) => {
      asked.push(['group', ...args])
      return decision
    },
    record: async (d, shown = true) =>
      void recorded.push(shown ? d : ['unshown', d]),
    release: (d) => void released.push(d),
  })
  mock('goldenBorodutchSubCount.js', { isOver10000: () => false })
  const user = (id) => ({
    id,
    username: `u${id}`,
    realNameWithHTML: async () => `u${id}`,
  })
  const chat = {
    id: -1001234,
    type: 'supergroup',
    language: 'en',
    last_ban: new Date(0),
    seconds_between_bans: 0,
    required_voters_count: 1,
    save: async () => undefined,
  }
  let n = 0
  mock('db.js', {
    findChat: async () => chat,
    findUser: async (from) => user(from.id),
    createRequest: async (r) => ({
      ...r,
      _id: `req${++n}`,
      save: async () => undefined,
    }),
  })
  mock('admins.js', {
    isBotAdmin: async () => true,
    isAdmin: async () => false,
  })
  delete require.cache[path.join(__dirname, 'requests.js')]
  const requests = require('./requests')
  const calls = []
  let failEdit = false
  const bot = {
    sendMessage: async (id) => {
      calls.push(['send', id])
      return { chat: { id }, message_id: 5 }
    },
    editMessageText: async (text, options) => {
      calls.push(['edit', text, options])
      // node-telegram-bot-api's errors carry Telegram's answer
      const refused = (description) =>
        Object.assign(new Error(`ETELEGRAM: 400 ${description}`), {
          code: 'ETELEGRAM',
          response: { body: { ok: false, error_code: 400, description } },
        })
      if (failEdit === 'all')
        throw refused('Bad Request: message to edit not found')
      if (failEdit === 'timeout') throw new Error('EFATAL: ETIMEDOUT')
      if (failEdit === 'button' && options.reply_markup)
        throw refused('Bad Request: BUTTON_URL_INVALID')
      return true
    },
    kickChatMember: () => Promise.resolve(),
    deleteMessage: () => Promise.resolve(),
  }
  const msg = {
    chat: { id: chat.id, type: 'supergroup' },
    from: { id: 1 },
    text: '@banofbot',
    reply_to_message: {
      chat: { id: chat.id },
      message_id: 4,
      from: { id: 2 },
      caption: 'cheap crypto, dm me',
    },
  }
  await requests.startRequest(bot, msg)
  assert.deepStrictEqual(asked[0], [
    'matches',
    'cheap crypto, dm me\n@banofbot',
  ])
  // only the campaign ids are kept until the result, never the text
  assert.deepStrictEqual(
    [...requests.voteTopics.entries()],
    [['req1', ['gp2']]]
  )
  const finish = (id) =>
    requests.finishRequest(bot, {
      _id: id,
      chat,
      candidate: user(2),
      voters_ban: [user(1)],
      voters_noban: [],
      inline_chat_id: chat.id,
      inline_message_id: 5,
    })
  decision = {
    campaign: 'gp2',
    arm: 'a',
    unit: '0123456789abcdef',
    promo: {
      text: 'Stop spam',
      url: 'https://t.me/jev_antispam_bot?start=gp2-a-ban',
      format: 'button',
    },
  }
  await finish('req1')
  assert.deepStrictEqual(asked[1], [
    'group',
    chat.id,
    'supergroup',
    'en',
    ['gp2'],
  ])
  const edit = calls[calls.length - 1]
  assert.deepStrictEqual(JSON.parse(edit[2].reply_markup), {
    inline_keyboard: [[{ text: 'Stop spam', url: decision.promo.url }]],
  })
  assert.deepStrictEqual(recorded, [decision])
  assert.strictEqual(requests.voteTopics.size, 0)
  // a vote whose messages matched nothing: no question asked, no keyboard
  hits = []
  await requests.startRequest(bot, {
    ...msg,
    reply_to_message: { ...msg.reply_to_message, caption: 'hi' },
  })
  assert.strictEqual(requests.voteTopics.size, 0)
  const before = asked.length
  await finish('req2')
  assert.strictEqual(asked.length, before)
  assert.strictEqual(calls[calls.length - 1][2].reply_markup, undefined)
  // the result failed to go out, with and without the button: the claim is
  // released, nothing recorded
  requests.voteTopics.set('req3', ['gp2'])
  failEdit = 'all'
  let tries = calls.length
  await assert.rejects(finish('req3'))
  assert.deepStrictEqual(released, [decision])
  assert.strictEqual(recorded.length, 2) // req1's decision and req2's null
  assert.strictEqual(calls.length - tries, 2)
  assert.strictEqual(calls[calls.length - 1][2].reply_markup, undefined)
  // Telegram refused only the button: the result goes out without it,
  // recorded as not shown (the group's cap isn't used up)
  requests.voteTopics.set('req4', ['gp2'])
  failEdit = 'button'
  tries = calls.length
  await finish('req4')
  assert.strictEqual(calls.length - tries, 2)
  assert.ok(calls[calls.length - 2][2].reply_markup)
  assert.strictEqual(calls[calls.length - 1][2].reply_markup, undefined)
  assert.deepStrictEqual(recorded[recorded.length - 1], ['unshown', decision])
  assert.deepStrictEqual(released, [decision])
  // any other error (it may have gone through): no second try, released
  requests.voteTopics.set('req5', ['gp2'])
  failEdit = 'timeout'
  tries = calls.length
  await assert.rejects(finish('req5'))
  assert.strictEqual(calls.length - tries, 1)
  assert.deepStrictEqual(released, [decision, decision])
})

test('/promos: status for anyone, on/off for group admins, groups only', async () => {
  let on = true
  const set = []
  mock('promoHook.js', {
    groupOn: async () => on,
    setGroup: async (chat, value) => {
      set.push([chat, value])
      on = value
      return true
    },
  })
  let admin = false
  mock('admins.js', { isAdmin: async () => admin })
  delete require.cache[path.join(__dirname, 'promos.js')]
  const promosCommand = require('./promos')
  const replies = []
  const bot = { sendMessage: async (id, text) => void replies.push(text) }
  const run = (text, over = {}) =>
    promosCommand.sendPromos(
      bot,
      {
        chat: { id: -100, type: 'supergroup' },
        from: { id: 1 },
        text,
        ...over,
      },
      { id: -100, language: 'en' }
    )
  await run('/promos')
  assert.match(replies.pop(), /^📣/)
  await run('/promos off')
  assert.match(replies.pop(), /^👮/)
  assert.deepStrictEqual(set, [])
  admin = true
  await run('/promos@banofbot off')
  assert.match(replies.pop(), /^🔕 Done/)
  assert.deepStrictEqual(set, [[-100, false]])
  admin = false
  // an anonymous admin (the group posting as itself)
  await run('/promos ON', { sender_chat: { id: -100 } })
  assert.match(replies.pop(), /^📣 Done/)
  await run('/promos off', { chat: { id: 5, type: 'private' } })
  assert.match(replies.pop(), /group chats/)
  await promosCommand.sendPrivacy(bot, { id: -100, language: 'ru' })
  assert.match(
    replies.pop(),
    /никогда не сохраняется[\s\S]*privacy\.borodutch\.com$/
  )
})

test('/promos and /privacy: a failed answer is logged, never a rejection', async () => {
  mock('promoHook.js', {
    groupOn: async () => {
      throw new Error('store down')
    },
    setGroup: async () => true,
  })
  mock('admins.js', { isAdmin: async () => true })
  delete require.cache[path.join(__dirname, 'promos.js')]
  const promosCommand = require('./promos')
  const unhandled = []
  const onUnhandled = (err) => unhandled.push(err)
  process.on('unhandledRejection', onUnhandled)
  const logged = []
  const { error } = console
  console.error = (...args) => logged.push(args.join(' '))
  try {
    let sends = 0
    const bot = {
      sendMessage: async () => {
        sends += 1
        throw new Error('429: Too Many Requests')
      },
    }
    const msg = (text) => ({
      chat: { id: -100, type: 'supergroup' },
      from: { id: 1 },
      text,
    })
    const chat = { id: -100, language: 'en' }
    // the reply fails (status, on, off) or the store does (status)
    await promosCommand.sendPromos(bot, msg('/promos off'), chat)
    await promosCommand.sendPromos(bot, msg('/promos on'), chat)
    await promosCommand.sendPromos(bot, msg('/promos'), chat)
    await promosCommand.sendPrivacy(bot, chat)
    await new Promise((resolve) => setImmediate(resolve))
    assert.strictEqual(sends, 3)
    assert.deepStrictEqual(unhandled, [])
    assert.deepStrictEqual(logged, [
      '/promos failed: 429: Too Many Requests',
      '/promos failed: 429: Too Many Requests',
      '/promos failed: store down',
      '/privacy failed: 429: Too Many Requests',
    ])
  } finally {
    console.error = error
    process.off('unhandledRejection', onUnhandled)
  }
})
