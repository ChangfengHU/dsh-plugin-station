/**
 * Remote access: why the configuration plane is empty over a domain, and how
 * to make it work anyway.
 *
 * dsh pins its privileged methods — credentials, settings, host.openPath — to
 * a loopback Host, and its client decides `isLoopback` from the browser's own
 * address bar, running the settings mirror in "memory" mode when it is false.
 * The upshot is a Plugin configuration tab that renders nothing at all over a
 * domain, with no error to explain it. That silent blank is the thing this
 * panel exists to end.
 *
 * A plugin cannot lift the fence from inside: the first gate refuses the
 * request before any plugin RPC runs, and the second is computed in the
 * browser from a hostname a plugin cannot change. So this does not pretend to
 * flip a switch. It detects which side of the fence you are on, explains the
 * consequence, and hands over the two things that actually work — an SSH
 * tunnel that needs nothing from anyone, and, for those who accept the trade,
 * a copy-paste edge configuration that opens the whole plane to whoever holds
 * the URL. The warning on that second path is not boilerplate; it is the
 * entire reason dsh keeps the fence up.
 *
 * @module dsh-plugin-station/client/RemoteAccessSection
 */

import { useMemo, useState } from 'react'
import type { T } from './ui.tsx'

/** dsh's own rule for what counts as loopback, mirrored so the panel agrees. */
function isLoopbackHostname(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '[::1]') return true
  const parts = hostname.split('.')
  return parts.length === 4 && parts[0] === '127' && parts.every(p => /^\d+$/.test(p) && Number(p) <= 255)
}

/** A block of text with a copy button — the panel's unit of "here, take this". */
function Copyable({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className="dps-copywrap">
      <div className="dps-copyhead">
        <span className="dps-dim">{label}</span>
        <button
          className="dps-btn"
          onClick={async () => {
            try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600) }
            catch { /* clipboard blocked; the text is selectable below */ }
          }}
        >{done ? '✓' : '⧉'}</button>
      </div>
      <pre className="dps-log dps-copybody">{text}</pre>
    </div>
  )
}

/**
 * The panel body.
 *
 * @param t - translator bound to this plugin's dictionary.
 */
export function RemoteAccessSection({ t }: { api: unknown; t: T }) {
  const host = typeof location !== 'undefined' ? location.hostname : 'localhost'
  const loopback = isLoopbackHostname(host)
  const [port, setPort] = useState('3080')
  const originHost = `origin-${host}`

  const worker = useMemo(() => buildWorker(host, originHost, port), [host, originHost, port])
  const sshCmd = `ssh -N -L ${port}:127.0.0.1:${port} <user>@<this-machine>`

  if (loopback) {
    return (
      <div className="dps-root">
        <div className="dps-ok-banner">{t('remoteLoopbackOk')}</div>
        <p className="dps-hint">{t('remoteLoopbackWhy')}</p>
      </div>
    )
  }

  return (
    <div className="dps-root">
      <div className="dps-restart">{t('remoteFenced', { host })}</div>
      <p className="dps-hint">{t('remoteExplain')}</p>

      <div className="dps-sect">
        <h4 className="dps-h4">{t('remoteSshTitle')}</h4>
        <p className="dps-hint">{t('remoteSshBody', { port })}</p>
        <Copyable text={sshCmd} label={t('remoteSshLabel')} />
      </div>

      <div className="dps-sect">
        <h4 className="dps-h4">{t('remoteOpenTitle')}</h4>
        <div className="dps-danger-note">{t('remoteOpenWarn')}</div>
        <p className="dps-hint">{t('remoteOpenBody', { originHost })}</p>
        <label className="dps-portrow">
          {t('remotePort')}
          <input className="dps-input dps-portinput" value={port}
            onChange={e => setPort(e.target.value.replace(/\D/g, '') || '3080')} />
        </label>
        <ol className="dps-steps">
          <li>{t('remoteStep1', { originHost, port })}</li>
          <li>{t('remoteStep2')}</li>
          <li>{t('remoteStep3', { host })}</li>
        </ol>
        <Copyable text={worker} label={t('remoteWorkerLabel')} />
        <p className="dps-hint">{t('remoteHealthNote', { host })}</p>
      </div>
    </div>
  )
}

/** The edge Worker that opens the plane, filled in for one deployment. */
function buildWorker(host: string, originHost: string, port: string): string {
  const local = `http://127.0.0.1:${port}`
  return `// Front ${host} so its loopback-pinned config plane works over the domain.
// Requires a second tunnel hostname (${originHost}) whose ingress sets
// originRequest.httpHostHeader = "127.0.0.1:${port}". This rewrites Origin to
// match, and rewrites the one client bundle whose isLoopback check keeps the
// settings mirror in "memory" mode over a domain.
//
// SECURITY: this opens credentials.set/unset, settings.mutate and
// host.openPath to anyone who reaches ${host}. That is exactly what dsh's
// fence prevents. Remove the route to close it again.
const ORIGIN_HOST = ${JSON.stringify(originHost)}
const LOCAL = ${JSON.stringify(local)}
const NEEDLE = 'isLoopback: pageLocation === void 0 || isLoopbackHostname(pageLocation.hostname)'
const PATCH = 'isLoopback: true'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/__loopback-proxy-health') {
      const probe = await fetch(\`https://\${ORIGIN_HOST}/plugins/@deepseek-ai/dsh-client-connection/client.js\`)
      const body = await probe.text()
      const ok = body.includes(NEEDLE) || body.includes(PATCH)
      return new Response(JSON.stringify({ patchAnchorFound: ok }), { status: ok ? 200 : 500 })
    }
    const target = new URL(url.pathname + url.search, \`https://\${ORIGIN_HOST}\`)
    const headers = new Headers(request.headers)
    if (headers.has('origin')) headers.set('origin', LOCAL)
    if (headers.has('referer')) headers.set('referer', LOCAL + url.pathname + url.search)
    if ((headers.get('upgrade') || '').toLowerCase() === 'websocket') {
      return fetch(new Request(target.toString(), { method: request.method, headers }))
    }
    const res = await fetch(new Request(target.toString(), {
      method: request.method, headers, body: request.body, redirect: 'manual',
    }))
    if (url.pathname.includes('/dsh-client-connection/client.js')) {
      const patched = (await res.text()).replace(NEEDLE, PATCH)
      const out = new Headers(res.headers); out.delete('content-length')
      return new Response(patched, { status: res.status, headers: out })
    }
    return res
  },
}`
}
