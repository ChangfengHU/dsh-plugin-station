// src/service.ts
import { readFile as readFile4, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join as join4 } from "node:path";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// src/mcpconfig.ts
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { isMap, isSeq, parseDocument, YAMLSeq } from "yaml";
var FIBER_PHASE = {
  "0": "pending",
  "1": "loading",
  "2": "active",
  "3": "failed",
  "4": "disposed",
  "5": "unloading"
};
function phaseOf(fiber) {
  if (fiber === void 0 || fiber === null) return null;
  const phase = FIBER_PHASE[String(fiber.state)] ?? String(fiber.state);
  return phase === "active" ? null : phase;
}
async function loadPatch(file) {
  let text = "";
  try {
    text = await readFile(file, "utf8");
  } catch {
    text = "[]\n";
  }
  const doc = parseDocument(text);
  if (!isSeq(doc.contents)) doc.contents = new YAMLSeq();
  return doc;
}
async function backup(file) {
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const target = join(dirname(file), `cordis.patch.yml.dps-${stamp}`);
  await copyFile(file, target).catch(() => {
  });
  return target;
}
async function setEntryDisabled2(file, entryId, disabled) {
  const backupPath = await backup(file);
  const doc = await loadPatch(file);
  const found = findEntry(doc.contents, entryId);
  if (found) {
    if (disabled) found.set("disabled", true);
    else found.delete("disabled");
  } else if (disabled) {
    ;
    doc.contents.add(doc.createNode({ id: entryId, disabled: true }));
  } else {
    return backupPath;
  }
  await writeFile(file, doc.toString({ lineWidth: 0 }), "utf8");
  return backupPath;
}
function findEntry(seq, entryId) {
  for (const item of seq.items) {
    if (!isMap(item)) continue;
    const insert = item.get("insert", true);
    if (isSeq(insert)) {
      const nested = findEntry(insert, entryId);
      if (nested) return nested;
      continue;
    }
    if (String(item.get("id") ?? "") === entryId) return item;
  }
  return null;
}

// src/service.ts
import { spawn } from "node:child_process";

