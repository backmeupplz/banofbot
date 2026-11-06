/**
 * Prime Radiant's reply-promo hook: a JS port of the shared copy in
 * backmeupplz/prime-radiant go/promo.ts (#482, with group mode). Change it there
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
 * Groups (approvals.md, 2026-11-06): only campaigns with chats ["group"], only
 * as a button on a reply the bot already sends there (Banofbot: a vote's
 * result), and only when the message it answers matches one of the campaign's
 * topic keywords. The text is matched in memory and never kept or logged. The
 * unit is the group: its arm comes from a salted hash of the group id, events
 * carry a salted group hash, at most one promo per group per 7 days across all
 * the bots (each promo is claimed on the go service, POST /go/group, by a
 * salted group hash that isn't per campaign), and a group admin can turn
 * promos off for the group (/promos off: optout). The bot being removed from
 * a group (left or kicked) is reported as removed, in the group's arm, so harm
 * is treatment groups against holdout groups.
 *
 * @module promo
 * @license MIT
 */

const { createHash } = require('crypto')

const STALE = 3600000
const DAY = 86400000
const WEEK = 7 * DAY
const GROUP_DAYS = 7

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

// Variants take their shares from 0 up, the rest is holdout
function pick(c, b) {
  let edge = 0
  for (const v of c.variants) if (b < (edge += v.share)) return v
  return undefined
}

// The user's arm
const arm = (c, user) => pick(c, bucket(c.id, user))

// A group's arm: by a salted hash of the group id
const groupArm = (c, salt, chat) =>
  pick(
    c,
    parseInt(sha(`${salt}:group:${c.id}:${chat}`).slice(0, 8), 16) / 2 ** 32
  )

// The salted hash events carry for a user (or, in groups, the group)
const unitOf = (salt, campaign, user) =>
  sha(`${salt}:${campaign}:${user}`).slice(0, 16)

// The group's key for the cap across bots: salted (the salt is the same in
// every bot), the same for every campaign
const groupKey = (salt, chat) => sha(`${salt}:group:${chat}`).slice(0, 16)

// Telegram's chat types as campaigns name them: a supergroup is a group too
const chatKind = (type) => (type === 'supergroup' ? 'group' : type)

const LETTER = new RegExp('[\\p{L}\\p{N}_]', 'u')
const fold = (s) => s.normalize('NFKC').toLowerCase().replace(/ё/g, 'е')

// Whether a message touches one of a campaign's topic keywords (any language):
// a keyword matches at the start of a word, so "download" finds "downloading"
// and "youtu.be" finds a link. Case- and ё-insensitive. Pure: the text is
// neither kept nor logged.
function topical(text, topics) {
  if (!text || !topics) return false
  const t = fold(text)
  for (const lang of Object.keys(topics))
    for (const word of topics[lang] || []) {
      const k = fold(word).trim()
      if (!k) continue
      for (let i = t.indexOf(k); i >= 0; i = t.indexOf(k, i + 1))
        if (i === 0 || !LETTER.test(t.charAt(i - 1))) return true
    }
  return false
}

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

const enabled = (cfg, bot) =>
  !!cfg && !!cfg.bots && !!cfg.bots[bot] && cfg.bots[bot].enabled === true

