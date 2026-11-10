/** Fetch the live boot graph early without changing module execution or activation. */
export function bootPreloadMarkup(graph: { entries?: ReadonlyArray<{ url: string }> }): string {
  const seen = new Set<string>()
  const links: string[] = []
  for (const entry of graph.entries ?? []) {
    if (typeof entry.url !== 'string' || !entry.url.startsWith('/plugins/') || /[\r\n\\]/.test(entry.url)) continue
    const url = new URL(entry.url, 'https://dsh.invalid')
    if (url.origin !== 'https://dsh.invalid' || !url.pathname.startsWith('/plugins/') || !url.pathname.endsWith('/client.js') || !url.searchParams.get('rev') || url.hash) continue
    if (seen.has(url.href)) continue
    seen.add(url.href)
    const href = (url.pathname + url.search).replace(/[&"<>']/g, c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;', "'": '&#39;' })[c]!)
    const priority = /dsh-client-(modules|runtime)\/client\.js$/.test(url.pathname) ? 'high' : 'low'
    links.push('<link rel="preload" as="script" href="' + href + '" fetchpriority="' + priority + '">')
  }
  return links.join('')
}