// src/catalog.ts
import { mkdir as mkdir2, readFile as readFile2, stat, writeFile as writeFile2 } from "node:fs/promises";
import { dirname as dirname2, join as join2 } from "node:path";
var CATALOG_URL = "https://awesome-dsh-plugin.com/plugins.json";
var MAX_AGE_MS = 6 * 60 * 60 * 1e3;
var FEATURED = [
  { key: "dsh-skill-mcp-console", why: "featuredSkillMcp" },
  { key: "dsh-codex-claude-cli", why: "featuredCodex" },
  { key: "dsh-better-sidebar", why: "featuredSidebar" },
  { key: "modlens", why: "featuredModlens" },
  { key: "dsh-context", why: "featuredContext" }
];
var OWN = [
  {
    name: "dsh-skill-mcp-console",
    full: "ChangfengHU/dsh-skill-mcp-console",
    repo: "ChangfengHU/dsh-skill-mcp-console",
    owner: "ChangfengHU",
    url: "https://github.com/ChangfengHU/dsh-skill-mcp-console",
    category: "skill",
    description: "\u6280\u80FD\u4E0E MCP \u4E24\u4E2A\u9876\u7EA7\u8BBE\u7F6E\u533A\uFF1A\u8DE8\u6240\u6709\u6839\u7684\u6280\u80FD\u6E05\u5355\u4E0E\u5F71\u5B50\u68C0\u6D4B\u3001\u4E09\u6001\u8C03\u7528\u7B56\u7565\u3001MCP \u5DE5\u5177\u7EA7\u5F00\u5173\uFF0C\u4EE5\u53CA\u4FDD\u7559\u6CE8\u91CA\u4E0E\u5BC6\u94A5\u7684\u901A\u7528 mcpServers \u89C6\u56FE\u3002",
    npm: null,
    tarball: null,
    stars: 0,
    adjusted: 0,
    siblings: 1,
    downloads: 0,
    added: "2026-08-28",
    spec: "github:ChangfengHU/dsh-skill-mcp-console",
    installable: true,
    score: 100
  },
  {
    name: "dsh-codex-claude-cli",
    full: "ChangfengHU/dsh-codex-claude-cli",
    repo: "ChangfengHU/dsh-codex-claude-cli",
    owner: "ChangfengHU",
    url: "https://github.com/ChangfengHU/dsh-codex-claude-cli",
    category: "model",
    description: "\u628A\u672C\u673A\u5DF2\u767B\u5F55\u7684 codex CLI \u5F53\u4F5C Harness \u7684\u6A21\u578B\u8DEF\u7531\uFF1B\u4FEE\u597D\u4E86\u4E0E Codex \u4FDD\u7559\u524D\u7F00\u51B2\u7A81\u7684 MCP \u5DE5\u5177\u540D,\u5DE5\u5177\u8C03\u7528\u771F\u80FD\u7528\u3002",
    npm: null,
    tarball: null,
    stars: 0,
    adjusted: 0,
    siblings: 1,
    downloads: 0,
    added: "2026-08-27",
    spec: "github:ChangfengHU/dsh-codex-claude-cli",
    installable: true,
    score: 100
  }
];
var PAGE_SIZE = 24;
function cachePath(home) {
  return join2(home, ".dsh", "plugin-station-catalog.json");
}
function repoOf(name2) {
  return name2.split("#")[0] ?? name2;
}
function logScore(value, ceiling) {
  if (value <= 0) return 0;
  return Math.min(100, Math.round(Math.log10(value + 1) / Math.log10(ceiling) * 100));
}
function normalize(raw) {
  const list = raw?.plugins;
  if (!Array.isArray(list)) return [];
  const siblings = /* @__PURE__ */ new Map();
  for (const item of list) {
    const name2 = typeof item.name === "string" ? item.name : "";
    if (!name2) continue;
    const repo = repoOf(name2);
    siblings.set(repo, (siblings.get(repo) ?? 0) + 1);
  }
  const rows = [];
  for (const item of list) {
    const name2 = typeof item.name === "string" ? item.name : "";
    if (!name2) continue;
    const repo = repoOf(name2);
    const family = siblings.get(repo) ?? 1;
    const stars = typeof item.stars === "number" ? item.stars : 0;
    const downloads = typeof item.downloads === "number" ? item.downloads : 0;
    const isExample = /(^|[/#])(examples?|demos?|samples?)\//i.test(name2);
    const adjusted = isExample ? 0 : Math.round(stars / family);
    const starScore = logScore(adjusted, 4e3);
    const downloadScore = logScore(downloads, 22e4);
    const install = typeof item.install === "string" ? item.install : "";
    rows.push({
      name: name2.split("#").pop()?.split("/").pop() || name2,
      full: name2,
      repo,
      owner: typeof item.owner === "string" ? item.owner : "",
      url: typeof item.url === "string" ? item.url : "",
      category: typeof item.category === "string" ? item.category : "",
      description: String(item.description?.zh || item.description?.en || ""),
      npm: typeof item.npm === "string" ? item.npm : null,
      tarball: typeof item.tarball === "string" ? item.tarball : null,
      stars,
      adjusted,
      siblings: family,
      downloads,
      added: typeof item.added === "string" ? item.added : "",
      // What a person would actually type. The upstream `install` line is
      // profile-specific text; the specifier is the part that transfers.
      spec: specOf(item),
      installable: Boolean(item.npm) || Boolean(item.url) || install !== "",
      // Downloads weigh most because they are the one signal a monorepo
      // cannot inflate; stars still count, adjusted, because 57% of entries
      // have no downloads at all and would otherwise be unrankable.
      score: Math.round(starScore * 0.4 + downloadScore * 0.6)
    });
  }
  return rows;
}
function specOf(item) {
  if (typeof item.npm === "string" && item.npm) return item.npm;
  const url = typeof item.url === "string" ? item.url : "";
  const match = /^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/.exec(url);
  if (match) return `github:${match[1]}`;
  return "";
}
async function loadCatalog(home, fetchImpl = fetch) {
  const path = cachePath(home);
  try {
    const info = await stat(path);
    if (Date.now() - info.mtimeMs < MAX_AGE_MS) {
      return JSON.parse(await readFile2(path, "utf8"));
    }
  } catch {
  }
  try {
    const response = await fetchImpl(CATALOG_URL, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const rows = normalize(await response.json());
    await mkdir2(dirname2(path), { recursive: true });
    await writeFile2(path, JSON.stringify(rows), "utf8");
    return rows;
  } catch (cause) {
    try {
      return JSON.parse(await readFile2(path, "utf8"));
    } catch {
      throw cause;
    }
  }
}
function page(rows, query, declared, live = declared) {
  const needle = (query.query ?? "").trim().toLowerCase();
  const known = new Set(rows.map((row) => row.name));
  const all = [...rows, ...OWN.filter((row) => !known.has(row.name))];
  if (query.featured) {
    const byName = new Map(all.map((row) => [row.npm ?? row.name, row]));
    const alsoByName = new Map(all.map((row) => [row.name, row]));
    const picks = [];
    for (const { key, why } of FEATURED) {
      const found = byName.get(key) ?? alsoByName.get(key);
      if (found) picks.push({ ...found, why });
    }
    return {
      entries: picks.map((row) => {
        const key = row.npm ?? row.name;
        const has = declared.has(key) || declared.has(row.name);
        return { ...row, installed: has, active: has && (live.has(key) || live.has(row.name)) };
      }),
      total: picks.length,
      page: 0,
      pages: 1,
      categories: [...new Set(all.map((row) => row.category).filter(Boolean))].sort(),
      catalogTotal: all.length
    };
  }
  let list = all.filter((row) => {
    if (query.category && query.category !== "all" && row.category !== query.category) return false;
    if (!needle) return true;
    return row.name.toLowerCase().includes(needle) || row.owner.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle);
  });
  if (query.group !== false && !needle) {
    const kept = /* @__PURE__ */ new Map();
    list = list.slice().sort((a, b) => b.score - a.score).filter((row) => {
      if (row.siblings <= 1) return true;
      const count = kept.get(row.repo) ?? 0;
      if (count >= 2) return false;
      kept.set(row.repo, count + 1);
      return true;
    });
  }
  const sorters = {
    score: (a, b) => b.score - a.score,
    downloads: (a, b) => b.downloads - a.downloads,
    stars: (a, b) => b.adjusted - a.adjusted,
    recent: (a, b) => b.added.localeCompare(a.added)
  };
  list = list.slice().sort(sorters[query.sort ?? "score"]);
  const total = list.length;
  const pageIndex = Math.max(0, query.page ?? 0);
  const slice = list.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);
  const categories = [...new Set(all.map((row) => row.category).filter(Boolean))].sort();
  return {
    entries: slice.map((row) => {
      const key = row.npm ?? row.name;
      const has = declared.has(key) || declared.has(row.name);
      return { ...row, installed: has, active: has && (live.has(key) || live.has(row.name)) };
    }),
    total,
    page: pageIndex,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    categories,
    catalogTotal: all.length
  };
}

// src/plugins.ts
import { readFile as readFile3 } from "node:fs/promises";
import { join as join3 } from "node:path";
var HOST_SCOPE = "@deepseek-ai/";
async function readJson(path) {
  try {
    return JSON.parse(await readFile3(path, "utf8"));
  } catch {
    return null;
  }
}
function packageOf(module) {
  const parts = module.split("/");
  if (module.startsWith("@")) return parts.slice(0, 2).join("/");
  return parts[0] ?? module;
}
async function collectPackages(profileDir2, entries) {
  const profile = await readJson(join3(profileDir2, "package.json"));
  const declared = Object.entries(profile?.dependencies ?? {}).filter(([name2]) => !name2.startsWith(HOST_SCOPE));
  const byPackage = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const owner = packageOf(entry.module);
    const list = byPackage.get(owner) ?? [];
    list.push(entry);
    byPackage.set(owner, list);
  }
  const installed = [];
  for (const [name2, spec] of declared) {
    const manifest = await readJson(join3(profileDir2, "node_modules", name2, "package.json"));
    const own = byPackage.get(name2) ?? [];
    installed.push({
      name: name2,
      version: typeof manifest?.version === "string" ? manifest.version : null,
      description: typeof manifest?.description === "string" ? manifest.description : "",
      // The dependency spec is the honest answer to "where did this come
      // from" — `github:owner/repo`, a tarball URL, `link:`, or a range.
      source: typeof spec === "string" ? spec : "",
      // A package with no `dsh.bundle` is a plain dependency someone added,
      // not a plugin, and saying so beats rendering it as a broken one.
      bundled: Boolean(manifest?.dsh?.bundle),
      hasClient: Boolean(manifest?.dsh?.client),
      entries: own.sort((a, b) => a.id.localeCompare(b.id))
    });
    byPackage.delete(name2);
  }
  let builtinEntries = 0;
  for (const list of byPackage.values()) builtinEntries += list.length;
  installed.sort((a, b) => a.name.localeCompare(b.name));
  return { installed, builtinEntries, builtinPackages: byPackage.size };
}

