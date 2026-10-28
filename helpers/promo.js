/**
 * Prime Radiant's reply-promo hook: a JS port of the shared copy in
 * backmeupplz/prime-radiant go/promo.ts (commit 1fda9b2). Change it there
 * first, then here. Rules: projects/telegram-bots/cross-promo.md there.
 *
 * Campaigns live in go/campaigns.json, served at PROMO_URL; the bot re-reads it
 * every 5 minutes. Each user lands in a fixed arm per campaign (a hash of
 * campaign and user id): a variant, or the holdout that never sees a promo. A
 * variant shows its line at most once per cap_days, only in the chat types the
 * campaign names (private by default), only in a language it has text for, at
 * most one promo per reply. The bot reports, with a salted user hash (never the
 * Telegram id): seen (an eligible reply, once a day, holdout too), shown,
 * blocked (the user blocked the bot), and for people other bots' campaigns
 * bring here: start, new (the chat is new) and use (the bot's main action in
 * the 7 days after, once a day).
 *
 * Off when: PROMO=off, no PROMO_TOKEN, the config says so
 * (bots.banofbot.enabled, a campaign's status), or the config couldn't be read
 * for an hour. The salt comes from GET /go/salt with PROMO_TOKEN, so it is the
 * same in every bot and a /start in one bot joins up with a promo shown in
 * another.
 *
 * @module promo
 * @license MIT
 */

const { createHash } = require('crypto')

const STALE = 3600000
const DAY = 86400000
const WEEK = 7 * DAY

// /start payload from a campaign link: <campaign>-<variant>-<source bot code>
const ARRIVAL = /^([a-z0-9]{1,16})-([a-z0-9]{1,8})-([a-z0-9]{1,12})$/
const BOT_LINK = /^https:\/\/t\.me\/[A-Za-z0-9_]{2,29}bot$/i

const sha = (s) => createHash('sha256').update(s).digest('hex')
const day = (t = Date.now()) => new Date(t).toISOString().slice(0, 10)
const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Where a user falls in [0, 1) for a campaign: the same every time, in every bot
const bucket = (campaign, user) =>
  parseInt(sha(`${campaign}:${user}`).slice(0, 8), 16) / 2 ** 32

// The user's arm: variants take their shares from 0 up, the rest is holdout
function arm(c, user) {
  const b = bucket(c.id, user)
  let edge = 0
  for (const v of c.variants) if (b < (edge += v.share)) return v
  return undefined
}

const unitOf = (salt, campaign, user) =>
  sha(`${salt}:${campaign}:${user}`).slice(0, 16)

