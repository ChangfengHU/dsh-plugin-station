# Startup performance

Version 1.3.4 reduces the browser wire-codec payload using the public Zod Mini API and enforces a 140 KB build budget. Strict string-in/string-out RPC validation is unchanged.

The native DSH boot waits for plugin activation before mounting the UI. This plugin uses the existing webserver/index-inject extension to preload the live, revisioned, same-origin script graph ahead of bootstrap. Preloading only fetches bytes; the native module loader still owns execution, dependency order, activation checks and error handling. No script is removed or executed by the preload helper.

Preloads are regenerated from clientModules.graph() on every index render. Duplicate URLs, non-plugin paths, cross-origin resources, missing revisions and non-script files are excluded. The feature is web-only and adds no new server, database, permission or configuration.

Run npm test and npm run build before packaging. Check the actual HTML for preload links and use browser functional tests for Plugins, Skills and MCP after deployment. Payload savings and HTTP measurements alone are not Core Web Vitals scores.

## Acceptance on 2026-11-10

- 23 Plugin Station tests and 74 Skill/MCP Console tests passed.
- Browser scripts decreased from 799436 to 72886 bytes and 704020 to 117812 bytes respectively, including module loader wrappers.
- Total revisioned plugin graph: approximately 5.30 MB before, 3991936 bytes after, across the same 49 entries.
- Served HTML contained 49 same-origin preload links before bootstrap. Actual browser refresh completed without script errors; the native chat view and Plugins/Skills/MCP RPC views loaded.
- Skills reported one existing invalid skill directory; MCP truthfully reported no servers configured in this Web profile. No source configuration was invented and no permissions were modified to make these views appear populated.
- Compressed public transfer from Linux 114 was 23452 bytes for Plugin Station and 34826 bytes for Skill/MCP Console.
- Mac-to-public homepage HTTP probe remained approximately 2.1 seconds, with approximately 1.6 seconds of TLS establishment. This separate network-path delay remains unresolved; it must not be attributed to model execution or represented as a measured browser rendering time.
- No DevTools performance trace was available, so this release does not claim measured LCP, INP or a fixed percentage improvement in end-user load time.