// src/service.ts
function profileName(argv = process.argv) {
  const flag = argv.indexOf("--profile");
  const next = flag >= 0 ? argv[flag + 1] : void 0;
  if (next && !next.startsWith("-")) return next;
  const inline = argv.find((a) => a.startsWith("--profile="));
  return inline ? inline.slice("--profile=".length) : "web";
}
function profileDir(home, profile = profileName()) {
  return join4(home, ".dsh", "profiles", profile);
}
function patchFile(home, profile = profileName()) {
  return join4(profileDir(home, profile), "cordis.patch.yml");
}
var SAFE_PACKAGE = /^(@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*$/i;
function dshPlugin(args, timeoutMs = 42e4) {
  const launcher = process.argv[1];
  if (!launcher) throw new Error("cannot locate the dsh launcher this Host booted from");
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [launcher, "plugin", "--profile", profileName(), ...args],
      { cwd: profileDir(homedir()), stdio: ["ignore", "pipe", "pipe"] }
    );
    let log = "";
    const take = (chunk) => {
      log += chunk.toString("utf8");
    };
    child.stdout?.on("data", take);
    child.stderr?.on("data", take);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      log += "\ntimed out";
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ code: -1, log: `${log}
${String(error)}` });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, log: log.slice(-8e3) });
    });
  });
}
var PluginStationService = class extends TypertRemoteService {
  static inject = ["loader", "tools"];
  /** Staged install directories, keyed by the token handed to the client. */
  staged = /* @__PURE__ */ new Map();
  stageSeq = 0;
  /** The specifier currently being installed, if any. See `addPlugin`. */
  installing = null;
  /**
   * @param ctx - context carrying the loader and the tool registry.
   */
  constructor(ctx) {
    super(ctx, "pluginStation");
  }
  get home() {
    return homedir();
  }
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
  async codePlugins() {
    const entries = [];
    for (const entry of this.ctx.loader.entries()) {
      const module = typeof entry.options.name === "string" ? entry.options.name : "";
      if (!module) continue;
      entries.push({
        id: String(entry.options.id ?? ""),
        module,
        disabled: Boolean(entry.disabled),
        fiber: phaseOf(entry.fiber)
      });
    }
    const grouped = await collectPackages(profileDir(this.home), entries);
    return JSON.stringify({ ...grouped, profile: profileName() });
  }
  /** Switch one composition entry off or back on, through the patch layer. */
  async setPluginDisabled(payload) {
    const { entryId, disabled } = JSON.parse(payload);
    const backupPath = await setEntryDisabled(patchFile(this.home), entryId, disabled);
    return JSON.stringify({ backup: backupPath });
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
  async removePlugin(payload) {
    const { name: name2 } = JSON.parse(payload);
    if (!SAFE_PACKAGE.test(name2)) throw new Error(`refusing to remove ${JSON.stringify(name2)}`);
    if (this.installing) throw new Error(`already installing ${this.installing} \u2014 one at a time`);
    this.installing = name2;
    try {
      const result = await dshPlugin(["remove", name2]);
      return JSON.stringify({ ...result, mustRestart: result.code === 0 });
    } finally {
      this.installing = null;
    }
  }
  /**
   * One page of the market.
   *
   * The catalog is a couple of megabytes; it is fetched and cached here so
   * the browser only ever receives the page it is showing. Which packages
   * are already installed is joined in on the way out, so a card can say
   * "installed" without the panel making a second round trip.
   */
  async catalog(payload) {
    const query = JSON.parse(payload || "{}");
    const rows = await loadCatalog(this.home);
    const declared = new Set(Object.keys(await this.profileDependencies()));
    const live = /* @__PURE__ */ new Set();
    for (const entry of this.ctx.loader.entries()) {
      const module = typeof entry.options.name === "string" ? entry.options.name : "";
      if (!module) continue;
      live.add(module.startsWith("@") ? module.split("/").slice(0, 2).join("/") : module.split("/")[0]);
    }
    return JSON.stringify(page(rows, query, declared, live));
  }
  /** The profile's direct dependencies, as its package.json declares them. */
  async profileDependencies() {
    try {
      const text = await readFile4(join4(profileDir(this.home), "package.json"), "utf8");
      return JSON.parse(text).dependencies ?? {};
    } catch {
      return {};
    }
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
  async pendingRestart() {
    const declared = new Set(Object.keys(await this.profileDependencies()));
    const live = /* @__PURE__ */ new Set();
    for (const entry of this.ctx.loader.entries()) {
      const module = typeof entry.options.name === "string" ? entry.options.name : "";
      if (!module) continue;
      live.add(module.startsWith("@") ? module.split("/").slice(0, 2).join("/") : module.split("/")[0]);
    }
    return JSON.stringify({
      added: [...declared].filter((name2) => !live.has(name2)).sort(),
      // Only things a profile could have declared count as "removed". The
      // Host's own scope never can, and neither can a built-in whose module
      // is a scheme rather than a package — `cordis:group`, `cordis:include`
      // — which is what made the bar demand a restart over entries nobody
      // installed and nobody can uninstall.
      removed: [...live].filter((name2) => !declared.has(name2) && !name2.startsWith("@deepseek-ai") && !name2.includes(":")).sort()
    });
  }
  /**
   * Apply the composition by restarting the Host.
   *
   * `loader.exit()` is the published request; whether anything comes back up
   * is the deployment's business — a service manager with a restart policy,
   * or a person. The reply is sent before exiting so the panel can say what
   * is about to happen rather than just losing its connection.
   */
  async restartHost() {
    setTimeout(() => {
      try {
        this.ctx.loader.exit?.();
      } catch {
      }
      process.exit(0);
    }, 250);
    return JSON.stringify({ restarting: true });
  }
  /** Drop the cached catalog so the next read refetches. */
  async refreshCatalog() {
    await rm(cachePath(this.home), { force: true });
    const rows = await loadCatalog(this.home);
    return JSON.stringify({ total: rows.length });
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
  async addPlugin(payload) {
    const { spec } = JSON.parse(payload);
    const target = spec.trim();
    if (!target || /\s/.test(target)) throw new Error("one package specifier, no spaces");
    if (this.installing) throw new Error(`already installing ${this.installing} \u2014 one at a time`);
    this.installing = target;
    try {
      const result = await dshPlugin(["add", target]);
      return JSON.stringify({ ...result, restartRequired: result.code === 0 });
    } finally {
      this.installing = null;
    }
  }
};

// src/wire.ts
import { z } from "zod";
var PKG = "dsh-plugin-station";
function jsonParam(name2) {
  return Object.freeze({
    name: name2,
    wire: name2,
    source: "json",
    codec: Object.freeze({ mode: "strict", typeSymbol: `${PKG}/types#Json`, schema: z.string() })
  });
}
var JSON_RESULT = Object.freeze({ mode: "strict", typeSymbol: `${PKG}/types#Json`, schema: z.string() });
function descriptor(method, argc) {
  return Object.freeze({
    id: `${PKG}#pluginStation/${method}`,
    service: "pluginStation",
    namespace: "pluginStation",
    method,
    invocation: Object.freeze({ kind: "direct" }),
    parameters: Object.freeze(argc === 1 ? [jsonParam("payload")] : []),
    result: JSON_RESULT,
    sourceLocation: Object.freeze({ file: "src/wire.ts", line: 1, column: 1 })
  });
}
var METHODS = [
  ["codePlugins", 0],
  ["setPluginDisabled", 1],
  ["removePlugin", 1],
  ["addPlugin", 1],
  ["catalog", 1],
  ["refreshCatalog", 0],
  ["restartHost", 0],
  ["pendingRestart", 0]
];
var CONSOLE_INVOCATIONS = Object.freeze(METHODS.map(([method, argc]) => descriptor(method, argc)));

// src/index.ts
var name = "plugin-station";
var inject = ["tools", "loader"];
async function apply(ctx) {
  await ctx.plugin(PluginStationService);
}
export {
  CATALOG_URL,
  CONSOLE_INVOCATIONS,
  METHODS,
  PAGE_SIZE,
  PKG,
  PluginStationService,
  apply,
  backup,
  cachePath,
  collectPackages,
  inject,
  loadCatalog,
  loadPatch,
  name,
  normalize,
  packageOf,
  page,
  phaseOf,
  repoOf,
  setEntryDisabled2 as setEntryDisabled,
  specOf
};
