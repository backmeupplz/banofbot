/**
 * Zero-downtime deploys for a long-polling bot. Tugport starts the new container next to the old one,
 * but Telegram serves one getUpdates poller at a time, so the poller holds a lock file on a volume both
 * containers mount (HANDOVER_LOCK). The new container boots, waits for the lock and starts polling as
 * soon as the old one releases it on SIGTERM (or stops refreshing it for 10 s, if it died).
 *
 * `stop` ends polling and confirms every fetched update, so the new poller never gets them again; the
 * lock is released right after it. `drain` then waits for handlers still running before the exit.
 * Without HANDOVER_LOCK (local runs) the bot polls right away.
 *
 * @module handover
 * @license MIT
 */

const fs = require('fs').promises
const { hostname } = require('os')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function pollWithHandover(start, stop, drain = async () => {}) {
  const lock = process.env.HANDOVER_LOCK
  // A restarted container keeps its hostname and pid, so it takes its own lock back at once
  const me = `${hostname()} ${process.pid}`
  const owner = () => fs.readFile(lock, 'utf8').catch(() => '')
  let beat
  if (lock) {
    for (;;) {
      const current = await owner()
      const age = await fs.stat(lock).then(
        (s) => Date.now() - s.mtimeMs,
        () => Infinity
      )
      if (!current || current === me || age > 10000) {
        await fs.writeFile(lock, me)
        // Two waiters can write at once; the last write wins
        await sleep(200)
        if ((await owner()) === me) break
      }
      await sleep(200)
    }
    beat = setInterval(() => {
      const now = new Date()
      fs.utimes(lock, now, now).catch(() => {})
    }, 1000)
    console.info('Holding the polling lock')
  }
  let stopping = false
  const shutdown = async () => {
    if (stopping) return
    stopping = true
    clearInterval(beat)
    // Tugport kills the old container 30 s after SIGTERM
    await Promise.race([stop(), sleep(10000)]).catch(console.error)
    if (lock && (await owner()) === me) await fs.unlink(lock).catch(() => {})
    await Promise.race([drain(), sleep(15000)]).catch(console.error)
    process.exit(0)
  }
  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)
  start()
}

module.exports = { pollWithHandover }
