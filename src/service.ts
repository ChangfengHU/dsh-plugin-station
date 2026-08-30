/**
 * The `pluginStation` Remote service: everything both panels read and every
 * mutation they make.
 *
 * Facts only. dsh's official MCP client exposes no status seam, so a server
 * row carries what is actually knowable — the entry's disabled flag, its
 * cordis fiber phase, and the tools it really registered — and says nothing
 * about whether a socket is up. A panel that prints a green dot it cannot
 * justify is worse than one that admits it does not know.
 *
 * Every write backs up first and reports where the backup went.
 *
 * @module dsh-plugin-station/service
 */

import type { Context } from '@deepseek-ai/cordis'
import { readFile, rm } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import {
  MCP_CLIENT_MODULE, fromUniversal, phaseOf, readToolPolicy, setDisabled, toUniversal, writeToolPolicy,
  type UniversalServer,
} from './mcpconfig.ts'
import { spawn } from 'node:child_process'
import { cachePath, loadCatalog, page as catalogPage, type CatalogQuery } from './catalog.ts'
import { collectPackages, detachBundleForRemoval, restoreDetachedBundle } from './plugins.ts'
import type { PluginEntryRow } from './wire.ts'

/** `mcp__<server>__<tool>` — how the official client namespaces what it registers. */

/**
 * Which profile this Host booted.
 *
 * The launcher puts it in argv (`dsh --profile web …`), and reading it back
 * is the only way a plugin learns which of several profiles it is living in.
 * Everything that writes to the profile — the patch layer, `dsh plugin add`
 * — has to agree with this, or a two-profile machine edits the wrong one.
 */
function profileName(argv: string[] = process.argv): string {
  const flag = argv.indexOf('--profile')
  const next = flag >= 0 ? argv[flag + 1] : undefined
  if (next && !next.startsWith('-')) return next
  const inline = argv.find(a => a.startsWith('--profile='))
  return inline ? inline.slice('--profile='.length) : 'web'
}

/** The booted profile's directory. */
function profileDir(home: string, profile = profileName()): string {
  return join(home, '.dsh', 'profiles', profile)
}

/** Where the profile patch layer lives. */
function patchFile(home: string, profile = profileName()): string {
  return join(profileDir(home, profile), 'cordis.patch.yml')
}

/**
 * What a package name is allowed to look like before it reaches a CLI.
 *
 * The specifier for `add` can be a URL and is checked differently; a name to
 * REMOVE is always a plain package name, and anything else reaching that
 * argument is a mistake worth refusing rather than passing along.
 */
