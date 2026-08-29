# dsh-plugin-station

The plugin station for DeepSeek Harness: a code-plugin tab that lists only what
you installed, and a market that ranks honestly.

## Why

The Host's own plugin list renders one row per composition entry, and a
composition is overwhelmingly the Host. Measured on the deployment this was
written against: **153 entries, of which 3 came from a package anyone chose to
install.** The rest are `include`, `timer`, `hmr`, `typert-loader` — nobody
installed them and nobody should remove them, and they bury the three rows that
answer the question the page's title asks.

So the default is inverted: your packages, grouped by package, with the Host's
counted and folded into one line, and the state read from the **fiber phase**
rather than the disabled flag — because "enabled and failed" is the case worth
seeing, and a two-state Enabled/Disabled column cannot say it.

## The market

A star belongs to a repository while the catalog emits one entry per
subpackage, so on the 2026-08-27 snapshot `dsh-plugins` contributes 34 entries
off 8 stars, `dsh-web-ui` 19 off 9, and the single highest-starred entry is an
`examples/` directory inside an unrelated 33k-star project. Sorted raw, the
first screen belongs to whoever split their repo hardest.

- Stars are divided by sibling count; an `examples/` entry inherits none.
- Each repository keeps its best two, and the row says how many it stood in for.
- Searching turns folding off — a typed name wants every match, not a sample.
- Downloads carry the larger weight: counted per package, a monorepo cannot
  inflate them. They cannot carry it alone, since 57% of entries have none.

Above the ranking sits a short list of **picks**, each stating its reason. A
pick with no stated reason is an ad.

Remote configuration guidance lives in the separately installable
[`dsh-remote-access`](https://github.com/ChangfengHU/dsh-remote-access) plugin.
Station lists it in Market but does not bundle remote-access behavior.

## Install and remove

Both re-invoke the Host's own `dsh plugin --profile <p> add|remove`, spawned
without a shell. Neither waits on its reply: the work rewrites the profile, the
loader re-applies the composition, and this plugin's own entry is rebuilt along
with everything else, so the in-flight call is killed by the very work it asked
for. Truth comes from re-reading the profile from disk afterwards.

A removal restarts the Host without being asked. A removed plugin left running
serves a 404 for its client bundle, the whole plugin tree fails to import, and
the app stops rendering — leaving that to a click means offering a broken app
as one of the choices.

## Install

```
dsh plugin --profile web add github:ChangfengHU/dsh-plugin-station
```

Skills and MCP live in [dsh-skill-mcp-console](https://github.com/ChangfengHU/dsh-skill-mcp-console),
which this station lists among its picks. They are not plugins, and filing them
under Plugins is a category error.
