/**
 * Browser half: mounts the `pluginStation` Remote contribution and
 * registers two TOP-LEVEL Settings sections.
 *
 * `settings.section` is the deliberate choice. The same panels registered
 * into `settings.plugins.tab` would sit two clicks deep inside Settings →
 * Plugins, which is where the ecosystem's other capability panels live and
 * why people report not finding them.
 *
 * @module dsh-plugin-station/client
 */

import type { CatalogPage, DirectoryEntry, InstallCandidate, InstallPlan, McpRow, PackageRow, SkillRow, SkillState, VerifyCheck } from '../wire.ts'
import { MarketSection, type MarketApi } from './MarketSection.tsx'
import { PluginsSection, type PluginsApi } from './PluginsSection.tsx'
import { RemoteAccessSection } from './RemoteAccessSection.tsx'
import { en, zh, type ConsoleLocaleKey } from './locales.ts'
import { CONSOLE_REMOTE, unwrap } from './remote.ts'
import { installStyles } from './styles.ts'
import { fill } from './ui.tsx'

export { PluginsSection } from './PluginsSection.tsx'
export { MarketSection } from './MarketSection.tsx'
export type { ConsoleLocaleKey }

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.pluginStation'

/** Matches the package name, the graph row id, and the bundle id. */
export const name = 'dsh-plugin-station'

/** `remote.pluginStation` appears once this plugin mounts its contribution. */
export const inject = ['slots', 'locale', 'remote']

/**
 * Client plugin body: dictionaries, stylesheet, Remote mount, two sections.
 *
 * @param ctx - client root context.
 */
export async function apply(ctx: any): Promise<void> {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'plugin-station: dictionaries')
  ctx.effect(() => installStyles(), 'plugin-station: stylesheet')

  await ctx.remote.$mount(CONSOLE_REMOTE)

  const bound = ctx.locale.bind(NS)
  /** Translate, then substitute `{placeholders}`. */
  const t = (key: ConsoleLocaleKey, params?: Record<string, string | number>) => fill(String(bound(key) ?? key), params)

  const remote = () => ctx.get('remote.pluginStation')
  const call = async <T,>(method: string, payload?: unknown): Promise<T> => {
    const service = remote()
    const result = payload === undefined ? await service[method]() : await service[method](JSON.stringify(payload))
    return JSON.parse(unwrap<string>(result, method)) as T
  }

  const pluginsApi: PluginsApi = {
    codePlugins: () => call<{ installed: PackageRow[]; builtinEntries: number; builtinPackages: number; profile: string }>('codePlugins'),
    setPluginDisabled: async (entryId, disabled) => { await call('setPluginDisabled', { entryId, disabled }) },
    removePlugin: name_ => call<{ code: number; log: string }>('removePlugin', { name: name_ }),
    addPlugin: spec => call<{ code: number; log: string }>('addPlugin', { spec }),
    pendingRestart: () => call<{ added: string[]; removed: string[] }>('pendingRestart'),
    restartHost: () => call<{ restarting: boolean }>('restartHost'),
  }

  const marketApi: MarketApi = {
    catalog: q => call<CatalogPage>('catalog', q),
    refreshCatalog: () => call<{ total: number }>('refreshCatalog'),
    addPlugin: spec => call<{ code: number; log: string; restartRequired?: boolean }>('addPlugin', { spec }),
    pendingRestart: () => call<{ added: string[]; removed: string[] }>('pendingRestart'),
    restartHost: () => call<{ restarting: boolean }>('restartHost'),
  }

  // The market gets its own tab beside the installed list — browsing and
  // managing are different jobs, and mixing them is what makes the Host's
  // own page hard to read.
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'plugin-station-market',
    order: 31,
    label: () => t('marketNav'),
    locale: NS,
    inject: () => ({ api: marketApi, t }),
  }, MarketSection))

  // Remote access: the one panel that is useful precisely when the rest of
  // this page cannot load. It reads its own state from the address bar, so it
  // needs no host seam.
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'plugin-station-remote',
    order: 32,
    label: () => t('remoteNav'),
    locale: NS,
    inject: () => ({ api: null, t }),
  }, RemoteAccessSection))

  // A tab on the Host's own Plugins page, not another top-level entry: code
  // plugins belong there, and the Host publishes this slot for exactly this.
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'plugin-station-code-plugins',
    order: 30,
    label: () => t('codePluginsNav'),
    locale: NS,
    inject: () => ({ api: pluginsApi, t }),
  }, PluginsSection))

}