// The link a promo carries: a bot gets a native deep link, a channel invite
// link goes as it is, a web page goes through the /go redirect
function link(cfg, bot, c, v, unit) {
  const target = v.target !== undefined ? v.target : c.target
  if (BOT_LINK.test(target)) {
    const code = cfg.bots[bot] ? cfg.bots[bot].code : undefined
    const payload = `${c.id}-${v.id}-${code}`
    return ARRIVAL.test(payload) ? `${target}?start=${payload}` : undefined
  }
  if (/^https:\/\/t\.me\//.test(target)) return target
  return `${cfg.base}/${c.id}/${v.id}?u=${unit}`
}

const usable = (cfg, bot, c) =>
  c.bot === bot &&
  c.status === 'running' &&
  c.variants.reduce((s, v) => s + v.share, 0) < 1 &&
  c.variants.every(
    (v) => v.share > 0 && link(cfg, bot, c, v, '0') !== undefined
  )

const baseLang = (code) => (code || 'en').toLowerCase().split(/[-_]/)[0]

// What to do for one reply: null = not in any experiment (log nothing)
function decide(cfg, bot, salt, user, chat, code, lastShown, now = Date.now()) {
  if (
    !cfg ||
    !salt ||
    !cfg.bots ||
    !cfg.bots[bot] ||
    cfg.bots[bot].enabled !== true
  )
    return null
  const l = baseLang(code)
  const c = cfg.campaigns.find(
    (c) =>
      usable(cfg, bot, c) &&
      c.chats.includes(chat) &&
      c.langs.includes(l) &&
      c.text[l]
  )
  if (!c) return null
  const unit = unitOf(salt, c.id, user)
  const v = arm(c, user)
  if (!v) return { campaign: c.id, arm: 'holdout', unit }
  const last =
    typeof lastShown === 'function' ? lastShown(c.id, unit) : lastShown
  const capped = last !== undefined && now - last < c.cap_days * DAY
  return {
    campaign: c.id,
    arm: v.id,
    unit,
    promo: capped
      ? undefined
      : {
          text: (v.text && v.text[l]) || c.text[l],
          url: link(cfg, bot, c, v, unit),
          format: v.format,
        },
  }
}

// The promo as the end of an HTML message (a caption line), else ''
const html = (p) =>
  p && p.format === 'caption'
    ? `\n\n<a href="${esc(p.url)}">${esc(p.text)}</a>`
    : ''
// The same for legacy Markdown messages (promo texts carry no [ ] ( ) * _ `)
const markdown = (p) =>
  p && p.format === 'caption'
    ? `\n\n[${p.text.replace(/[[\]()*_`]/g, '')}](${p.url})`
    : ''
// reply_markup with the promo's button added as the last row (button variants)
function keyboard(p, markup) {
  if (!p || p.format !== 'button') return markup
  const rows = [
    ...((markup && markup.inline_keyboard) || []),
    [{ text: p.text, url: p.url }],
  ]
  return { ...(markup || {}), inline_keyboard: rows }
}

function promos(bot, store, env = process.env) {
  const off = env.PROMO === 'off'
  const token = env.PROMO_TOKEN || ''
  const url = env.PROMO_URL || 'https://lumen.borodutch.com/go/campaigns.json'
  // events and the salt come from next to the config, never from a host the
  // config names: the token goes with them
  const events = url.replace(/campaigns\.json$/, 'events')
  const saltUrl = url.replace(/campaigns\.json$/, `salt?bot=${bot}`)
  const { fetch, AbortSignal } = global
  let cfg
  let fetched = 0
  let salt = ''
  let queue = []
  const timers = []

  async function refresh() {
    if (off || !token) return
    try {
      if (!salt) {
        const res = await fetch(saltUrl, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        })
        if (!res.ok) throw new Error(`salt ${res.status}`)
        salt = (await res.json()).salt || ''
      }
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`${res.status}`)
      cfg = await res.json()
      fetched = Date.now()
    } catch (e) {
      console.error('promo config', e.message)
    }
  }

  async function flush() {
    if (!queue.length || !token) return
    const batch = queue
    queue = []
    try {
      const res = await fetch(events, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: batch }),
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) throw new Error(`${res.status}`)
    } catch (e) {
      console.error('promo events', e.message)
      queue = [...batch, ...queue].slice(-20000)
    }
  }

  const push = (e) => {
    queue.push({ ...e, t: Math.floor(Date.now() / 1000), b: bot })
    if (queue.length >= 500) flush()
  }
  const fresh = () => (Date.now() - fetched < STALE ? cfg : undefined)
  const safe = async (what, f) => {
    try {
      return await f()
    } catch (e) {
      console.error(`promo ${what}`, e.message)
      return undefined
    }
  }

  return {
    refresh,
    flush,
    // refresh now, then every 5 minutes; send events every minute
    start() {
      refresh()
      timers.push(setInterval(refresh, 5 * 60000), setInterval(flush, 60000))
      for (const t of timers) t.unref()
    },
    // on shutdown (the handover's drain): stop timers, send what's queued
    async stop() {
      timers.splice(0).forEach(clearInterval)
      await flush()
    },
    // The promo for a private reply about to go out, or null. It counts
    // against the cap as soon as it's handed out. Never throws.
    async decide(user, chat, code) {
      if (!user || !chat) return null
      const d = await safe('decide', async () => {
        const c = fresh()
        const pre = decide(c, bot, salt, user, chat, code, undefined)
        if (!pre || !pre.promo) return pre
        const last = Number(
          (await store.get(`shown:${pre.campaign}:${pre.unit}`)) || NaN
        )
        const d = decide(
          c,
          bot,
          salt,
          user,
          chat,
          code,
          Number.isNaN(last) ? undefined : last
        )
        if (d && d.promo)
          await store.set(`shown:${d.campaign}:${d.unit}`, String(Date.now()))
        return d
      })
      return d || null
    },
    // After the reply went out: seen once a day per user, shown each time
    async record(d) {
      if (!d) return
      await safe('record', async () => {
        const key = `seen:${d.campaign}:${d.unit}`
        if ((await store.get(key)) !== day()) {
          await store.set(key, day())
          push({ c: d.campaign, v: d.arm, u: d.unit, k: 'seen' })
        }
        if (d.promo) push({ c: d.campaign, v: d.arm, u: d.unit, k: 'shown' })
      })
    },
    // A private chat blocked the bot (my_chat_member → kicked): one blocked
    // event per campaign this bot runs, in the user's arm (holdout too)
    blocked(user) {
      const c = fresh()
      if (!user || !salt || !c) return
      for (const k of c.campaigns.filter(
        (k) => k.bot === bot && k.status !== 'stopped'
      )) {
        const a = arm(k, user)
        push({
          c: k.id,
          v: a ? a.id : 'holdout',
          u: unitOf(salt, k.id, user),
          k: 'blocked',
        })
      }
    },
    // Another bot's campaign brought this user (/start <payload>): start each
    // time (the numbers count distinct people), new when the chat is new here
    async arrived(user, payload, isNew) {
      const m = ARRIVAL.exec(payload || '')
      if (!m || !user || !salt) return
      const base = { c: m[1], v: m[2], u: unitOf(salt, m[1], user) }
      push({ ...base, k: 'start' })
      if (isNew) push({ ...base, k: 'new' })
      await safe('arrival', async () => {
        if (!(await store.get(`arrival:${user}`)))
          await store.set(
            `arrival:${user}`,
            JSON.stringify({ payload, at: Date.now() })
          )
      })
    },
    // The bot's main action in the 7 days after an arrival: use, once a day
    async used(user) {
      if (!user || !salt) return
      await safe('use', async () => {
        const raw = await store.get(`arrival:${user}`)
        if (!raw) return
        const a = JSON.parse(raw)
        if (Date.now() - a.at > WEEK || a.used === day()) return
        await store.set(
          `arrival:${user}`,
          JSON.stringify({ ...a, used: day() })
        )
        const m = ARRIVAL.exec(a.payload)
        push({ c: m[1], v: m[2], u: unitOf(salt, m[1], user), k: 'use' })
      })
    },
    // for tests
    _state: () => ({ cfg, salt, queue }),
  }
}

// /start <payload> from a message text
const startPayload = (text) => {
  const m = /^\/start(?:@\w+)?\s+(\S+)$/.exec((text || '').trim())
  return m ? m[1] : undefined
}

// A store on a MongoDB collection (mongoose: connection.collection('promos'))
const mongoStore = (col) => ({
  get: async (k) => {
    const doc = await col.findOne({ _id: k })
    return doc ? doc.v : undefined
  },
  set: async (k, v) => {
    await col.updateOne(
      { _id: k },
      { $set: { v, at: new Date() } },
      { upsert: true }
    )
  },
})

// A store in memory, for tests
const memoryStore = () => {
  const map = new Map()
  return {
    map,
    get: async (k) => map.get(k),
    set: async (k, v) => {
      map.set(k, v)
    },
  }
}

module.exports = {
  ARRIVAL,
  bucket,
  arm,
  unitOf,
  link,
  baseLang,
  decide,
  html,
  markdown,
  keyboard,
  promos,
  startPayload,
  mongoStore,
  memoryStore,
}
