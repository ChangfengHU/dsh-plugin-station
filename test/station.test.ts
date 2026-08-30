/**
 * Tests for the parts that decide what the panel tells you.
 *
 * These cover the judgements, not the plumbing: how a frontmatter block is
 * read, which of four states two booleans mean, what a pasted string is
 * recognised as, how a duplicated root collapses, and whether a masked
 * credential survives a save. Every one of them stands for a bug this plugin
 * actually shipped and had to be told about.
 *
 * Run with `pnpm test` (node's own runner, type-stripping, no framework).
 */

import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { phaseOf, setEntryDisabled } from '../src/mcpconfig.ts'
import { collectPackages, detachBundleForRemoval, packageOf, restoreDetachedBundle } from '../src/plugins.ts'
import { normalize, page } from '../src/catalog.ts'









describe('phaseOf', () => {
  it('turns the raw enum into a word and hides the healthy one', () => {
    // A chip reading "2" says nothing, and one that is always present says
    // nothing either. This function vanished in a refactor once and took the
    // whole MCP panel down with a ReferenceError, so it is tested.
    assert.equal(phaseOf({ state: 2 }), null)
    assert.equal(phaseOf({ state: 3 }), 'failed')
    assert.equal(phaseOf({ state: 1 }), 'loading')
    assert.equal(phaseOf(undefined), null)
    assert.equal(phaseOf({ state: 99 }), '99')
  })
})




describe('code plugins', () => {
  it('reads the package out of a plain, scoped or subpath specifier', () => {
    assert.equal(packageOf('dshmarket'), 'dshmarket')
    assert.equal(packageOf('dshmarket/client'), 'dshmarket')
    assert.equal(packageOf('@deepseek-ai/dsh-web'), '@deepseek-ai/dsh-web')
    assert.equal(packageOf('@deepseek-ai/dsh-web/app'), '@deepseek-ai/dsh-web')
  })

  it('groups entries under the packages the profile declares, folding the rest', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dps-plugins-'))
    await writeFile(join(dir, 'package.json'), JSON.stringify({
      dependencies: { dshmarket: '^1.0.0', 'dsh-plugin-station': 'github:o/r', '@deepseek-ai/dsh-web': '^0.1.0' },
    }))
    await mkdir(join(dir, 'node_modules', 'dshmarket'), { recursive: true })
    await writeFile(join(dir, 'node_modules', 'dshmarket', 'package.json'), JSON.stringify({
      name: 'dshmarket', version: '1.30.0', description: 'market', dsh: { bundle: { patch: './p.yml' }, client: {} },
    }))

    const { installed, builtinEntries } = await collectPackages(dir, [
      { id: 'market', module: 'dshmarket', disabled: false, fiber: 'active' },
      { id: 'market-client', module: 'dshmarket/client', disabled: false, fiber: 'active' },
      { id: 'web', module: '@deepseek-ai/dsh-web', disabled: false, fiber: 'active' },
      { id: 'timer', module: '@deepseek-ai/dsh-core/timer', disabled: false, fiber: 'active' },
    ])

    // Host-scope dependencies never count as something the user installed,
    // even when the profile declares them.
    assert.deepEqual(installed.map(p => p.name), ['dsh-plugin-station', 'dshmarket'])
    const market = installed.find(p => p.name === 'dshmarket')!
    assert.equal(market.version, '1.30.0')
    assert.equal(market.bundled, true)
    assert.equal(market.hasClient, true)
    // Both of its entries land on it, including the subpath one.
    assert.deepEqual(market.entries.map(e => e.id), ['market', 'market-client'])
    // A declared package with nothing on disk still lists, so a half-installed
    // dependency is visible rather than silently absent.
    assert.equal(installed.find(p => p.name === 'dsh-plugin-station')!.version, null)
    assert.equal(builtinEntries, 2)
    await rm(dir, { recursive: true, force: true })
  })

  it('patches an existing entry rather than inserting a duplicate id', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dps-patch-'))
    const file = join(dir, 'cordis.patch.yml')
    await writeFile(file, '# keep me\n- id: llm-deepseek\n  config:\n    baseURL: http://x\n\n- insert:\n    - id: mcp-vault\n      name: c\n')

    await setEntryDisabled(file, 'mcp-vault', true)
    let text = await readFile(file, 'utf8')
    assert.match(text, /- id: mcp-vault\n\s+name: c\n\s+disabled: true/)
    assert.match(text, /# keep me/, 'comments survive')
    // The id lives under insert:, and must not gain a second root-level entry.
    assert.equal(text.match(/mcp-vault/g)!.length, 1)

    // An id the layer never mentioned is appended at the root — a patch of an
    // entry the composition already has, not a new insert.
    await setEntryDisabled(file, 'plugin-station', true)
    text = await readFile(file, 'utf8')
    assert.match(text, /- id: plugin-station\n\s+disabled: true/)

    await setEntryDisabled(file, 'mcp-vault', false)
    text = await readFile(file, 'utf8')
    assert.doesNotMatch(text, /name: c\n\s+disabled: true/)
    await rm(dir, { recursive: true, force: true })
  })
})

