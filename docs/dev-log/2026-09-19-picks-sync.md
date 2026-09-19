# Picks synchronization

- Expanded the deliberately curated Picks list from two to five maintained plugins.
- Added installable GitHub entries for `dsh-task-console`, `dsh-plugin-station`, and the maintained `ChangfengHU/dsh-free-search` fork.
- Made maintained entries authoritative by package name so a community-catalog row cannot redirect a Pick to a different repository.
- Added English and Chinese recommendation reasons for every new Pick.

Verification:

- `PATH=/usr/bin:$PATH pnpm test` — 19 tests passed.
- `PATH=/usr/bin:$PATH pnpm run build` — host and browser bundles built successfully.
- All three new GitHub installation targets resolved through `git ls-remote`.