const SAFE_PACKAGE = /^(@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*$/i

/**
 * Run `dsh plugin --profile <p> …` and report what it said.
 *
 * Installing a plugin means resolving peers, writing the lockfile, and
 * recomposing the profile, and the Host's own CLI already does all of it —
 * so this re-invokes that CLI rather than reimplementing the package manager
 * behind it. `process.argv[1]` is the launcher this Host booted from, which
 * keeps a multi-version machine on the same dsh that is running.
 *
 * No shell: arguments go to the child as an array, so a specifier can hold
 * whatever npm allows without any of it being interpreted here.
 */
function dshPlugin(args: string[], timeoutMs = 420_000): Promise<{ code: number; log: string }> {
  const launcher = process.argv[1]
  if (!launcher) throw new Error('cannot locate the dsh launcher this Host booted from')
  return new Promise(resolve => {
    const child = spawn(
      process.execPath,
      [launcher, 'plugin', '--profile', profileName(), ...args],
      { cwd: profileDir(homedir()), stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let log = ''
    const take = (chunk: Buffer) => { log += chunk.toString('utf8') }
    child.stdout?.on('data', take)
    child.stderr?.on('data', take)
    const timer = setTimeout(() => { child.kill('SIGKILL'); log += '\ntimed out' }, timeoutMs)
    child.on('error', error => { clearTimeout(timer); resolve({ code: -1, log: `${log}\n${String(error)}` }) })
    child.on('close', code => { clearTimeout(timer); resolve({ code: code ?? -1, log: log.slice(-8000) }) })
  })
}


/** Read-and-write service for both panels. */
export class PluginStationService extends TypertRemoteService {
  static inject = ['loader', 'tools']

  /** Staged install directories, keyed by the token handed to the client. */
  private readonly staged = new Map<string, { dir: string; plan: ReturnType<typeof detect> }>()
  private stageSeq = 0

    /** The specifier currently being installed, if any. See `addPlugin`. */
  private installing: string | null = null

  /**
   * @param ctx - context carrying the loader and the tool registry.
   */
  constructor(ctx: Context) {
    // The key registers the Cordis service AND names the wire namespace, so
    // it has to match the `namespace` every descriptor in ./wire.ts declares.
    super(ctx, 'pluginStation')
  }

  private get home(): string { return homedir() }

    



  // ── mcp ───────────────────────────────────────────────────────────────






  // ── install ───────────────────────────────────────────────────────────









  // ── code plugins ──────────────────────────────────────────────────────

  /**
   * The packages installed into this profile, with their live entries.
   *
   * The Host's own Plugin list answers a different question — every
   * composition entry, the great majority of which are the Host itself. This
   * answers "what did I install, and is it working".
   */
  async codePlugins(): Promise<string> {
    const entries: PluginEntryRow[] = []
    for (const entry of this.ctx.loader.entries()) {
      const module = typeof entry.options.name === 'string' ? entry.options.name : ''
      if (!module) continue
      entries.push({
        id: String(entry.options.id ?? ''),
        module,
        disabled: Boolean(entry.disabled),
        fiber: phaseOf(entry.fiber),
      })
    }
    const grouped = await collectPackages(profileDir(this.home), entries)
    return JSON.stringify({ ...grouped, profile: profileName() })
  }

  /** Switch one composition entry off or back on, through the patch layer. */
  async setPluginDisabled(payload: string): Promise<string> {
    const { entryId, disabled } = JSON.parse(payload) as { entryId: string; disabled: boolean }
    const backupPath = await setEntryDisabled(patchFile(this.home), entryId, disabled)
    return JSON.stringify({ backup: backupPath })
  }

  /**
   * Remove a package from the profile by re-invoking the Host's own CLI.
   *
   * A removal is not symmetrical with an install. A newly installed package
   * simply sits inert until a restart; a newly REMOVED one leaves a fiber
   * running against files that are gone, and the browser then asks for a
   * client bundle that returns 404 — which fails the whole plugin tree and
   * takes the entire UI down, not just that plugin's menus. Measured, on
   * this deployment, by removing a plugin and reloading: "Failed to load
   * plugins … client.js failed to load", and nothing else renders.
   *
   * So the reply says the Host must restart, and the panel acts on it
   * without waiting to be told. Leaving that choice to someone means
   * offering them a broken app as one of the options.
   */
  async removePlugin(payload: string): Promise<string> {
    const { name } = JSON.parse(payload) as { name: string }
    if (!SAFE_PACKAGE.test(name)) throw new Error(`refusing to remove ${JSON.stringify(name)}`)
    if (this.installing) throw new Error(`already installing ${this.installing} — one at a time`)
    this.installing = name
    try {
      // Do this BEFORE invoking the CLI. Its successful profile rewrite can
      // recompose Cordis and destroy this service before the child emits
      // `close`, so post-success cleanup is not a reachable guarantee.
      const detached = await detachBundleForRemoval(profileDir(this.home), name)
      const result = await dshPlugin(['remove', name])
      if (result.code !== 0) {
        if (detached) await restoreDetachedBundle(detached)
        return JSON.stringify({ ...result, mustRestart: false })
      }
      return JSON.stringify({ ...result, repairedBundle: Boolean(detached), mustRestart: true })
    } finally { this.installing = null }
  }

  /**
   * One page of the market.
   *
   * The catalog is a couple of megabytes; it is fetched and cached here so
   * the browser only ever receives the page it is showing. Which packages
   * are already installed is joined in on the way out, so a card can say
   * "installed" without the panel making a second round trip.
   */
  async catalog(payload: string): Promise<string> {
    const query = JSON.parse(payload || '{}') as CatalogQuery
    const rows = await loadCatalog(this.home)
    // What the profile DECLARES is the honest answer to "do I have this".
    // The live composition lags it: a package installed a moment ago is on
    // disk and in the patch, but its fiber only exists after a restart, so
    // reading the loader alone makes a fresh install look like it failed.
    const declared = new Set<string>(Object.keys(await this.profileDependencies()))
    const live = new Set<string>()
    for (const entry of this.ctx.loader.entries()) {
      const module = typeof entry.options.name === 'string' ? entry.options.name : ''
      if (!module) continue
      live.add(module.startsWith('@') ? module.split('/').slice(0, 2).join('/') : module.split('/')[0]!)
    }
    return JSON.stringify(catalogPage(rows, query, declared, live))
  }

  /** The profile's direct dependencies, as its package.json declares them. */
  private async profileDependencies(): Promise<Record<string, string>> {
    try {
      const text = await readFile(join(profileDir(this.home), 'package.json'), 'utf8')
      return (JSON.parse(text) as { dependencies?: Record<string, string> }).dependencies ?? {}
    } catch { return {} }
  }

  /**
   * Which declared packages are not live yet — i.e. what a restart would
   * pick up.
   *
   * A newly installed package is on disk and in the composition file, but
   * its fiber only exists after the process restarts: the loader's only
   * published seam for applying one is `exit()`, described in its own types
   * as "Hook for hosts that can restart the process on full-reload
   * requests". So "installed" and "running" are genuinely two states here,
   * and a panel that collapses them leaves people waiting for something that
   * is never going to happen on its own.
   */
  async pendingRestart(): Promise<string> {
    const declared = new Set(Object.keys(await this.profileDependencies()))
    const live = new Set<string>()
    for (const entry of this.ctx.loader.entries()) {
      const module = typeof entry.options.name === 'string' ? entry.options.name : ''
      if (!module) continue
      live.add(module.startsWith('@') ? module.split('/').slice(0, 2).join('/') : module.split('/')[0]!)
    }
    // Both directions matter, and only one of them was reported before.
    // A removal leaves the package gone from disk and from the profile while
    // its fiber keeps running — menus and settings pages it registered stay
    // on screen, which reads as "the uninstall did nothing".
    return JSON.stringify({
      added: [...declared].filter(name => !live.has(name)).sort(),
      // Only things a profile could have declared count as "removed". The
      // Host's own scope never can, and neither can a built-in whose module
      // is a scheme rather than a package — `cordis:group`, `cordis:include`
      // — which is what made the bar demand a restart over entries nobody
      // installed and nobody can uninstall.
      removed: [...live]
        .filter(name => !declared.has(name) && !name.startsWith('@deepseek-ai') && !name.includes(':'))
        .sort(),
    })
  }

  /**
   * Apply the composition by restarting the Host.
   *
   * `loader.exit()` is the published request; whether anything comes back up
   * is the deployment's business — a service manager with a restart policy,
   * or a person. The reply is sent before exiting so the panel can say what
   * is about to happen rather than just losing its connection.
   */
  async restartHost(): Promise<string> {
    setTimeout(() => {
      try { (this.ctx.loader as { exit?: () => void }).exit?.() } catch { /* fall through */ }
      process.exit(0)
    }, 250)
    return JSON.stringify({ restarting: true })
  }

  /** Drop the cached catalog so the next read refetches. */
  async refreshCatalog(): Promise<string> {
    await rm(cachePath(this.home), { force: true })
    const rows = await loadCatalog(this.home)
    return JSON.stringify({ total: rows.length })
  }

  /**
   * Install a package into the profile the same way.
   *
   * Serialised on purpose. pnpm takes a lock on its content-addressable
   * store, so a second install started while one is running does not fail —
   * it blocks, silently, for as long as the first takes. A caller that gets
   * told "one at a time" can say so; a caller left waiting on a lock cannot
   * tell that apart from a hang.
   */
  async addPlugin(payload: string): Promise<string> {
    const { spec } = JSON.parse(payload) as { spec: string }
    const target = spec.trim()
    if (!target || /\s/.test(target)) throw new Error('one package specifier, no spaces')
    if (this.installing) throw new Error(`already installing ${this.installing} — one at a time`)
    this.installing = target
    try {
      const result = await dshPlugin(['add', target])
      return JSON.stringify({ ...result, restartRequired: result.code === 0 })
    } finally { this.installing = null }
  }
}

/** What GitHub search returns, of the fields this uses. */
interface GithubRepo {
  full_name: string
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
}

/** Where the server lives, as one display string, with credentials removed. */
function targetOf(config: Record<string, unknown>): string {
  if (typeof config.url === 'string') return config.url.replace(/\/\/[^@/]+@/, '//••••@')
  const command = typeof config.command === 'string' ? config.command : ''
  const args = Array.isArray(config.args) ? config.args.filter(a => typeof a === 'string') : []
  return [command, ...args].join(' ').trim() || '—'
}

/** Read one file, for callers that only need the text. */
export async function readText(file: string): Promise<string> {
  return readFile(file, 'utf8')
}