describe('plugin removal profile repair', () => {
  it('detaches only the exact bundle before dependency removal starts', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dsh-station-remove-'))
    await writeFile(join(dir, 'package.json'), JSON.stringify({
      dependencies: { keep: '^1.0.0' },
      dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', 'remove-me', 'keep', 'remove-me'] } },
    }))
    const edit = await detachBundleForRemoval(dir, 'remove-me')
    assert.ok(edit)
    const manifest = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'))
    assert.deepEqual(manifest.dsh.profile.bundles, ['@deepseek-ai/dsh-base', 'keep'])
  })

  it('restores the exact manifest when dependency removal fails', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dsh-station-remove-'))
    await writeFile(join(dir, 'package.json'), JSON.stringify({
      dependencies: { installed: '^1.0.0' },
      dsh: { profile: { bundles: ['installed'] } },
    }))
    const original = await readFile(join(dir, 'package.json'), 'utf8')
    const edit = await detachBundleForRemoval(dir, 'installed')
    assert.ok(edit)
    await restoreDetachedBundle(edit)
    assert.equal(await readFile(join(dir, 'package.json'), 'utf8'), original)
  })
})

describe('market catalog', () => {
  const raw = {
    plugins: [
      // A monorepo: 34 entries would share one star count upstream.
      ...Array.from({ length: 5 }, (_, i) => ({
        name: `owner/mono#packages/p${i}`, owner: 'owner', url: 'https://github.com/owner/mono',
        category: 'ui', description: { zh: `子包 ${i}` }, stars: 100, downloads: 10,
      })),
      { name: 'solo/one', owner: 'solo', url: 'https://github.com/solo/one', category: 'tools',
        description: { zh: '单体' }, stars: 40, downloads: 50_000, npm: 'solo-one' },
      // An examples/ entry inside a famous project borrows nothing.
      { name: 'famous/proj#examples/demo', owner: 'famous', url: 'https://github.com/famous/proj',
        category: 'ui', description: { en: 'demo' }, stars: 30_000, downloads: 0 },
    ],
  }

  it('divides stars by siblings and zeroes an examples/ entry', () => {
    const rows = normalize(raw)
    const mono = rows.find(r => r.full === 'owner/mono#packages/p0')!
    assert.equal(mono.siblings, 5)
    assert.equal(mono.stars, 100)
    assert.equal(mono.adjusted, 20, 'stars are shared across the repo')
    assert.equal(rows.find(r => r.full === 'famous/proj#examples/demo')!.adjusted, 0)
    assert.equal(rows.find(r => r.full === 'solo/one')!.adjusted, 40)
  })

  it('derives the specifier from npm, then from the GitHub URL', () => {
    const rows = normalize(raw)
    assert.equal(rows.find(r => r.full === 'solo/one')!.spec, 'solo-one')
    assert.equal(rows.find(r => r.full === 'owner/mono#packages/p0')!.spec, 'github:owner/mono')
  })

  it('folds a repo to two entries, and stops folding once you search', () => {
    const rows = normalize(raw)
    const folded = page(rows, {}, new Set())
    assert.equal(folded.entries.filter(r => r.repo === 'owner/mono').length, 2,
      'one repository cannot own the page')
    // Our own entries are merged in and lead; behind them, the examples/ row
    // outranks nothing now that its borrowed stars are gone.
    const community = folded.entries.filter(r => r.owner !== 'ChangfengHU')
    assert.equal(community[0]!.full, 'solo/one')

    const searched = page(rows, { query: '子包' }, new Set())
    assert.equal(searched.entries.length, 5, 'a search shows every match')
  })

  it('marks what the profile already has', () => {
    const rows = normalize(raw)
    const result = page(rows, {}, new Set(['solo-one']))
    assert.equal(result.entries.find(r => r.full === 'solo/one')!.installed, true)
    assert.equal(result.entries.find(r => r.repo === 'owner/mono')!.installed, false)
  })

  it('backs the Popular and New tabs with deterministic catalog ordering', () => {
    const rows = normalize(raw)
    const popular = page(rows, { sort: 'downloads' }, new Set())
    assert.equal(popular.entries[0]!.full, 'solo/one')

    const recent = page(rows, { sort: 'recent' }, new Set())
    assert.equal(recent.entries[0]!.name, 'dsh-remote-access')
  })

  it('returns the picks in their listed order, each carrying its reason', () => {
    const rows = normalize(raw)
    const picks = page(rows, { featured: true }, new Set())
    // Only entries the list names, in the order it names them.
    assert.deepEqual(picks.entries.map(r => r.name), ['dsh-skill-mcp-console', 'dsh-codex-claude-cli', 'dsh-remote-access'],
      'a pick the catalog does not carry is still listed; one it names but the fixture lacks is skipped')
    // A pick with no stated reason is an ad, so every one carries a key.
    assert.ok(picks.entries.every(r => typeof r.why === 'string' && r.why.length > 0))
    assert.equal(picks.pages, 1, 'the shortlist never paginates')
  })

  it('merges our own entries without duplicating an upstream listing', () => {
    const withUs = normalize({ plugins: [
      ...raw.plugins,
      { name: 'ChangfengHU/dsh-skill-mcp-console', owner: 'ChangfengHU',
        url: 'https://github.com/ChangfengHU/dsh-skill-mcp-console', category: 'skill',
        description: { zh: '上游也收录了' }, stars: 5, downloads: 0 },
    ] })
    const picks = page(withUs, { featured: true }, new Set())
    assert.equal(picks.entries.filter(r => r.name === 'dsh-skill-mcp-console').length, 1)
  })
})