// What to do for one reply: null = not in any experiment (log nothing)
function decide(cfg, bot, salt, user, chat, code, lastShown, now = Date.now()) {
  // groups only through decideGroup (topics, the group's arm)
  if (!salt || !enabled(cfg, bot) || chatKind(chat) === 'group') return null
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

// The group campaigns this bot runs
const groupCampaigns = (cfg, bot) =>
  cfg.campaigns.filter((c) => usable(cfg, bot, c) && c.chats.includes('group'))

// What to do for one reply in a group: null = the message matches no group
// campaign's topics (log nothing). text is the message the reply answers, or
// the ids of the campaigns it matched earlier (matches(), for a reply that
// goes out later). lastShown is the group's last promo from any campaign: at
// most one per GROUP_DAYS (or the campaign's cap_days if longer).
function decideGroup(
  cfg,
  bot,
  salt,
  chat,
  code,
  text,
  lastShown,
  now = Date.now()
) {
  if (!salt || !chat || !enabled(cfg, bot)) return null
  const l = baseLang(code)
  const c = groupCampaigns(cfg, bot).find(
    (c) =>
      c.langs.includes(l) &&
      c.text[l] &&
      c.variants.every((v) => v.format === 'button') &&
      (Array.isArray(text) ? text.includes(c.id) : topical(text, c.topics))
  )
  if (!c) return null
  const unit = unitOf(salt, c.id, chat)
  const v = groupArm(c, salt, chat)
  if (!v) return { campaign: c.id, arm: 'holdout', unit }
  const capped =
    lastShown !== undefined &&
    now - lastShown < Math.max(c.cap_days, GROUP_DAYS) * DAY
  return {
    campaign: c.id,
    arm: v.id,
    unit,
    promo: capped
      ? undefined
      : {
          text: (v.text && v.text[l]) || c.text[l],
          url: link(cfg, bot, c, v, unit),
          format: 'button',
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
  const capUrl = url.replace(/campaigns\.json$/, 'group')
  const { fetch, AbortSignal } = global
  let cfg
  let fetched = 0
  let salt = ''
  let queue = []
  const timers = []
  // groups handed a promo in this process: two replies at once still get one.
  // A reservation until record() says the button went out (then it's stored
  // as group-shown) or release() says it didn't.
  const recent = new Map()
  const pending = new WeakMap()
  // removals and opt-outs that came before the config and salt were there
  let deferred = []

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
    const later = deferred
    deferred = []
    for (const e of later) await groupEvent(e.k, e.chat)
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

  // The cap across bots on the go service: claim the group's week (ok, and the
  // claim in force), or release this bot's claim when the reply didn't carry
  // the button. Throws when the service can't say.
  async function cap(chat, k, at) {
    const res = await fetch(capUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ g: groupKey(salt, chat), k, at }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`group ${res.status}`)
    return res.json()
  }
  // A group decision whose button won't go out: free the reservation here and
  // the claim on the go service
  function unclaim(p) {
    if (recent.get(p.chat) === p.at) recent.delete(p.chat)
    safe('group release', () => cap(p.chat, 'release', p.claim))
  }

  // removed or optout, in the group's arm, for each group campaign this bot
  // runs (removed only where the group was seen); kept for later while the
  // config or the salt isn't there
  async function groupEvent(k, chat) {
    const c = fresh()
    if (off || !token) return
    if (!salt || !c) {
      deferred = [...deferred, { k, chat }].slice(-5000)
      return
    }
    try {
      for (const x of c.campaigns.filter(
        (x) =>
          x.bot === bot && x.status !== 'stopped' && x.chats.includes('group')
      )) {
        const u = unitOf(salt, x.id, chat)
        if (k === 'optout' || (await store.get(`seen:${x.id}:${u}`))) {
          const a = groupArm(x, salt, chat)
          push({ c: x.id, v: a ? a.id : 'holdout', u, k })
        }
      }
    } catch (e) {
      console.error(`promo ${k}`, e.message)
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
    // After the reply went out: seen once a day per unit, shown each time.
    // shown = false: the reply went out without the promo (a group's cap
    // isn't used up then).
    async record(d, shown = true) {
      if (!d) return
      const p = pending.get(d)
      pending.delete(d)
      const promo = shown ? d.promo : undefined
      if (p && !promo) unclaim(p)
      // the button already went out: a failed store write never loses the
      // events (seen goes out again if its once-a-day mark can't be read)
      if (p && promo)
        await safe('record', () =>
          store.set(`group-shown:${p.chat}`, String(p.at))
        )
      const key = `seen:${d.campaign}:${d.unit}`
      const first = await safe('record', async () => {
        if ((await store.get(key)) === day()) return false
        await store.set(key, day())
        return true
      })
      if (first !== false)
        push({ c: d.campaign, v: d.arm, u: d.unit, k: 'seen' })
      if (promo) push({ c: d.campaign, v: d.arm, u: d.unit, k: 'shown' })
    },
    // The reply carrying a group decision never went out: no events, and the
    // group's cap isn't used up (here or across bots)
    release(d) {
      const p = d ? pending.get(d) : undefined
      if (!d || !p) return
      pending.delete(d)
      unclaim(p)
    },
    // For a reply that goes out later (a vote's result): the ids of the group
    // campaigns whose topics a message touches, to pass to group() instead of
    // the text, so the text needn't be kept. Matched in memory, never logged.
    matches(text) {
      const c = fresh()
      return c && text
        ? groupCampaigns(c, bot)
            .filter((x) => topical(text, x.topics))
            .map((x) => x.id)
        : []
    },
    // The promo for a reply about to go out in a group, or null. The text is
    // the message the reply answers, or what matches() returned for it: it is
    // only matched against the campaigns' topics, here, in memory. A promo
    // holds the group's cap in this process at once and claims the group's
    // week on the go service (no promo if another bot has it, or if the
    // service can't say), and uses it up when record() says it went out
    // (release() if the reply failed). Never throws.
    async group(chat, type, code, text) {
      if (!chat || !text || !text.length || chatKind(type) !== 'group')
        return null
      const d = await safe('group', async () => {
        const c = fresh()
        const pre = decideGroup(c, bot, salt, chat, code, text, undefined)
        if (!pre || (await store.get(`group-off:${chat}`))) return null
        if (!pre.promo) return pre
        const stored = Number((await store.get(`group-shown:${chat}`)) || NaN)
        const last =
          Math.max(Number.isNaN(stored) ? 0 : stored, recent.get(chat) || 0) ||
          undefined
        const d = decideGroup(c, bot, salt, chat, code, text, last)
        if (!d || !d.promo) return d
        const now = Date.now()
        recent.set(chat, now) // before the next await: a reply in flight sees it
        if (recent.size > 10000)
          for (const [k, t] of recent)
            if (now - t >= GROUP_DAYS * DAY) recent.delete(k)
        const got = await safe('group cap', () => cap(chat, 'claim'))
        if (got && got.ok && typeof got.at === 'number') {
          pending.set(d, { chat, at: now, claim: got.at })
          return d
        }
        // another bot showed this group a promo this week (remember when, so
        // the next replies don't ask), or the service couldn't say (ask again)
        if (recent.get(chat) === now) {
          if (got && got.ok === false && typeof got.at === 'number')
            recent.set(chat, got.at)
          else recent.delete(chat)
        }
        return { ...d, promo: undefined }
      })
      return d || null
    },
    // Whether a group's admins left promos on (/promos); undefined if the
    // store couldn't be read
    async groupOn(chat) {
      const r = await safe('group-off', async () => ({
        off: await store.get(`group-off:${chat}`),
      }))
      return r && !r.off
    },
    // A group admin turned promos off (or back on) for the group: true once
    // stored. Off reports optout in the group's arm for each group campaign.
    async setGroup(chat, on) {
      const ok = await safe('group-off', async () => {
        await store.set(`group-off:${chat}`, on ? '' : '1')
        return true
      })
      if (ok && !on) await groupEvent('optout', chat)
      return ok === true
    },
    // The bot was removed from a group (my_chat_member → left or kicked):
    // removed, in the group's arm (holdout too), for each group campaign that
    // saw the group, so harm is treatment groups against holdout groups
    async removed(chat) {
      if (chat) await groupEvent('removed', chat)
    },
    // A private chat blocked the bot (my_chat_member → kicked): one blocked
    // event per private campaign this bot runs, in the user's arm (holdout
    // too), so harm is treatment against holdout
    blocked(user) {
      const c = fresh()
      if (!user || !salt || !c) return
      for (const k of c.campaigns.filter(
        (k) =>
          k.bot === bot && k.status !== 'stopped' && !k.chats.includes('group')
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
  GROUP_DAYS,
  bucket,
  arm,
  groupArm,
  unitOf,
  groupKey,
  chatKind,
  topical,
  link,
  baseLang,
  decide,
  decideGroup,
  html,
  markdown,
  keyboard,
  promos,
  startPayload,
  mongoStore,
  memoryStore,
}
