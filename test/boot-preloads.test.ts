import assert from 'node:assert/strict'
import test from 'node:test'
import { bootPreloadMarkup } from '../src/boot-preloads.ts'

test('diagnostic and administration panels do not compete with Chat startup', () => {
  for (const id of ['dsh-context', '@deepseek-ai/dsh-client-ui-trajectory', 'dsh-plugin-station', 'dsh-skill-mcp-console']) {
    assert.equal(bootPreloadMarkup({ entries: [{ url: '/plugins/' + id + '/client.js?rev=abc' }] }), '')
  }
})

test('preloads only current same-origin revisioned scripts and deduplicates', () => {
  const script = '/plugins/example/client.js?rev=123'
  const html = bootPreloadMarkup({ entries: [{ url: script }, { url: script }, { url: '/plugins/@deepseek-ai/dsh-client-runtime/client.js?rev=456' }] })
  assert.equal((html.match(/<link /g) ?? []).length, 2)
  assert.match(html, /fetchpriority="low"/)
  assert.match(html, /fetchpriority="high"/)
  assert.doesNotMatch(html, /<script|__ModuleLoader__|async=/)
})

test('never preloads external URLs, traversal, unversioned scripts or injected markup', () => {
  for (const url of ['https://other.invalid/a.js?rev=1', '//other.invalid/client.js?rev=1', '/plugins/../secret/client.js?rev=1', '/plugins/a/client.js', '/plugins/a/file.json?rev=1', '/plugins/a/client.js?rev=1#fragment']) {
    assert.equal(bootPreloadMarkup({ entries: [{ url }] }), '')
  }
  const html = bootPreloadMarkup({ entries: [{ url: '/plugins/a/client.js?rev="><script>' }] })
  assert.doesNotMatch(html, /<script|"><script>/)
  assert.equal(bootPreloadMarkup({}), '')
})
