// node --test helpers/promo.test.js: the reply-promo hook (a port of
// prime-radiant go/promo.test.ts)
const test = require('node:test')
const assert = require('node:assert')
const {
  arm,
  decide,
  html,
  keyboard,
  markdown,
  memoryStore,
  promos,
  startPayload,
  unitOf,
} = require('./promo')

const BOT = 'banofbot'
const cfg = (over = {}, enabled = true) => ({
  base: 'https://lumen.borodutch.com/go',
  bots: { [BOT]: { enabled, code: 'ban' } },
  campaigns: [
    {
      id: 'p1',
      bot: BOT,
      status: 'running',
      target: 'https://t.me/voicybot',
      chats: ['private'],
      cap_days: 7,
      langs: ['en', 'ru'],
      text: { en: 'Voice to text', ru: 'Голос в текст' },
      variants: [
        { id: 'a', share: 0.1, format: 'caption' },
        {
          id: 'b',
          share: 0.1,
          format: 'button',
          text: { en: 'Btn', ru: 'Кн' },
        },
      ],
      ...over,
    },
  ],
})
const users = Array.from({ length: 20000 }, (_, i) => 1000 + i)
const inArm = (id) =>
  users.find((u) => {
    const a = arm(cfg().campaigns[0], u)
    return (a ? a.id : undefined) === id
  })

test('arms are fixed per user and keep a holdout', () => {
  const n = { a: 0, b: 0, holdout: 0 }
  for (const u of users) {
    const a = arm(cfg().campaigns[0], u)
    n[a ? a.id : 'holdout']++
  }
  assert.ok(Math.abs(n.a / users.length - 0.1) < 0.01)
  assert.ok(Math.abs(n.holdout / users.length - 0.8) < 0.01)
})

test('decide: links, languages, chats, caps, switches', () => {
  const a = decide(cfg(), BOT, 's', inArm('a'), 'private', 'en-GB', undefined)
  assert.deepStrictEqual(a.promo, {
    text: 'Voice to text',
    url: 'https://t.me/voicybot?start=p1-a-ban',
    format: 'caption',
  })
  assert.strictEqual(
    decide(cfg(), BOT, 's', inArm('b'), 'private', 'ru').promo.text,
    'Кн'
  )
  const web = decide(
    cfg({ target: 'https://todorant.com' }),
    BOT,
    's',
    inArm('a'),
    'private',
    'en'
  )
  assert.strictEqual(
    web.promo.url,
    `https://lumen.borodutch.com/go/p1/a?u=${web.unit}`
  )
  assert.strictEqual(
    decide(cfg(), BOT, 's', inArm(undefined), 'private', 'en').arm,
    'holdout'
  )
  assert.strictEqual(decide(cfg(), BOT, 's', inArm('a'), 'group', 'en'), null)
  assert.strictEqual(decide(cfg(), BOT, 's', inArm('a'), 'private', 'de'), null)
  assert.strictEqual(
    decide(cfg({}, false), BOT, 's', inArm('a'), 'private', 'en'),
    null
  )
  assert.strictEqual(
    decide(cfg({ status: 'paused' }), BOT, 's', inArm('a'), 'private', 'en'),
    null
  )
  assert.strictEqual(
    decide(cfg({ bot: 'voicy' }), BOT, 's', inArm('a'), 'private', 'en'),
    null
  )
  assert.strictEqual(decide(cfg(), BOT, '', inArm('a'), 'private', 'en'), null)
  const now = Date.now()
  assert.strictEqual(
    decide(
      cfg(),
      BOT,
      's',
      inArm('a'),
      'private',
      'en',
      now - 6 * 86400000,
      now
    ).promo,
    undefined
  )
  assert.ok(
    decide(
      cfg(),
      BOT,
      's',
      inArm('a'),
      'private',
      'en',
      now - 8 * 86400000,
      now
    ).promo
  )
})

test('rendering', () => {
  const p = {
    text: 'A & <b>',
    url: 'https://t.me/x?start=a"b',
    format: 'caption',
  }
  assert.strictEqual(
    html(p),
    '\n\n<a href="https://t.me/x?start=a&quot;b">A &amp; &lt;b&gt;</a>'
  )
  assert.strictEqual(
    markdown({ ...p, text: 'Hi [x]_' }),
    '\n\n[Hi x](https://t.me/x?start=a"b)'
  )
  assert.strictEqual(html(undefined) + markdown({ ...p, format: 'button' }), '')
  const k = keyboard(
    { ...p, format: 'button' },
    { inline_keyboard: [[{ text: 'x', callback_data: 'y' }]] }
  )
  assert.strictEqual(k.inline_keyboard.length, 2)
  assert.strictEqual(keyboard(p, undefined), undefined)
  assert.strictEqual(startPayload('/start p1-a-vdb'), 'p1-a-vdb')
  assert.strictEqual(startPayload('/start@banofbot  xp1-b-vdb '), 'xp1-b-vdb')
})

test('hook: salt from /go/salt, cap kept in the store, events batched', async () => {
  const sent = []
  const real = global.fetch
  const json = (o) => new global.Response(JSON.stringify(o))
  global.fetch = async (url, init) => {
    sent.push({ url, body: init && init.body })
    if (url.includes('/salt?bot=banofbot')) return json({ salt: 'S' })
    if (url.endsWith('campaigns.json')) return json(cfg())
    return json({ stored: 1 })
  }
  try {
    const store = memoryStore()
    const h = promos(BOT, store, { PROMO_TOKEN: 't' })
    assert.strictEqual(await h.decide(inArm('a'), 'private', 'en'), null) // no config yet
    await h.refresh()
    const d = await h.decide(inArm('a'), 'private', 'en')
    assert.ok(d.promo)
    assert.strictEqual(d.unit, unitOf('S', 'p1', inArm('a')))
    await h.record(d)
    assert.strictEqual(
      (await h.decide(inArm('a'), 'private', 'en')).promo,
      undefined
    ) // capped
    const ho = await h.decide(inArm(undefined), 'private', 'en')
    await h.record(ho)
    await h.record(ho) // seen once a day
    h.blocked(inArm(undefined))
    await h.arrived(77, 'xp1-a-vdb', true)
    await h.used(77)
    await h.used(77) // once a day
    await h.arrived(78, 'not a payload', true)
    await h.flush()
    const ev = JSON.parse(sent[sent.length - 1].body).events.map(
      (e) => `${e.v}:${e.k}`
    )
    assert.deepStrictEqual(ev, [
      'a:seen',
      'a:shown',
      'holdout:seen',
      'holdout:blocked',
      'a:start',
      'a:new',
      'a:use',
    ])
    assert.strictEqual(sent.filter((s) => s.url.includes('/salt')).length, 1)
    // off without a token
    assert.strictEqual(
      await promos(BOT, store, {}).decide(1, 'private', 'en'),
      null
    )
  } finally {
    global.fetch = real
  }
})