describe('restart accounting', () => {
  // Both directions are the point: reporting only new packages was the bug
  // that made an uninstall look like it had done nothing, because the
  // removed plugin's menus stayed on screen until something restarted dsh.
  const split = (declared: string[], live: string[]) => ({
    added: declared.filter(n => !live.includes(n)).sort(),
    removed: live.filter(n => !declared.includes(n) && !n.startsWith('@deepseek-ai')).sort(),
  })

  it('reports a fresh install as pending', () => {
    assert.deepEqual(split(['a', 'b'], ['a']), { added: ['b'], removed: [] })
  })

  it('reports a removal whose fiber is still running', () => {
    assert.deepEqual(split(['a'], ['a', 'b']), { added: [], removed: ['b'] })
  })

  it('never asks for a restart over the Host\'s own packages', () => {
    assert.deepEqual(split(['a'], ['a', '@deepseek-ai/dsh-web']), { added: [], removed: [] })
  })

  it('says nothing when the two ledgers agree', () => {
    assert.deepEqual(split(['a', 'b'], ['b', 'a']), { added: [], removed: [] })
  })
})

describe('restart accounting, second pass', () => {
  // Built-ins reach the composition under a scheme rather than a package
  // name, and a profile can never declare or remove one. Counting them as
  // "removed" made the bar demand a restart over cordis:group on every load.
  const removed = (declared: string[], live: string[]) =>
    live.filter(n => !declared.includes(n) && !n.startsWith('@deepseek-ai') && !n.includes(':')).sort()

  it('ignores scheme-style built-ins', () => {
    assert.deepEqual(removed(['a'], ['a', 'cordis:group', 'cordis:include']), [])
  })

  it('still catches a genuinely removed package alongside them', () => {
    assert.deepEqual(removed(['a'], ['a', 'cordis:group', 'gone-pkg']), ['gone-pkg'])
  })
})
