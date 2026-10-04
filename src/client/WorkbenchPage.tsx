import { useState } from 'react'
import { MarketSection, type MarketApi } from './MarketSection.tsx'
import { PluginsSection, type PluginsApi } from './PluginsSection.tsx'
import type { T } from './ui.tsx'

type Page = 'market' | 'installed'

/** Workbench-owned framing around Station's two real management surfaces. */
export function PluginStationWorkbenchPage({ marketApi, pluginsApi, t }: {
  marketApi: MarketApi
  pluginsApi: PluginsApi
  t: T
}) {
  const [page, setPage] = useState<Page>('market')
  return (
    <section className="dps-root dps-workbench-page">
      <div className="dps-workbench-head">
        <div>
          <h2>Plugin Station</h2>
          <p>发现、安装和管理当前 DSH 实例的代码插件。</p>
        </div>
        <div className="dps-switch" role="tablist" aria-label="Plugin Station 页面">
          <button type="button" role="tab" aria-selected={page === 'market'} onClick={() => setPage('market')}>Market</button>
          <button type="button" role="tab" aria-selected={page === 'installed'} onClick={() => setPage('installed')}>Code plugins</button>
        </div>
      </div>
      {page === 'market'
        ? <MarketSection api={marketApi} t={t} />
        : <PluginsSection api={pluginsApi} t={t} />}
    </section>
  )
}
