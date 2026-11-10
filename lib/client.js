window.__ModuleLoader__.load({
	id: "dsh-plugin-station",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var q=Object.defineProperty;var Ue=Object.getOwnPropertyDescriptor;var Be=Object.getOwnPropertyNames;var Ke=Object.prototype.hasOwnProperty;var Ve=(e,t)=>{for(var r in t)q(e,r,{get:t[r],enumerable:!0})},He=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Be(t))!Ke.call(e,i)&&i!==r&&q(e,i,{get:()=>t[i],enumerable:!(n=Ue(t,i))||n.enumerable});return e};var Ge=e=>He(q({},"__esModule",{value:!0}),e);var kt={};Ve(kt,{MarketSection:()=>N,NS:()=>B,PluginStationWorkbenchPage:()=>G,PluginsSection:()=>E,apply:()=>_t,inject:()=>wt,name:()=>yt});module.exports=Ge(kt);var b=require("react");var Z=require("react"),P=require("react/jsx-runtime");function V({api:e,t,nonce:r=0,auto:n=!1}){let[i,u]=(0,Z.useState)([]),[g,o]=(0,Z.useState)([]),[s,f]=(0,Z.useState)(!1),m=(0,Z.useCallback)(async()=>{try{let d=await e.pendingRestart();u(d.added??[]),o(d.removed??[])}catch{}},[e]);return(0,Z.useEffect)(()=>{m()},[m,r]),(0,Z.useEffect)(()=>{!n||s||(f(!0),e.restartHost())},[n,s,e]),(0,Z.useEffect)(()=>{if(!s)return;let d=!1,p=setInterval(async()=>{try{if(!(await fetch(`${location.origin}/`,{method:"HEAD",cache:"no-store"})).ok){d=!0;return}d&&location.reload()}catch{d=!0}},1e3);return()=>clearInterval(p)},[s]),i.length===0&&g.length===0&&!s?null:(0,P.jsxs)("div",{className:"dps-restart",children:[(0,P.jsx)("span",{className:"dps-grow",children:s?t("restarting"):(0,P.jsxs)(P.Fragment,{children:[i.length?(0,P.jsx)("div",{children:t("restartPending",{list:i.join(", ")})}):null,g.length?(0,P.jsx)("div",{children:t("restartRemoved",{list:g.join(", ")})}):null]})}),s?null:(0,P.jsx)("button",{className:"dps-btn dps-primary",onClick:async()=>{f(!0),await e.restartHost()},children:t("restartNow")})]})}var de=require("react"),he=require("react/jsx-runtime");function fe(e,t){return t?e.replace(/\{(\w+)\}/g,(r,n)=>n in t?String(t[n]):r):e}function me(e){return e<1e3?String(e):`${(e/1e3).toFixed(1)}k`}var l=require("react/jsx-runtime"),We=["score","downloads","stars","recent"];function Xe({row:e,t,onInstall:r,busy:n,elapsed:i}){return(0,l.jsxs)("article",{className:"dps-market-card",children:[(0,l.jsxs)("div",{className:"dps-market-head",children:[(0,l.jsxs)("div",{className:"dps-grow",children:[(0,l.jsxs)("div",{className:"dps-name",children:[e.name,e.category?(0,l.jsx)("span",{className:"dps-chip dps-cat",children:e.category}):null]}),(0,l.jsxs)("div",{className:"dps-dim dps-trunc",children:[e.owner,e.downloads?` \xB7 ${me(e.downloads)} ${t("downloads")}`:"",e.adjusted?` \xB7 \u2605 ${e.adjusted}`:"",e.siblings>1?` \xB7 ${t("ofSiblings",{n:e.siblings})}`:""]})]}),(0,l.jsx)("span",{className:"dps-chip",children:e.score}),e.installed?(0,l.jsx)("span",{className:`dps-chip ${e.active?"dps-ok":"dps-warn"}`,children:e.active?t("installed"):t("needsRestart")}):(0,l.jsx)("button",{className:"dps-btn",disabled:n!==""||!e.spec,title:e.spec||t("noSpec"),onClick:()=>r(e),children:n===e.full?`${t("working")} ${i}s`:t("install")})]}),e.why?(0,l.jsx)("p",{className:"dps-why",children:t(e.why)}):null,e.description?(0,l.jsx)("p",{className:"dps-cd",children:e.description}):null,(0,l.jsx)("div",{className:"dps-market-source dps-mono dps-trunc dps-dim",children:e.spec||t("noSpec")})]})}function N({api:e,t,onInstalled:r}){let[n,i]=(0,b.useState)(null),[u,g]=(0,b.useState)(""),[o,s]=(0,b.useState)("all"),[f,m]=(0,b.useState)("score"),[d,p]=(0,b.useState)(0),[c,y]=(0,b.useState)("featured"),[x,$]=(0,b.useState)(""),[S,z]=(0,b.useState)(0),[v,W]=(0,b.useState)(0),[ue,X]=(0,b.useState)(""),[le,pe]=(0,b.useState)(""),O=(0,b.useRef)(null),K=(0,b.useCallback)(async(h={})=>{try{let _=c==="popular"?"downloads":c==="recent"?"recent":f,L=await e.catalog({query:h.query??u,category:o,sort:_,page:h.page??d,featured:c==="featured"});i(L),pe("")}catch(_){pe(String(_))}},[e,u,o,f,d,c]);(0,b.useEffect)(()=>{K()},[o,f,d,c]),(0,b.useEffect)(()=>(O.current&&clearTimeout(O.current),O.current=setTimeout(()=>{u.trim()!==""&&y("all"),p(0),K({query:u,page:0})},220),()=>{O.current&&clearTimeout(O.current)}),[u]),(0,b.useEffect)(()=>{if(x===""){z(0);return}let h=Date.now(),_=setInterval(()=>z(Math.round((Date.now()-h)/1e3)),1e3);return()=>clearInterval(_)},[x]);let Fe=async h=>{$(h.full),X("");try{let _=await Promise.race([e.addPlugin(h.spec).catch(()=>null),new Promise(L=>setTimeout(()=>L(null),9e4))]);X(_?_.restartRequired?`${_.log}

${t("restartHint")}`:_.log:t("replyLost")),await K(),W(L=>L+1),r?.()}catch(_){X(String(_))}finally{$("")}};return(0,l.jsxs)("div",{className:"dps-root",children:[(0,l.jsx)(V,{api:e,t,nonce:v}),(0,l.jsxs)("div",{className:"dps-bar",children:[(0,l.jsx)("div",{className:"dps-switch dps-market-tabs",role:"tablist","aria-label":t("marketNav"),children:["featured","popular","recent","all"].map(h=>(0,l.jsx)("button",{role:"tab","aria-selected":c===h,onClick:()=>{y(h),p(0)},children:t(`tab${h[0].toUpperCase()}${h.slice(1)}`)},h))}),(0,l.jsx)("input",{className:"dps-input dps-grow",value:u,placeholder:t("marketSearch"),onChange:h=>g(h.target.value)}),(0,l.jsxs)("select",{className:"dps-select",value:o,onChange:h=>{s(h.target.value),p(0)},children:[(0,l.jsx)("option",{value:"all",children:t("allCategories")}),(n?.categories??[]).map(h=>(0,l.jsx)("option",{value:h,children:h},h))]}),c==="all"?(0,l.jsx)("select",{className:"dps-select",value:f,onChange:h=>{m(h.target.value),p(0)},children:We.map(h=>(0,l.jsx)("option",{value:h,children:t(`sort_${h}`)},h))}):null,(0,l.jsx)("button",{className:"dps-btn",onClick:async()=>{await e.refreshCatalog(),await K()},children:t("refresh")})]}),ue?(0,l.jsx)("pre",{className:"dps-log",children:ue}):null,le?(0,l.jsx)("p",{className:"dps-warn",children:le}):null,n===null?(0,l.jsx)("p",{className:"dps-hint",children:t("loading")}):(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)("div",{className:"dps-count",children:[c==="featured"?t("featuredCount",{n:n.total}):t("marketCount",{shown:n.total,all:n.catalogTotal}),c!=="featured"&&u.trim()===""?(0,l.jsxs)("span",{className:"dps-dim",children:[" \xB7 ",t("foldedNote")]}):null]}),(0,l.jsx)("div",{className:"dps-market-grid",children:n.entries.map(h=>(0,l.jsx)(Xe,{row:h,t,busy:x,elapsed:S,onInstall:Fe},h.full))}),n.entries.length===0?(0,l.jsx)("p",{className:"dps-hint",children:t("marketEmpty")}):null,n.pages>1?(0,l.jsxs)("div",{className:"dps-actions",children:[(0,l.jsx)("button",{className:"dps-btn",disabled:n.page===0,onClick:()=>p(n.page-1),children:t("prev")}),(0,l.jsxs)("span",{className:"dps-dim",children:[n.page+1," / ",n.pages]}),(0,l.jsx)("button",{className:"dps-btn",disabled:n.page+1>=n.pages,onClick:()=>p(n.page+1),children:t("next")})]}):null]})]})}var w=require("react");var a=require("react/jsx-runtime"),ge=new Set(["failed","disposed"]);function qe({row:e,api:t,t:r,onChanged:n,onRemoved:i}){let[u,g]=(0,w.useState)(!1),[o,s]=(0,w.useState)(""),[f,m]=(0,w.useState)(!1),d=e.entries.filter(c=>c.fiber!==null&&ge.has(c.fiber)),p=e.entries.length>0&&e.entries.every(c=>c.disabled);return(0,a.jsxs)("article",{className:`dps-plugin-card${p?" dps-card-off":""}${u?" dps-plugin-card-open":""}`,children:[(0,a.jsxs)("div",{className:"dps-plugin-summary",children:[(0,a.jsx)("button",{className:"dps-caret","aria-expanded":u,"aria-label":e.name,onClick:()=>g(c=>!c),children:u?"\u25BC":"\u25B6"}),(0,a.jsxs)("div",{className:"dps-grow",children:[(0,a.jsxs)("div",{className:"dps-name",children:[e.name,e.version?(0,a.jsxs)("span",{className:"dps-dim",children:[" ",e.version]}):null]}),(0,a.jsx)("div",{className:"dps-mono dps-trunc",children:e.source||"\u2014"})]}),(0,a.jsx)("button",{className:"dps-toggle","aria-pressed":!p,"aria-label":e.name,disabled:o!==""||e.entries.length===0,onClick:async()=>{s("toggle");try{for(let c of e.entries)await t.setPluginDisabled(c.id,!p);n()}finally{s("")}}})]}),(0,a.jsxs)("div",{className:"dps-plugin-meta",children:[e.bundled?null:(0,a.jsx)("span",{className:"dps-chip dps-warn",children:r("notAPlugin")}),e.hasClient?(0,a.jsx)("span",{className:"dps-chip",children:r("hasClient")}):null,(0,a.jsxs)("span",{className:"dps-chip",children:[e.entries.length," ",r(e.entries.length===1?"entryOne":"entries")]}),d.length?(0,a.jsx)("span",{className:"dps-chip dps-warn",children:d[0].fiber}):null,(0,a.jsx)("span",{className:`dps-chip ${p?"":"dps-ok"}`,children:r(p?"disabled":"enabled")})]}),u?(0,a.jsxs)("div",{className:"dps-body",children:[e.description?(0,a.jsx)("p",{className:"dps-hint",children:e.description}):null,(0,a.jsxs)("table",{className:"dps-table",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:r("entryId")}),(0,a.jsx)("th",{children:r("module")}),(0,a.jsx)("th",{children:r("state")})]})}),(0,a.jsxs)("tbody",{children:[e.entries.map(c=>(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{className:"dps-mono",children:c.id}),(0,a.jsx)("td",{className:"dps-mono dps-trunc",children:c.module}),(0,a.jsx)("td",{children:(0,a.jsx)("span",{className:`dps-chip ${c.fiber&&ge.has(c.fiber)?"dps-warn":c.disabled?"":"dps-ok"}`,children:c.disabled?r("disabled"):c.fiber??"\u2014"})})]},c.id)),e.entries.length===0?(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:3,className:"dps-hint",children:r("noEntries")})}):null]})]}),(0,a.jsx)("div",{className:"dps-actions",children:f?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("span",{className:"dps-hint",children:r("removeConfirmRestart")}),(0,a.jsx)("button",{className:"dps-btn",onClick:()=>m(!1),children:r("cancel")}),(0,a.jsx)("button",{className:"dps-btn dps-danger",disabled:o!=="",onClick:async()=>{s("remove");try{t.removePlugin(e.name).catch(()=>null);let c=async()=>{try{return!(await t.codePlugins()).installed.some($=>$.name===e.name)}catch{return!1}},y=Date.now()+9e4;for(;Date.now()<y&&!await c();)await new Promise(x=>setTimeout(x,1500))}finally{s(""),m(!1),n(),i()}},children:r(o==="remove"?"working":"remove")})]}):(0,a.jsx)("button",{className:"dps-btn",onClick:()=>m(!0),children:r("remove")})})]}):null]})}function E({api:e,t}){let[r,n]=(0,w.useState)(null),[i,u]=(0,w.useState)({builtinEntries:0,builtinPackages:0,profile:""}),[g,o]=(0,w.useState)(""),[s,f]=(0,w.useState)(""),[m,d]=(0,w.useState)(""),[p,c]=(0,w.useState)(!1),[y,x]=(0,w.useState)(0),[$,S]=(0,w.useState)(!1),z=(0,w.useCallback)(async()=>{try{let v=await e.codePlugins();n(v.installed),u({builtinEntries:v.builtinEntries,builtinPackages:v.builtinPackages,profile:v.profile}),o("")}catch(v){o(String(v))}},[e]);return(0,w.useEffect)(()=>{z()},[z]),(0,a.jsxs)("div",{className:"dps-root",children:[(0,a.jsx)(V,{api:e,t,nonce:y,auto:$}),(0,a.jsx)("p",{className:"dps-hint",children:t("pluginsBlurb")}),(0,a.jsxs)("div",{className:"dps-bar",children:[(0,a.jsx)("input",{className:"dps-input dps-grow",value:s,placeholder:t("addPluginPlaceholder"),onChange:v=>f(v.target.value)}),(0,a.jsx)("button",{className:"dps-btn dps-primary",disabled:p||s.trim()==="",onClick:async()=>{c(!0),d("");try{let v=await e.addPlugin(s.trim());d(v.log),v.code===0&&(f(""),await z(),x(W=>W+1))}catch(v){d(String(v))}finally{c(!1)}},children:t(p?"working":"install")})]}),m?(0,a.jsx)("pre",{className:"dps-log",children:m}):null,g?(0,a.jsx)("p",{className:"dps-warn",children:g}):null,r===null?(0,a.jsx)("p",{className:"dps-hint",children:t("loading")}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"dps-count",children:[r.length," ",t("yourPlugins"),i.profile?(0,a.jsxs)("span",{className:"dps-dim",children:[" \xB7 ",t("profile")," ",i.profile]}):null]}),(0,a.jsx)("div",{className:"dps-plugin-grid",children:r.map(v=>(0,a.jsx)(qe,{row:v,api:e,t,onChanged:()=>{z()},onRemoved:()=>S(!0)},v.name))}),r.length===0?(0,a.jsx)("p",{className:"dps-hint",children:t("noPlugins")}):null,(0,a.jsx)("p",{className:"dps-hint",children:t("builtinFolded",{entries:i.builtinEntries,packages:i.builtinPackages})})]})]})}var xe={featuredSkillMcp:"Why: the panel this station cannot replace \u2014 skills and MCP are not plugins, and this is where they live.",featuredTaskConsole:"Why: makes Agent, Task and Session one observable workflow, including Actions, DAG, Trace, replay and delivery acceptance.",featuredPluginStation:"Why: the deployment's own plugin workbench \u2014 real install state, lifecycle controls and a deliberately curated market.",featuredFreeSearch:"Why: makes the native web_search usable without one mandatory vendor key, with free-first routing and managed provider fallbacks.",replyLost:"The reply did not come back \u2014 installing rewrites the profile and can restart this panel mid-call. The list below is re-read from disk, so it shows what actually happened.",removeConfirmRestart:"Removes it from the profile, then restarts dsh \u2014 required, because a removed plugin left running takes the whole UI down.",restartRemoved:"Uninstalled but still running: {list}. Their menus and settings stay on screen until dsh restarts.",tabFeatured:"Picks",tabPopular:"Popular",tabRecent:"New",tabAll:"All",featuredCount:"{n} picks \u2014 short on purpose, and each says why",featuredStationOld:"Why: the panel you are reading. Skills, MCP, code plugins and this market in one place.",featuredCodex:"Why: makes a local codex CLI a model route, and fixes the reserved-prefix collision that stopped its tool calls working.",restartPending:"Installed but not running yet: {list}. dsh picks them up on its next start.",restartNow:"Restart now",restarting:"Restarting \u2014 this page reloads as soon as dsh answers again.",needsRestart:"installed \xB7 restart to activate",restartHint:"Installed. It joins the composition on the next dsh restart \u2014 nothing changes in the running app until then.",marketNav:"Market",marketSearch:"Search the catalog\u2026",allCategories:"All categories",sort_score:"Best match",sort_downloads:"Downloads",sort_stars:"Stars (adjusted)",sort_recent:"Recently added",refresh:"Refresh",marketCount:"{shown} shown of {all} in the catalog",foldedNote:"monorepos folded to their best two \u2014 search to see every entry",marketEmpty:"Nothing matches. Try another category, or clear the search.",downloads:"downloads",ofSiblings:"1 of {n} in its repo",noSpec:"no installable specifier",installed:"installed",prev:"Previous",next:"Next",codePluginsNav:"Code plugins",pluginsBlurb:"The packages you installed into this deployment. The Host's own list is one row per composition entry, and most of those entries are the Host itself; this one lists only yours, grouped by package, and reports the fiber phase rather than the toggle's intent.",yourPlugins:"installed",noPlugins:"No third-party packages in this profile.",builtinFolded:"{entries} more entries come from {packages} packages the Host ships. Folded away \u2014 you did not install them, and they are rarely yours to change.",entries:"entries",entryOne:"entry",entryId:"Entry id",module:"Module",state:"State",noEntries:"This package registered no composition entries \u2014 it may be disabled, or a plain dependency rather than a plugin.",notAPlugin:"not a plugin",hasClient:"browser half",removeConfirm:"Removes it from the profile and recomposes; dsh restarts.",addPluginPlaceholder:"npm name / github:owner/repo / tarball URL",profile:"profile",working:"Working\u2026",skillsNav:"Skills",mcpNav:"MCP",skillsTitle:"Skills",skillsLead:"Every skill on this machine, where it came from, and how much of it the model is paying for.",search:"Search skills\u2026",rescan:"Rescan",browse:"Find skills",add:"Add",addCommand:"Install from a command or link",addUpload:"Upload a skill (.zip / SKILL.md)",addCreate:"Create a skill",addAi:"Have dsh write one",addDirectory:"Find skills on GitHub",colSkill:"Skill",colState:"State",colCost:"Context cost",colSource:"Source",colUpdated:"Updated",countSkills:"skills",countProblems:"with problems",countShadowed:"shadowed",filterAll:"All",filterProblems:"Problems",filterShadowed:"Shadowed",sortRecent:"Recent",sortName:"Name",pageOf:"{page} / {pages} \xB7 {total} rows",resident:"resident",approx:"approx",saved:"saves",stateOn:"on",stateUserOnly:"manual only",stateOff:"off",legendOn:"name and description in context; the model can invoke it",legendUserOnly:"hidden from the model; you can still invoke it with /",legendOff:"not loaded at all",problemNoSkillMd:"no SKILL.md in this directory \u2014 dsh will not load it",problemNoName:"frontmatter has no name",problemNameMismatch:"frontmatter name does not match the directory name, so the frontmatter name does nothing",problemNoDescription:"frontmatter has no description \u2014 the model will never invoke it",problemUnreadable:"SKILL.md could not be read",shadowedNote:"Not loaded. dsh runs the copy in {root} under this name instead \u2014 editing this one changes nothing. Only one copy of a name ever wins, and dsh has no API that can tell you which one lost, so this panel works it out from disk.",wouldCost:"would be {n}",nonNative:"Not a dsh skill root \u2014 reachable only while a bridging plugin registers it.",back:"Back",remove:"Remove",removed:"Moved to {path}",rendered:"Text",source:"Raw",copy:"Copy",copied:"Copied",emptyDir:"(empty directory)",noSkills:"No skills found under any root.",noMatch:"Nothing matches.",mcpTitle:"MCP",mcpLead:"Servers this deployment connects to, and the tools each one hands the model.",list:"List",json:"JSON",servers:"servers",tools:"tools",noServers:"No MCP servers configured in this profile.",noTools:"This server registered no tools \u2014 usually it never connected, or its serverName does not match.",disabled:"disabled",jsonLead:"This is the universal mcpServers format \u2014 what Cursor, Claude Desktop and most MCP documentation write. dsh stores cordis patch entries; the translation happens here.",jsonMasked:"Credential values are masked. Leave a mask in place and the stored secret is kept.",save:"Save",revert:"Revert",savedOk:"Saved. Added {added}, updated {updated}, removed {removed}. Backup: {backup}",restartNote:"Restart dsh for the composition to pick the change up.",installTitle:"Install from a command or link",installLead:"Paste a repository address or an install command. The form is detected, what will run is shown first, and what landed is checked after.",installInput:"Repository or command",installHint:"A GitHub address, a user/repo shorthand, git clone \u2026, or any install script.",detected:"Detected",installTarget:"Installs into",peekOpen:"Show what will run (nothing has executed yet)",found:"Found {n} skills \u2014 choose which to install",runInstall:"Run and verify",output:"Output",verifyTitle:"Landing checks",verifyLead:"exit 0 does not mean installed \u2014 these four decide",vSkillMd:"SKILL.md exists",vFrontmatter:"frontmatter has name and description",vExecutable:"scripts are executable",vRegistry:"appears in the skill registry",supported:"Supported forms",noCandidates:"Downloaded and unpacked, but no SKILL.md turned up inside \u2014 this may not be a skill repository, or its skills sit deeper than four directories down. Open it on GitHub and check.",selectAll:"All",selectNone:"None",selected:"{n} selected",installedInto:"Installed {n} skill(s): {path}",checksPassed:"all landing checks passed",checksFailed:"{n} landing check(s) failed \u2014 open the skill to see which",dismiss:"Dismiss",uploadTitle:"Upload a skill",uploadLead:"A .md file needs name and description in its YAML frontmatter; a .zip or .tgz needs a SKILL.md inside.",drop:"Drop a file here, or click to choose",createTitle:"Create a skill",createLead:"These three fields become the SKILL.md: the first two are frontmatter, the third is the body.",fieldName:"Skill name",fieldNameHint:"Lowercase letters, digits and hyphens. This name is what / resolves.",fieldDescription:"Description",fieldDescriptionHint:"This sits in context every turn. Say when to use it, not how it works.",fieldInstructions:"Instructions",create:"Create",cancel:"Cancel",aiTitle:"Have dsh write one",aiLead:"No form. The prompt below goes into the composer; the agent asks you what it needs and writes the file itself.",aiPrompt:"Let us build a skill together. Ask me what it should do and when it should trigger, then write the SKILL.md into ~/.agents/skills/ and test the description against two sample prompts.",aiInsert:"Put it in the composer",aiInserted:"Copied \u2014 paste it into the composer.",directoryTitle:"Find skills",directoryLead:"Skill repositories on GitHub. Picking one opens the install flow, which downloads it and lets you choose which of its skills to keep.",searchRepos:"Search repositories\u2026",searchGo:"Search",openOnGithub:"Open on GitHub",installReview:"Install \u2014 review first",directoryNote:"Third-party code. The install flow shows you what it downloaded and checks what landed \u2014 read the SKILL.md before you trust a skill with your machine.",install:"Install",registryEmpty:"Nothing found for that search.",registryError:"GitHub search failed: {error}"},be={featuredSkillMcp:"\u7406\u7531\uFF1A\u8FD9\u4E2A\u7AD9\u53D6\u4EE3\u4E0D\u4E86\u7684\u90A3\u4E00\u534A\u2014\u2014\u6280\u80FD\u548C MCP \u4E0D\u662F\u63D2\u4EF6\uFF0C\u5B83\u4EEC\u5F52\u5B83\u7BA1\u3002",featuredTaskConsole:"\u7406\u7531\uFF1A\u628A Agent\u3001Task \u548C Session \u53D8\u6210\u53EF\u89C2\u6D4B\u7684\u7EDF\u4E00\u5DE5\u4F5C\u6D41\uFF0C\u5305\u542B Actions\u3001DAG\u3001Trace\u3001\u56DE\u653E\u548C\u4EA4\u4ED8\u9A8C\u6536\u3002",featuredPluginStation:"\u7406\u7531\uFF1A\u90E8\u7F72\u81EA\u5DF1\u7684\u63D2\u4EF6\u5DE5\u4F5C\u53F0\u2014\u2014\u771F\u5B9E\u5B89\u88C5\u72B6\u6001\u3001\u751F\u547D\u5468\u671F\u7BA1\u7406\u548C\u523B\u610F\u4FDD\u6301\u7CBE\u9009\u7684\u5E02\u573A\u3002",featuredFreeSearch:"\u7406\u7531\uFF1A\u8BA9\u539F\u751F web_search \u4E0D\u518D\u4F9D\u8D56\u5355\u4E00\u5382\u5546 Key\uFF0C\u9ED8\u8BA4\u514D\u8D39\u4F18\u5148\uFF0C\u5E76\u63D0\u4F9B\u53D7\u7BA1\u7406\u7684 Provider \u964D\u7EA7\u94FE\u3002",replyLost:"\u5E94\u7B54\u6CA1\u56DE\u6765\u2014\u2014\u5B89\u88C5\u4F1A\u6539\u5199 profile\uFF0C\u53EF\u80FD\u5728\u8C03\u7528\u4E2D\u9014\u628A\u8FD9\u4E2A\u9762\u677F\u91CD\u5EFA\u6389\u3002\u4E0B\u9762\u7684\u5217\u8868\u662F\u4ECE\u78C1\u76D8\u91CD\u65B0\u8BFB\u7684\uFF0C\u4EE5\u5B83\u4E3A\u51C6\u3002",removeConfirmRestart:"\u4ECE profile \u79FB\u9664\u540E\u4F1A\u7ACB\u5373\u91CD\u542F dsh\u2014\u2014\u8FD9\u4E00\u6B65\u5FC5\u987B\u505A\uFF1A\u5378\u6389\u7684\u63D2\u4EF6\u5982\u679C\u7EE7\u7EED\u6302\u5728\u8FD0\u884C\u4E2D\u7684\u8FDB\u7A0B\u91CC\uFF0C\u6574\u4E2A\u754C\u9762\u4F1A\u6253\u4E0D\u5F00\u3002",restartRemoved:"\u5DF2\u5378\u8F7D\u4F46\u8FD8\u5728\u8DD1\uFF1A{list}\u3002\u5B83\u4EEC\u7684\u83DC\u5355\u548C\u8BBE\u7F6E\u9875\u4F1A\u4E00\u76F4\u7559\u5728\u754C\u9762\u4E0A\uFF0C\u76F4\u5230 dsh \u91CD\u542F\u3002",tabFeatured:"\u7CBE\u9009",tabPopular:"\u70ED\u95E8",tabRecent:"\u6700\u65B0",tabAll:"\u5168\u90E8",featuredCount:"{n} \u6761\u7CBE\u9009\u2014\u2014\u523B\u610F\u77ED\uFF0C\u800C\u4E14\u6BCF\u6761\u90FD\u8BF4\u660E\u7406\u7531",featuredStationOld:"\u7406\u7531\uFF1A\u4F60\u6B63\u5728\u7528\u7684\u8FD9\u4E2A\u9762\u677F\u3002\u6280\u80FD\u3001MCP\u3001\u4EE3\u7801\u63D2\u4EF6\u548C\u8FD9\u4E2A\u5E02\u573A\u6536\u5728\u4E00\u5904\u3002",featuredCodex:"\u7406\u7531\uFF1A\u628A\u672C\u673A codex CLI \u53D8\u6210\u6A21\u578B\u8DEF\u7531\uFF0C\u5E76\u4FEE\u597D\u4E86\u8BA9\u5B83\u4E00\u4E2A\u5DE5\u5177\u90FD\u8C03\u4E0D\u4E86\u7684\u4FDD\u7559\u524D\u7F00\u51B2\u7A81\u3002",restartPending:"\u5DF2\u88C5\u4F46\u8FD8\u6CA1\u8DD1\u8D77\u6765\uFF1A{list}\u3002dsh \u4E0B\u6B21\u542F\u52A8\u65F6\u624D\u4F1A\u52A0\u8F7D\u5B83\u4EEC\u3002",restartNow:"\u7ACB\u5373\u91CD\u542F",restarting:"\u6B63\u5728\u91CD\u542F\u2014\u2014dsh \u4E00\u6062\u590D\u5E94\u7B54\uFF0C\u8FD9\u4E2A\u9875\u9762\u5C31\u4F1A\u81EA\u52A8\u5237\u65B0\u3002",needsRestart:"\u5DF2\u88C5 \xB7 \u91CD\u542F\u540E\u751F\u6548",restartHint:"\u5DF2\u5B89\u88C5\u3002\u5B83\u4F1A\u5728 dsh \u4E0B\u6B21\u91CD\u542F\u65F6\u8FDB\u5165\u7EC4\u5408\u2014\u2014\u5728\u90A3\u4E4B\u524D\uFF0C\u6B63\u5728\u8FD0\u884C\u7684\u5E94\u7528\u91CC\u4E0D\u4F1A\u6709\u4EFB\u4F55\u53D8\u5316\u3002",marketNav:"\u63D2\u4EF6\u5E02\u573A",marketSearch:"\u641C\u7D22\u76EE\u5F55\u2026",allCategories:"\u5168\u90E8\u5206\u7C7B",sort_score:"\u7EFC\u5408",sort_downloads:"\u4E0B\u8F7D\u91CF",sort_stars:"\u661F\u6807\uFF08\u5DF2\u644A\u8584\uFF09",sort_recent:"\u6700\u8FD1\u52A0\u5165",refresh:"\u5237\u65B0\u76EE\u5F55",marketCount:"\u76EE\u5F55\u5171 {all} \u6761\uFF0C\u5F53\u524D\u7B5B\u51FA {shown} \u6761",foldedNote:"\u540C\u4ED3\u5E93\u5B50\u5305\u5DF2\u6298\u53E0\u4E3A\u6700\u597D\u7684\u4E24\u6761\u2014\u2014\u641C\u7D22\u65F6\u663E\u793A\u5168\u90E8",marketEmpty:"\u6CA1\u6709\u5339\u914D\u7684\u3002\u6362\u4E2A\u5206\u7C7B\uFF0C\u6216\u8005\u6E05\u6389\u641C\u7D22\u8BCD\u3002",downloads:"\u6B21\u4E0B\u8F7D",ofSiblings:"\u540C\u4ED3\u5E93 {n} \u4E2A\u4E4B\u4E00",noSpec:"\u6CA1\u6709\u53EF\u5B89\u88C5\u7684\u6765\u6E90",installed:"\u5DF2\u5B89\u88C5",prev:"\u4E0A\u4E00\u9875",next:"\u4E0B\u4E00\u9875",codePluginsNav:"\u4EE3\u7801\u63D2\u4EF6",pluginsBlurb:"\u8FD9\u4E2A\u90E8\u7F72\u91CC\u4F60\u81EA\u5DF1\u88C5\u7684\u5305\u3002dsh \u539F\u751F\u7684\u63D2\u4EF6\u5217\u8868\u6309\u7EC4\u5408\u6761\u76EE\u5C55\u5F00\uFF0C\u5176\u4E2D\u7EDD\u5927\u591A\u6570\u662F dsh \u81EA\u5DF1\u7684\u5185\u90E8\u5355\u5143\uFF1B\u8FD9\u91CC\u53EA\u5217\u4F60\u88C5\u7684\uFF0C\u6309\u5305\u5206\u7EC4\uFF0C\u72B6\u6001\u53D6 fiber \u771F\u503C\u800C\u4E0D\u662F\u5F00\u5173\u610F\u56FE\u3002",yourPlugins:"\u4E2A\u4F60\u88C5\u7684\u5305",noPlugins:"\u8FD9\u4E2A profile \u91CC\u6CA1\u6709\u7B2C\u4E09\u65B9\u5305\u3002",builtinFolded:"\u53E6\u6709 {entries} \u6761\u7EC4\u5408\u9879\u6765\u81EA dsh \u81EA\u5E26\u7684 {packages} \u4E2A\u5305\uFF0C\u5DF2\u6298\u53E0\u2014\u2014\u5B83\u4EEC\u4E0D\u662F\u4F60\u88C5\u7684\uFF0C\u901A\u5E38\u4E5F\u4E0D\u8BE5\u52A8\u3002",entries:"\u6761\u7EC4\u5408\u9879",entryOne:"\u6761\u7EC4\u5408\u9879",entryId:"\u6761\u76EE id",module:"\u6A21\u5757",state:"\u72B6\u6001",noEntries:"\u8FD9\u4E2A\u5305\u6CA1\u6709\u5411\u7EC4\u5408\u6CE8\u518C\u4EFB\u4F55\u6761\u76EE\u2014\u2014\u53EF\u80FD\u6CA1\u542F\u7528\uFF0C\u4E5F\u53EF\u80FD\u5B83\u53EA\u662F\u4E2A\u666E\u901A\u4F9D\u8D56\u3002",notAPlugin:"\u975E\u63D2\u4EF6",hasClient:"\u5E26\u524D\u7AEF",removeConfirm:"\u5C06\u4ECE profile \u79FB\u9664\u5E76\u91CD\u65B0\u7EC4\u5408\uFF0Cdsh \u4F1A\u91CD\u542F\u3002",addPluginPlaceholder:"npm \u5305\u540D / github:owner/repo / tarball \u5730\u5740",profile:"profile",working:"\u6267\u884C\u4E2D\u2026",skillsNav:"\u6280\u80FD",mcpNav:"MCP",skillsTitle:"\u6280\u80FD",skillsLead:"\u8FD9\u53F0\u673A\u5668\u4E0A\u6240\u6709\u7684\u6280\u80FD:\u6765\u81EA\u54EA\u91CC,\u4EE5\u53CA\u6A21\u578B\u4E3A\u5B83\u5E38\u5E74\u4ED8\u591A\u5C11\u4E0A\u4E0B\u6587\u3002",search:"\u641C\u7D22\u6280\u80FD\u2026",rescan:"\u91CD\u65B0\u626B\u63CF",browse:"\u627E\u6280\u80FD",add:"\u6DFB\u52A0",addCommand:"\u4ECE\u547D\u4EE4\u6216\u94FE\u63A5\u5B89\u88C5",addUpload:"\u4E0A\u4F20\u6280\u80FD\u5305(.zip / SKILL.md)",addCreate:"\u65B0\u5EFA\u6280\u80FD",addAi:"\u8BA9 dsh \u5E2E\u6211\u5199",addDirectory:"\u53BB GitHub \u627E\u6280\u80FD",colSkill:"\u6280\u80FD",colState:"\u72B6\u6001",colCost:"\u5E38\u9A7B\u5F00\u9500",colSource:"\u6765\u6E90",colUpdated:"\u66F4\u65B0",countSkills:"\u4E2A\u6280\u80FD",countProblems:"\u4E2A\u6709\u95EE\u9898",countShadowed:"\u4E2A\u88AB\u906E\u853D",filterAll:"\u5168\u90E8",filterProblems:"\u6709\u95EE\u9898",filterShadowed:"\u88AB\u906E\u853D",sortRecent:"\u6700\u8FD1",sortName:"\u540D\u5B57",pageOf:"\u7B2C {page} / {pages} \u9875 \xB7 \u5171 {total} \u6761",resident:"\u5E38\u9A7B",approx:"\u7EA6",saved:"\u7701",stateOn:"\u751F\u6548",stateUserOnly:"\u4EC5\u624B\u52A8",stateOff:"\u5173",legendOn:"\u540D\u5B57\u548C\u63CF\u8FF0\u90FD\u8FDB\u4E0A\u4E0B\u6587,\u6A21\u578B\u53EF\u81EA\u5DF1\u8C03\u7528",legendUserOnly:"\u6A21\u578B\u770B\u4E0D\u89C1,\u4F60\u4ECD\u53EF\u4EE5\u7528 / \u8C03\u5B83",legendOff:"\u5B8C\u5168\u4E0D\u52A0\u8F7D",problemNoSkillMd:"\u76EE\u5F55\u91CC\u6CA1\u6709 SKILL.md,dsh \u4E0D\u4F1A\u52A0\u8F7D\u5B83",problemNoName:"frontmatter \u7F3A name",problemNameMismatch:"frontmatter \u7684 name \u4E0E\u76EE\u5F55\u540D\u4E0D\u4E00\u81F4,\u90A3\u4E2A name \u9759\u9ED8\u5931\u6548",problemNoDescription:"frontmatter \u7F3A description,\u6A21\u578B\u6C38\u8FDC\u4E0D\u4F1A\u81EA\u52A8\u8C03\u7528\u5B83",problemUnreadable:"SKILL.md \u8BFB\u4E0D\u51FA\u6765",shadowedNote:"\u8FD9\u4E00\u4EFD\u6CA1\u6709\u88AB\u52A0\u8F7D\u3002\u8FD9\u4E2A\u540D\u5B57\u4E0B dsh \u5B9E\u9645\u8DD1\u7684\u662F {root} \u91CC\u90A3\u4EFD\u2014\u2014\u6539\u8FD9\u4E00\u4EFD\u4E0D\u4F1A\u6709\u4EFB\u4F55\u6548\u679C\u3002\u540C\u540D\u53EA\u6709\u4E00\u4EFD\u80FD\u8D62,\u800C dsh \u6CA1\u6709\u63A5\u53E3\u80FD\u544A\u8BC9\u4F60\u54EA\u4EFD\u843D\u9009,\u6240\u4EE5\u8FD9\u91CC\u66FF\u4F60\u4ECE\u78C1\u76D8\u4E0A\u7B97\u4E86\u51FA\u6765\u3002",wouldCost:"\u672C\u6765 {n}",nonNative:"\u4E0D\u662F dsh \u7684\u6280\u80FD\u6839 \u2014\u2014 \u53EA\u6709\u88C5\u4E86\u6865\u63A5\u63D2\u4EF6\u65F6\u624D\u80FD\u8C03\u5230\u3002",back:"\u8FD4\u56DE",remove:"\u79FB\u9664",removed:"\u5DF2\u79FB\u81F3 {path}",rendered:"\u6B63\u6587",source:"\u6E90\u7801",copy:"\u590D\u5236",copied:"\u5DF2\u590D\u5236",emptyDir:"(\u7A7A\u76EE\u5F55)",noSkills:"\u6240\u6709\u6839\u76EE\u5F55\u4E0B\u90FD\u6CA1\u6709\u626B\u5230\u6280\u80FD\u3002",noMatch:"\u6CA1\u6709\u5339\u914D\u7684\u3002",mcpTitle:"MCP",mcpLead:"\u8FD9\u4E2A\u90E8\u7F72\u8FDE\u7740\u54EA\u4E9B MCP \u670D\u52A1\u5668,\u4EE5\u53CA\u6BCF\u4E2A\u670D\u52A1\u5668\u5B9E\u9645\u4EA4\u7ED9\u6A21\u578B\u7684\u5DE5\u5177\u3002",list:"\u5217\u8868",json:"JSON",servers:"\u4E2A\u670D\u52A1\u5668",tools:"\u4E2A\u5DE5\u5177",noServers:"\u8FD9\u4E2A profile \u91CC\u6CA1\u6709\u914D\u7F6E MCP \u670D\u52A1\u5668\u3002",noTools:"\u8FD9\u4E2A\u670D\u52A1\u5668\u6CA1\u6709\u6CE8\u518C\u4EFB\u4F55\u5DE5\u5177 \u2014\u2014 \u901A\u5E38\u662F\u6CA1\u8FDE\u4E0A,\u6216\u8005 serverName \u548C\u5B9E\u9645\u4E0D\u4E00\u81F4\u3002",disabled:"\u5DF2\u505C\u7528",jsonLead:"\u8FD9\u662F\u901A\u7528\u7684 mcpServers \u683C\u5F0F \u2014\u2014 Cursor\u3001Claude Desktop \u548C\u5927\u591A\u6570 MCP \u6587\u6863\u5199\u7684\u90FD\u662F\u5B83\u3002dsh \u5185\u90E8\u5B58\u7684\u662F cordis \u8865\u4E01\u6761\u76EE,\u7FFB\u8BD1\u5728\u8FD9\u91CC\u53D1\u751F\u3002",jsonMasked:"\u51ED\u636E\u503C\u5DF2\u8131\u654F\u3002\u4FDD\u7559\u539F\u6837\u7684\u906E\u853D\u7B26,\u5B58\u7740\u7684\u5BC6\u94A5\u5C31\u4E0D\u4F1A\u88AB\u8986\u76D6\u3002",save:"\u4FDD\u5B58",revert:"\u8FD8\u539F",savedOk:"\u5DF2\u4FDD\u5B58\u3002\u65B0\u589E {added},\u66F4\u65B0 {updated},\u79FB\u9664 {removed}\u3002\u5907\u4EFD:{backup}",restartNote:"\u91CD\u542F dsh \u540E\u7EC4\u5408\u624D\u4F1A\u52A0\u8F7D\u8FD9\u6B21\u6539\u52A8\u3002",installTitle:"\u4ECE\u547D\u4EE4\u6216\u94FE\u63A5\u5B89\u88C5",installLead:"\u7C98\u8D34\u4ED3\u5E93\u5730\u5740\u6216\u5B89\u88C5\u547D\u4EE4\u3002\u81EA\u52A8\u8BC6\u522B\u5F62\u5F0F,\u6267\u884C\u524D\u5148\u7ED9\u4F60\u770B\u8981\u8DD1\u4EC0\u4E48,\u6267\u884C\u540E\u6821\u9A8C\u5230\u5E95\u88C5\u6CA1\u88C5\u4E0A\u3002",installInput:"\u4ED3\u5E93\u5730\u5740 / \u5B89\u88C5\u547D\u4EE4",installHint:"GitHub \u5730\u5740\u3001user/repo \u7B80\u5199\u3001git clone \u2026,\u6216\u4EFB\u610F\u5B89\u88C5\u811A\u672C\u3002",detected:"\u5DF2\u8BC6\u522B",installTarget:"\u88C5\u5230",peekOpen:"\u5148\u770B\u8981\u6267\u884C\u4EC0\u4E48(\u5C1A\u672A\u6267\u884C)",found:"\u53D1\u73B0 {n} \u4E2A\u6280\u80FD \u2014\u2014 \u52FE\u9009\u8981\u88C5\u7684",runInstall:"\u6267\u884C\u5E76\u6821\u9A8C",output:"\u6267\u884C\u8F93\u51FA",verifyTitle:"\u843D\u5730\u6821\u9A8C",verifyLead:"\u9000\u51FA\u7801 0 \u4E0D\u7B97\u88C5\u597D,\u8FD9\u56DB\u6761\u8FC7\u4E86\u624D\u7B97",vSkillMd:"SKILL.md \u5B58\u5728",vFrontmatter:"frontmatter \u6709 name \u548C description",vExecutable:"scripts \u53EF\u6267\u884C",vRegistry:"\u51FA\u73B0\u5728\u6280\u80FD\u6CE8\u518C\u8868\u91CC",supported:"\u652F\u6301\u7684\u5F62\u5F0F",noCandidates:"\u4E0B\u8F7D\u5E76\u89E3\u5305\u6210\u529F\u4E86,\u4F46\u91CC\u9762\u6CA1\u627E\u5230\u4EFB\u4F55 SKILL.md \u2014\u2014 \u53EF\u80FD\u8FD9\u4E0D\u662F\u6280\u80FD\u4ED3\u5E93,\u6216\u8005\u5B83\u7684\u6280\u80FD\u85CF\u5728\u56DB\u5C42\u76EE\u5F55\u4EE5\u4E0B\u3002\u53BB GitHub \u4E0A\u6253\u5F00\u770B\u770B\u3002",selectAll:"\u5168\u9009",selectNone:"\u5168\u4E0D\u9009",selected:"\u5DF2\u9009 {n} \u4E2A",installedInto:"\u5DF2\u88C5 {n} \u4E2A\u6280\u80FD:{path}",checksPassed:"\u843D\u5730\u6821\u9A8C\u5168\u8FC7",checksFailed:"{n} \u6761\u843D\u5730\u6821\u9A8C\u6CA1\u8FC7\u2014\u2014\u70B9\u8FDB\u6280\u80FD\u770B\u662F\u54EA\u6761",dismiss:"\u77E5\u9053\u4E86",uploadTitle:"\u4E0A\u4F20\u6280\u80FD\u5305",uploadLead:".md \u6587\u4EF6\u7684 YAML frontmatter \u5FC5\u987B\u6709 name \u548C description;.zip / .tgz \u5305\u91CC\u5FC5\u987B\u6709 SKILL.md\u3002",drop:"\u62D6\u8FDB\u6765,\u6216\u70B9\u51FB\u9009\u62E9\u6587\u4EF6",createTitle:"\u65B0\u5EFA\u6280\u80FD",createLead:"\u8FD9\u4E09\u683C\u76F4\u63A5\u5199\u6210 SKILL.md:\u524D\u4E24\u683C\u662F frontmatter,\u7B2C\u4E09\u683C\u662F\u6B63\u6587\u3002",fieldName:"\u6280\u80FD\u540D",fieldNameHint:"\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u8FDE\u5B57\u7B26\u3002\u8FD9\u4E2A\u540D\u5B57\u5C31\u662F / \u8C03\u7528\u65F6\u7528\u7684\u3002",fieldDescription:"\u63CF\u8FF0",fieldDescriptionHint:"\u8FD9\u6BB5\u5E38\u9A7B\u4E0A\u4E0B\u6587\u3002\u5199\u6E05\u4EC0\u4E48\u65F6\u5019\u8BE5\u7528\u5B83,\u522B\u5199\u5B9E\u73B0\u7EC6\u8282\u3002",fieldInstructions:"\u6307\u4EE4",create:"\u521B\u5EFA",cancel:"\u53D6\u6D88",aiTitle:"\u8BA9 dsh \u5E2E\u6211\u5199",aiLead:"\u4E0D\u5F39\u8868\u5355\u3002\u4E0B\u9762\u8FD9\u6BB5 prompt \u9001\u8FDB\u8F93\u5165\u6846,\u7531 agent \u81EA\u5DF1\u95EE\u4F60\u3001\u81EA\u5DF1\u5199\u6587\u4EF6\u3002",aiPrompt:"\u6211\u4EEC\u4E00\u8D77\u505A\u4E00\u4E2A\u6280\u80FD\u3002\u5148\u95EE\u6211\u8FD9\u4E2A\u6280\u80FD\u8981\u5E72\u4EC0\u4E48\u3001\u4EC0\u4E48\u65F6\u5019\u8BE5\u89E6\u53D1,\u518D\u628A SKILL.md \u5199\u5230 ~/.agents/skills/,\u6700\u540E\u7528\u4E24\u4E2A\u6D4B\u8BD5\u95EE\u9898\u9A8C\u4E00\u4E0B\u63CF\u8FF0\u80FD\u4E0D\u80FD\u6B63\u786E\u89E6\u53D1\u3002",aiInsert:"\u9001\u8FDB\u8F93\u5165\u6846",aiInserted:"\u5DF2\u590D\u5236 \u2014\u2014 \u7C98\u8FDB\u8F93\u5165\u6846\u5373\u53EF\u3002",directoryTitle:"\u627E\u6280\u80FD",directoryLead:"GitHub \u4E0A\u7684\u6280\u80FD\u4ED3\u5E93\u3002\u9009\u4E2D\u4E00\u4E2A\u4F1A\u6253\u5F00\u5B89\u88C5\u6D41\u7A0B,\u5148\u4E0B\u8F7D\u4E0B\u6765,\u518D\u8BA9\u4F60\u6311\u5176\u4E2D\u54EA\u51E0\u4E2A\u6280\u80FD\u8981\u88C5\u3002",searchRepos:"\u641C\u7D22\u4ED3\u5E93\u2026",searchGo:"\u641C\u7D22",openOnGithub:"\u5728 GitHub \u6253\u5F00",installReview:"\u5B89\u88C5 \u2014\u2014 \u5148\u770B\u8981\u88C5\u4EC0\u4E48",directoryNote:"\u8FD9\u662F\u7B2C\u4E09\u65B9\u4EE3\u7801\u3002\u5B89\u88C5\u6D41\u7A0B\u4F1A\u7ED9\u4F60\u770B\u4E0B\u8F7D\u4E86\u4EC0\u4E48\u3001\u5E76\u6821\u9A8C\u843D\u5730\u60C5\u51B5\u2014\u2014\u4F46\u628A\u4E00\u4E2A\u6280\u80FD\u4EA4\u7ED9\u4F60\u7684\u673A\u5668\u4E4B\u524D,\u5148\u8BFB\u5B83\u7684 SKILL.md\u3002",install:"\u5B89\u88C5",registryEmpty:"\u8FD9\u4E2A\u641C\u7D22\u6CA1\u6709\u7ED3\u679C\u3002",registryError:"GitHub \u641C\u7D22\u5931\u8D25:{error}"};function ve(e,t){return typeof t=="bigint"?t.toString():t}var J="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function H(e,t,r){let n=new e._zod.constr(t??e._zod.def);return(!t||r?.parent)&&(n._zod.parent=e),n}function Y(e){let t=e;if(!t)return{};if(typeof t=="string")return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error=="string"?{...t,error:()=>t.error}:t}function j(e,t=0){if(e.aborted===!0)return!0;for(let r=t;r<e.issues.length;r++)if(e.issues[r]?.continue!==!0)return!0;return!1}function ye(e,t=0){if(e.aborted===!0)return!0;for(let r=t;r<e.issues.length;r++)if(e.issues[r]?.continue===!1)return!0;return!1}function D(e){return typeof e=="string"?e:e?.message}function Q(e,t,r){var n;for(let i=t;i<e.length;i++)(n=e[i]).schema??(n.schema=r)}function R(e,t,r){var n;let i=e.inst?._zod?.traits;i?.has("$ZodType")&&(i.has("$ZodCheck")?(n=e).schema??(n.schema=e.inst):e.schema=e.inst);let u=e.schema!==e.inst?e.schema?._zod.def?.error:void 0,g=e.message?e.message:D(e.inst?._zod.def?.error?.(e))??D(u?.(e))??D(t?.error?.(e))??D(r.customError?.(e))??D(r.localeError?.(e))??"Invalid input",o={};for(let s of Object.keys(e))s==="inst"||s==="schema"||s==="continue"||s==="input"||s==="__proto__"||(o[s]=e[s]);return o.path??(o.path=[]),o.message=g,t?.reportInput&&(o.input=e.input),o}function we(e,t){for(let r in t){let n=Object.getOwnPropertyDescriptor(t,r);n.get?Object.defineProperty(e,r,{...n,enumerable:!1}):Je(e,r,n.value)}}function M(e,t,r,n=!0){return Object.defineProperty(e,t,{configurable:!0,writable:!0,enumerable:n,value:r}),r}function _e(e,t,r){return M(e,t,r,!1)}function Je(e,t,r){Object.defineProperty(e,t,{configurable:!0,get(){return this==null?r:M(this,t,r.bind(this))},set(n){M(this,t,n)}})}var ke;var ee={value:void 0,enumerable:!1},ze="captureStackTrace"in Error?Error:null;function Ye(e){let t=ze;if(t){let r=t.stackTraceLimit;if(typeof r=="number"){try{t.stackTraceLimit=0}catch{return ze=null,new e}try{return new e}finally{t.stackTraceLimit=r}}}return new e}function C(e,t,r,n){let i={};function u(p){this.def=p,this.constr=d,this.traits=new Set}u.prototype=i;let g=r,o=g&&new WeakSet;function s(p,c){if(p._zod){if(p._zod.traits.has(e))return}else{ee.value=new u(c);try{Object.defineProperty(p,"_zod",ee)}finally{ee.value=void 0}}if(p._zod.traits.add(e),t(p,c),o){let x=Object.getPrototypeOf(p),$=p._zod.constr.prototype,S=x;for(;S&&S!==$;)S=Object.getPrototypeOf(S);let z=S??x;o.has(z)||(o.add(z),we(z,g))}let y=d.prototype;for(let x in y)Object.prototype.hasOwnProperty.call(y,x)&&(x in p||(p[x]=y[x].bind(p)))}let f=n?.Parent??Object;class m extends f{}Object.defineProperty(m,"name",{value:e});function d(p){let c=n?.Parent?Ye(m):this;s(c,p);let y=c._zod.deferred;if(y){for(let $ of y)$();c._zod.deferred=void 0}let x=globalThis.__zod_globalConfig?.postProcessor;return x&&x(c),c}return Object.defineProperty(d,"init",{value:s}),Object.defineProperty(d,Symbol.hasInstance,{value:p=>n?.Parent&&p instanceof n.Parent?!0:p?._zod?.traits?.has(e)}),Object.defineProperty(d,"name",{value:e}),d}var A=class extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}};(ke=globalThis).__zod_globalConfig??(ke.__zod_globalConfig={});var te=globalThis.__zod_globalConfig;function T(e){return e&&Object.assign(te,e),te}function Qe(){let e=this._zod;return e.message??(e.message=JSON.stringify(e.def,ve,2)),e.message}function et(e){this._zod.message=e}var tt={get:Qe,set:et,enumerable:!0,configurable:!0},re={value:void 0,enumerable:!1},Pe=new WeakSet([Object.prototype,Error.prototype]),Ze=(e,t)=>{e.name="$ZodError",re.value=t,Object.defineProperty(e,"issues",re),re.value=void 0,Object.defineProperty(e,"message",tt);let r=Object.getPrototypeOf(e);Pe.has(r)||(Pe.add(r),Object.defineProperty(r,"toString",{configurable:!0,enumerable:!1,get(){let n=()=>this.message;return Object.defineProperty(this,"toString",{value:n,configurable:!0,writable:!0}),n},set(n){Object.defineProperty(this,"toString",{value:n,configurable:!0,writable:!0})}}))},It=C("$ZodError",Ze),F=C("$ZodError",Ze,void 0,{Parent:Error});var nt=e=>{let t=(r,n,i,u)=>{let g=i?{...i,async:!1}:{async:!1},o=r._zod.run({value:n,issues:[]},g);if(o instanceof Promise)throw new A;if(o.issues.length){let s=new(u?.Err??e)(o.issues.map(f=>R(f,g,T())));throw J(s,u?.callee??t),s}return o.value};return t},ne=nt(F),ot=e=>{let t=async(r,n,i,u)=>{let g=i?{...i,async:!0}:{async:!0},o=r._zod.run({value:n,issues:[]},g);if(o instanceof Promise&&(o=await o),o.issues.length){let s=new(u?.Err??e)(o.issues.map(f=>R(f,g,T())));throw J(s,u?.callee??t),s}return o.value};return t},oe=ot(F),it=e=>(t,r,n)=>{let i=n?{...n,async:!1}:{async:!1},u=t._zod.run({value:r,issues:[]},i);if(u instanceof Promise)throw new A;return u.issues.length?Se(e,u.issues,i):{success:!0,data:u.value}},ie=it(F);function Se(e,t,r){let n;return{success:!1,get error(){return n||(n=new e(t.map(i=>R(i,r,T()))),t=void 0,r=void 0),n},set error(i){n=i,t=void 0,r=void 0}}}var st=e=>async(t,r,n)=>{let i=n?{...n,async:!0}:{async:!0},u=t._zod.run({value:r,issues:[]},i);return u instanceof Promise&&(u=await u),u.issues.length?Se(e,u.issues,i):{success:!0,data:u.value}},se=st(F);var Ae=/^[\s\S]{0,}$/;var Me={major:4,minor:6,patch:7};var ae=C("$ZodType",(e,t)=>{var r;e??(e={}),e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=Me;let n=e._zod.def.checks,i=e._zod.traits.has("$ZodCheck")?[e,...n??[]]:n?.length?[...n]:[];for(let u of i)for(let g of u._zod.onattach)g(e);if(i.length===0)(r=e._zod).deferred??(r.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let u=(o,s,f)=>{if(o.memo)return o;let m=j(o),d;for(let p of s){if(p._zod.def.when){if(ye(o)||!p._zod.def.when(o))continue}else if(m)continue;let c=o.issues.length,y=p._zod.check(o);if(y instanceof Promise&&f?.async===!1)throw new A;if(d||y instanceof Promise)d=(d??Promise.resolve()).then(async()=>{await y,o.issues.length!==c&&(Q(o.issues,c,e),m||(m=j(o,c)))});else{if(o.issues.length===c)continue;Q(o.issues,c,e),m||(m=j(o,c))}}return d?d.then(()=>o):o},g=(o,s,f)=>{if(j(o))return o.aborted=!0,o;let m=u(s,i,f);if(m instanceof Promise){if(f.async===!1)throw new A;return m.then(d=>e._zod.parse(d,f))}return e._zod.parse(m,f)};e._zod.run=(o,s)=>{if(s.skipChecks)return e._zod.parse(o,s);if(s.direction==="backward"){let m=e._zod.parse({value:o.value,issues:[]},{...s,skipChecks:!0});return m instanceof Promise?m.then(d=>g(d,o,s)):g(m,o,s)}let f=e._zod.parse(o,s);if(f instanceof Promise){if(s.async===!1)throw new A;return f.then(m=>u(m,i,s))}return u(f,i,s)}}},{get"~standard"(){return _e(this,"~standard",ut(this))},set"~standard"(e){M(this,"~standard",e)}}),Ne=(e,t)=>e.issues.length?{issues:e.issues.map(r=>R(r,t,T()))}:{value:e.value};async function ct(e,t){let r={async:!0};return Ne(await e._zod.run({value:t,issues:[]},r),r)}function ut(e){return{validate:t=>{let r={async:!1};try{let n=e._zod.run({value:t,issues:[]},r);if(!(n instanceof Promise))return Ne(n,r)}catch{}return ct(e,t)},vendor:"zod",version:1}}var Ee=C("$ZodString",(e,t)=>{ae.init(e,t),e._zod.pattern=t.pattern??Ae,e._zod.parse=(r,n)=>{if(t.coerce)try{r.value=String(r.value)}catch{}return typeof r.value=="string"||r.issues.push({expected:"string",code:"invalid_type",input:r.value,inst:e}),r}});function pt(e){return e.checks&&(e.checks=[...e.checks]),e}function Re(e,t){return new e(pt({type:"string",...Y(t)}))}var ft=C("ZodMiniType",(e,t)=>{if(!e._zod)throw new Error("Uninitialized schema in ZodMiniType.");ae.init(e,t),e.def=t,e.type=t.type},{get with(){return this.check},set with(e){M(this,"with",e)},parse(e,t){return ne(this,e,t,{callee:this.parse})},parseAsync(e,t){return oe(this,e,t,{callee:this.parseAsync})},safeParse(e,t){return ie(this,e,t)},safeParseAsync(e,t){return se(this,e,t)},check(...e){let t=this.def;return this.clone({...t,checks:[...t.checks??[],...e.map(r=>typeof r=="function"?{_zod:{check:r,def:{check:"custom"},onattach:[]}}:r)]},{parent:!0})},clone(e,t){return H(this,e,t)},brand(){return this},register(e,t){return e.add(this,t),this},apply(e,...t){return t.length===0?e(this):e(this,...t)}}),mt=C("ZodMiniString",(e,t)=>{Ee.init(e,t),ft.init(e,t)});function ce(e){return Re(mt,e)}var U="dsh-plugin-station";function ht(e){return Object.freeze({name:e,wire:e,source:"json",codec:Object.freeze({mode:"strict",typeSymbol:`${U}/types#Json`,schema:ce()})})}var gt=Object.freeze({mode:"strict",typeSymbol:`${U}/types#Json`,schema:ce()});function xt(e,t){return Object.freeze({id:`${U}#pluginStation/${e}`,service:"pluginStation",namespace:"pluginStation",method:e,invocation:Object.freeze({kind:"direct"}),parameters:Object.freeze(t===1?[ht("payload")]:[]),result:gt,sourceLocation:Object.freeze({file:"src/wire.ts",line:1,column:1})})}var bt=[["codePlugins",0],["setPluginDisabled",1],["removePlugin",1],["addPlugin",1],["catalog",1],["refreshCatalog",0],["restartHost",0],["pendingRestart",0]],Ie=Object.freeze(bt.map(([e,t])=>xt(e,t)));var Te=Object.freeze({package:U,descriptors:Ie});function Oe(e,t){if(!e.ok)throw new Error(`skillMcp.${t}: ${e.error?.code}: ${e.error?.message}`);return e.value}var Le="dsh-plugin-station-styles",vt=`
.dps-root, .dps-scrim {
  --dps-bg: #ffffff;
  --dps-surface: #f4f5f8;
  --dps-raise: #eaecf1;
  --dps-line: rgba(20,24,40,.14);
  --dps-line-strong: rgba(20,24,40,.26);
  --dps-text: #14171f;
  --dps-soft: rgba(20,24,40,.62);
  --dps-faint: rgba(20,24,40,.45);
  --dps-accent: #3a4fd8;
  /* Text that sits ON the accent. The accent flips light in dark mode, so a
     hardcoded white here is the same class of bug as a background without a
     colour: a pale button with pale text on it. */
  --dps-on-accent: #ffffff;
  --dps-accent-soft: rgba(58,79,216,.10);
  --dps-ok: #0f8a57;
  --dps-ok-soft: rgba(15,138,87,.10);
  --dps-warn: #a87508;
  --dps-warn-soft: rgba(168,117,8,.12);
  --dps-err: #c13b3b;
  --dps-err-soft: rgba(193,59,59,.10);
  --dps-shadow: 0 24px 60px -18px rgba(20,24,40,.35);
  color: var(--dps-text);
}
body[data-ds-dark-theme] .dps-root, body[data-ds-dark-theme] .dps-scrim {
  --dps-bg: #1a1d24;
  --dps-surface: #22262f;
  --dps-raise: #2b303b;
  --dps-line: rgba(255,255,255,.13);
  --dps-line-strong: rgba(255,255,255,.26);
  --dps-text: #e7e9ef;
  --dps-soft: rgba(231,233,239,.66);
  --dps-faint: rgba(231,233,239,.44);
  --dps-accent: #8b9bff;
  --dps-on-accent: #10131a;
  --dps-accent-soft: rgba(139,155,255,.14);
  --dps-ok: #3ed68d;
  --dps-ok-soft: rgba(62,214,141,.13);
  --dps-warn: #e3ac42;
  --dps-warn-soft: rgba(227,172,66,.14);
  --dps-err: #f27373;
  --dps-err-soft: rgba(242,115,115,.14);
  --dps-shadow: 0 24px 60px -18px rgba(0,0,0,.7);
}

.dps-root { display: flex; flex-direction: column; gap: 13px; min-width: 0; }
.dps-workbench-page { max-width: 1180px; margin: 0 auto; }
.dps-workbench-head { display: flex; align-items: flex-start; gap: 16px; padding: 18px 20px;
  border: 1px solid var(--dps-line); border-radius: 12px; background: var(--dps-bg); }
.dps-workbench-head > div:first-child { flex: 1; min-width: 0; }
.dps-workbench-head h2 { margin: 0 0 5px; font-size: 18px; }
.dps-workbench-head p { margin: 0; color: var(--dps-soft); font-size: 12.5px; line-height: 1.5; }
@media (max-width: 640px) { .dps-workbench-head { flex-direction: column; } }
.dps-head { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; }
.dps-head h3 { margin: 0 0 4px; font-size: 17px; font-weight: 600; }
.dps-head p, .dps-lede { margin: 0; font-size: 13px; opacity: .72; max-width: 62ch; line-height: 1.62; }
.dps-spacer { margin-left: auto; }
.dps-hint { font-size: 11.5px; opacity: .58; line-height: 1.55; }
.dps-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; opacity: .68; }
.dps-trunc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.dps-dim { opacity: .5; }

.dps-bar { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; font-size: 12.5px; opacity: .85; }
.dps-input, .dps-mono-input, .dps-editor, .dps-field input, .dps-field textarea {
  font: inherit; font-size: 13px; padding: 6px 10px; border-radius: 6px; color: inherit;
  background: var(--dps-surface);
  border: 1px solid var(--dps-line); }
.dps-input { flex: 1; min-width: 150px; }
.dps-mono-input, .dps-editor { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; width: 100%; }
.dps-editor { min-height: 320px; line-height: 1.7; resize: vertical; }
.dps-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.dps-field label { font-size: 12.5px; font-weight: 500; opacity: .8; }
.dps-field textarea { line-height: 1.6; resize: vertical; }
.dps-input:focus-visible, .dps-mono-input:focus-visible, .dps-editor:focus-visible,
.dps-field input:focus-visible, .dps-field textarea:focus-visible {
  outline: 2px solid var(--dps-accent); outline-offset: -1px; }

.dps-btn { font: inherit; font-size: 12.5px; padding: 5px 12px; border-radius: 6px; cursor: pointer;
  color: inherit; background: transparent; border: 1px solid var(--dps-line-strong); }
.dps-btn:hover:not(:disabled) { background: var(--dps-surface); }
.dps-btn:disabled { opacity: .45; cursor: default; }
.dps-btn.dps-primary { background: var(--dps-accent); border-color: var(--dps-accent); color: var(--dps-on-accent); font-weight: 500; }
.dps-btn:focus-visible, .dps-back:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 1px; }
.dps-back { border: 0; background: transparent; color: inherit; font: inherit; font-size: 13px;
  opacity: .72; cursor: pointer; padding: 0; align-self: flex-start; }

.dps-switch { display: inline-flex; gap: 2px; padding: 2px; border-radius: 7px;
  border: 1px solid var(--dps-line); }
.dps-switch button { border: 0; background: transparent; font: inherit; font-size: 12px;
  padding: 4px 11px; border-radius: 5px; cursor: pointer; color: inherit; opacity: .66; }
.dps-switch button[aria-selected="true"], .dps-switch button[aria-pressed="true"] {
  background: var(--dps-accent); color: var(--dps-on-accent); opacity: 1; font-weight: 600;
  box-shadow: 0 1px 4px rgba(20,24,40,.18); }
.dps-switch button:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 1px; }

.dps-menu { position: relative; }
/* Fixed, not absolute: the settings panel clips its own overflow, and an
   absolutely positioned menu lost its left half to that clip. */
.dps-menu-list { color: var(--dps-text); position: fixed; z-index: 300; min-width: 240px; max-width: min(320px, calc(100vw - 16px)); padding: 5px;
  border-radius: 8px; border: 1px solid var(--dps-line-strong);
  background: var(--dps-bg); box-shadow: var(--dps-shadow); }
.dps-menu-list button { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; white-space: nowrap;
  border: 0; background: transparent; font: inherit; font-size: 13px; color: inherit;
  padding: 7px 9px; border-radius: 5px; cursor: pointer; }
.dps-menu-list button:hover { background: var(--dps-raise); }
.dps-menu-list hr { border: 0; border-top: 1px solid var(--dps-line); margin: 5px 2px; }
.dps-g { width: 14px; text-align: center; opacity: .55; font-family: ui-monospace, monospace; font-size: 11px; flex: none; }

.dps-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.dps-table th { text-align: left; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase;
  opacity: .5; font-weight: 500; padding: 0 10px 8px;
  border-bottom: 1px solid var(--dps-line); }
.dps-table td { padding: 9px 10px; border-bottom: 1px solid var(--dps-line); vertical-align: top; }
.dps-table tr.dps-click { cursor: pointer; }
.dps-table tr.dps-click:hover td { background: var(--dps-surface); }
.dps-name { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 500; }
.dps-desc { font-size: 11.5px; opacity: .6; margin-top: 2px; line-height: 1.5; max-width: 52ch;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dps-problem { font-size: 11.5px; color: var(--dps-warn); margin-top: 4px; line-height: 1.5; max-width: 56ch; }
.dps-tok { white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.dps-tok b { font-weight: 600; font-variant-numeric: tabular-nums; font-size: 13px; }
.dps-tok span { font-size: 10.5px; opacity: .5; margin-left: 3px; }
.dps-tok em { display: block; font-style: normal; font-size: 10.5px; color: var(--dps-ok); margin-top: 1px; }
.dps-tok em.dps-muted { color: var(--dps-faint); }

/* State menu: pick directly instead of cycling. Four states behind one pill
   meant up to three blind clicks to reach the one you wanted. */
.dps-state-wrap { position: relative; display: inline-block; }
.dps-state-menu { position: fixed; z-index: 300; min-width: 260px; max-width: min(340px, calc(100vw - 16px)); padding: 5px;
  border-radius: 8px; border: 1px solid var(--dps-line-strong); background: var(--dps-bg);
  color: var(--dps-text); box-shadow: var(--dps-shadow); }
.dps-state-menu button { display: block; width: 100%; text-align: left; border: 0; background: transparent;
  color: inherit; font: inherit; padding: 7px 9px; border-radius: 5px; cursor: pointer; }
.dps-state-menu button:hover { background: var(--dps-raise); }
.dps-state-menu button[aria-current="true"] { background: var(--dps-raise); }
.dps-state-menu i { font-style: normal; font-family: ui-monospace, monospace; font-size: 11.5px; font-weight: 600; }
.dps-state-menu small { display: block; font-size: 11px; opacity: .6; line-height: 1.5; margin-top: 2px; }
.dps-state { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; font-weight: 500;
  padding: 3px 9px; border-radius: 20px; cursor: pointer; white-space: nowrap; border: 1px solid; background: transparent; }
.dps-state:disabled { opacity: .5; cursor: default; }
.dps-state:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 2px; }
.dps-s-on { color: var(--dps-ok); border-color: var(--dps-ok); background: var(--dps-ok-soft); }
.dps-s-name { color: var(--dps-warn); border-color: var(--dps-warn); background: var(--dps-warn-soft); }
.dps-s-user { color: var(--dps-accent); border-color: var(--dps-accent); background: var(--dps-accent-soft); }
.dps-s-off { opacity: .6; border-color: var(--dps-line-strong); }

.dps-page { display: flex; align-items: center; gap: 10px; font-size: 12px; opacity: .8; }
.dps-legend { display: flex; gap: 16px; flex-wrap: wrap; font-size: 11.5px; opacity: .62; line-height: 1.6; }
.dps-legend i { font-style: normal; font-family: ui-monospace, monospace; font-weight: 600; margin-right: 4px; }

.dps-chip { display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; padding: 2px 7px; border-radius: 20px; white-space: nowrap;
  border: 1px solid var(--dps-line-strong); }
.dps-chip.dps-warn { color: var(--dps-warn); border-color: var(--dps-warn); background: var(--dps-warn-soft); }
.dps-chip.dps-ok { color: var(--dps-ok); border-color: var(--dps-ok); background: var(--dps-ok-soft); }
.dps-budget { display: inline-flex; align-items: baseline; gap: 5px; font-size: 11.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 3px 10px; border-radius: 20px;
  border: 1px solid var(--dps-line); }
.dps-bl { font-size: 9.5px; opacity: .55; }
.dps-budget b { font-weight: 600; font-variant-numeric: tabular-nums; }
.dps-bd { color: var(--dps-ok); font-size: 11px; }

.dps-card { border: 1px solid var(--dps-line); border-radius: 9px; overflow: hidden; }
.dps-card + .dps-card { margin-top: 8px; }
.dps-card-off { border-style: dashed; opacity: .68; }
.dps-row { display: flex; align-items: center; gap: 10px; padding: 11px 13px; }
.dps-grow { flex: 1; min-width: 0; }
.dps-tools { border-top: 1px solid var(--dps-line); }
.dps-tool { display: flex; gap: 10px; align-items: center; padding: 6px 13px 6px 34px; font-size: 12px; }
.dps-tool code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; flex: none; }
.dps-tool > span:not(.dps-ttok) { opacity: .5; font-size: 11.5px; flex: 1; }
.dps-ttok { font-family: ui-monospace, monospace; font-size: 10.5px; opacity: .5; flex: none; font-variant-numeric: tabular-nums; }
.dps-caret { border: 0; background: transparent; color: inherit; cursor: pointer; padding: 2px 4px;
  font-family: ui-monospace, monospace; font-size: 10px; opacity: .6; flex: none; }
.dps-caret:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 1px; border-radius: 3px; }

.dps-toggle, .dps-tool-toggle { position: relative; border-radius: 11px; flex: none; cursor: pointer; padding: 0;
  border: 1px solid var(--dps-line-strong); background: var(--dps-raise);
  transition: background .15s, border-color .15s; }
.dps-toggle { width: 36px; height: 20px; }
.dps-tool-toggle { width: 28px; height: 16px; }
.dps-toggle::after, .dps-tool-toggle::after { content: ""; position: absolute; top: 2px; left: 2px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.35); transition: transform .15s; }
.dps-toggle::after { width: 14px; height: 14px; }
.dps-tool-toggle::after { width: 10px; height: 10px; top: 2px; }
.dps-toggle[aria-pressed="true"] { background: var(--dps-accent); border-color: var(--dps-accent); }
.dps-toggle[aria-pressed="true"]::after { transform: translateX(16px); background: var(--dps-on-accent); }
.dps-tool-toggle[aria-pressed="true"] { background: var(--dps-ok); border-color: var(--dps-ok); }
.dps-tool-toggle[aria-pressed="true"]::after { transform: translateX(12px); }
.dps-toggle:disabled, .dps-tool-toggle:disabled { opacity: .45; cursor: default; }
.dps-toggle:focus-visible, .dps-tool-toggle:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 2px; }

/* The tree only earns a column when there is something to choose between.
   A single-file skill used to get a 210px sidebar holding one row while the
   text it was supposed to help you read got squeezed into what was left. */
.dps-detail { display: grid; grid-template-columns: 168px minmax(0, 1fr); gap: 12px; min-height: 300px; }
.dps-detail.dps-solo { grid-template-columns: minmax(0, 1fr); }
.dps-detail.dps-solo .dps-tree { display: none; }
@media (max-width: 720px) { .dps-detail { grid-template-columns: minmax(0, 1fr); } .dps-tree { display: none; } }
.dps-tree { border: 1px solid var(--dps-line); border-radius: 8px; padding: 8px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; overflow: auto; max-height: 440px; }
.dps-tree button { display: block; width: 100%; text-align: left; border: 0; background: transparent;
  color: inherit; font: inherit; padding: 4px 8px; border-radius: 5px; cursor: pointer; opacity: .7;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dps-tree button[aria-current="true"] { background: var(--dps-raise); opacity: 1; font-weight: 500; }
.dps-tree button:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: -1px; }

.dps-pane { border: 1px solid var(--dps-line); border-radius: 8px;
  display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.dps-pane-bar { display: flex; align-items: center; gap: 8px; padding: 5px 10px; font-size: 11.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; opacity: .7;
  border-bottom: 1px solid var(--dps-line); }
.dps-seg { margin-left: auto; display: inline-flex; gap: 2px; padding: 2px; border-radius: 6px;
  border: 1px solid var(--dps-line); }
.dps-seg button { border: 0; background: transparent; padding: 3px 9px; font-family: inherit; border-radius: 4px; cursor: pointer;
  color: inherit; font-size: 11.5px; line-height: 1.3; opacity: .6; font-family: ui-monospace, monospace; }
.dps-seg button[aria-selected="true"] { background: var(--dps-raise); opacity: 1; }
.dps-seg button:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 1px; }
.dps-pre { background: var(--dps-surface); margin: 0; padding: 13px 15px; overflow: auto; max-height: 440px; font-size: 12px; line-height: 1.65;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; word-break: break-word; }

.dps-err, .dps-warnbox, .dps-okbox { padding: 10px 13px; border-radius: 8px; font-size: 12.5px; line-height: 1.6; }
.dps-err { color: var(--dps-err); border: 1px solid var(--dps-err); background: var(--dps-err-soft); }
.dps-warnbox { color: var(--dps-warn); border: 1px solid var(--dps-warn); background: var(--dps-warn-soft); }
.dps-okbox { color: var(--dps-ok); border: 1px solid var(--dps-ok); background: var(--dps-ok-soft); word-break: break-all; }
.dps-empty { padding: 26px 14px; text-align: center; font-size: 13px; opacity: .58; }

.dps-scrim { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center;
  padding: 24px; background: rgba(0,0,0,.42); }
.dps-modal { width: 100%; max-width: 540px; max-height: 86vh; overflow-y: auto; padding: 20px 22px 0;
  border-radius: 11px; border: 1px solid var(--dps-line-strong);
  background: var(--dps-bg); color: var(--dps-text); box-shadow: var(--dps-shadow);
  display: flex; flex-direction: column; gap: 11px; }
/* The card scrolls and the buttons ride the bottom of it. A repository with
   twenty skills used to push them past the edge of the screen, leaving the
   dialog with no visible way to continue or cancel.
   Flex children shrink by default, so a tall neighbour squeezed the peek row
   and the output box down to a sliver of themselves \u2014 inside a scrolling
   column nothing should shrink, it should simply scroll past. */
.dps-modal > * { flex: none; }
.dps-verify { max-height: 44vh; overflow-y: auto; }
.dps-modal .dps-pre { max-height: 34vh; }
.dps-modal.dps-wide { max-width: 760px; }
.dps-modal-head { display: flex; align-items: flex-start; gap: 10px; }
.dps-modal-head h4 { margin: 0; font-size: 16px; font-weight: 600; }
.dps-modal-head p { margin: 5px 0 0; font-size: 12.5px; opacity: .7; line-height: 1.6; }
.dps-x { margin-left: auto; border: 0; background: transparent; color: inherit; opacity: .55;
  font-size: 16px; line-height: 1; cursor: pointer; padding: 2px 4px; flex: none; }
.dps-x:hover { opacity: 1; }
.dps-x:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 2px; border-radius: 4px; }
.dps-foot { position: sticky; bottom: 0; z-index: 2; display: flex; gap: 8px; justify-content: flex-end;
  flex: none; margin: auto -22px 0; padding: 12px 22px; border-top: 1px solid var(--dps-line);
  background: var(--dps-bg); }

.dps-detect { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding: 8px 11px; border-radius: 8px;
  font-size: 12.5px; border: 1px solid var(--dps-accent); background: var(--dps-accent-soft); }
.dps-badge { font-family: ui-monospace, monospace; font-size: 9.5px; font-weight: 600; letter-spacing: .06em;
  background: var(--dps-accent); color: var(--dps-on-accent); padding: 2px 6px; border-radius: 3px; }
.dps-peek { border: 1px solid var(--dps-line); border-radius: 8px; overflow: hidden; }
.dps-peek-sum { display: block; width: 100%; text-align: left; border: 0; font: inherit; font-size: 12.5px;
  padding: 7px 11px; cursor: pointer; color: inherit; background: var(--dps-surface); opacity: .82; }
.dps-peek-sum:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: -2px; }

.dps-verify { border: 1px solid var(--dps-line); border-radius: 8px; padding: 11px 13px;
  display: flex; flex-direction: column; gap: 3px; }
.dps-verify > b { font-size: 12.5px; font-weight: 600; margin-bottom: 5px; display: flex; align-items: center; gap: 2px; flex-wrap: wrap; }
.dps-vsub { font-weight: 400; opacity: .55; font-size: 11.5px; }
.dps-v { display: flex; gap: 9px; align-items: baseline; font-size: 12.5px; line-height: 1.55; opacity: .82; }
.dps-vi { font-family: ui-monospace, monospace; font-weight: 700; flex: none; }
.dps-v-ok .dps-vi { color: var(--dps-ok); }
.dps-v-bad { opacity: 1; }
.dps-v-bad .dps-vi { color: var(--dps-warn); }
.dps-pick { display: flex; align-items: baseline; gap: 9px; padding: 4px 0; font-size: 12.5px; cursor: pointer; }
.dps-pick input { margin: 0; accent-color: var(--dps-accent); flex: none; }
.dps-pn { font-family: ui-monospace, monospace; font-weight: 500; flex: none; }
.dps-pd { opacity: .55; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }

.dps-req { font-size: 11.5px; opacity: .62; }
.dps-req > summary { cursor: pointer; font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; opacity: .75; padding: 2px 0; }
.dps-req > summary:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 2px; border-radius: 3px; }
.dps-req[open] > summary { margin-bottom: 6px; }
.dps-btn.dps-tiny { font-size: 11px; padding: 1px 7px; margin-left: 7px; font-weight: 400; }
.dps-req ul { margin: 0; padding-left: 17px; } .dps-req li { margin-bottom: 3px; line-height: 1.6; }
.dps-req code, .dps-hint code { font-family: ui-monospace, monospace; font-size: 11px;
  border: 1px solid var(--dps-line); padding: .5px 4px; border-radius: 3px; }

.dps-drop { display: block; text-align: center; padding: 32px 16px; border-radius: 9px; cursor: pointer;
  font-size: 13px; opacity: .78; border: 1.5px dashed var(--dps-line-strong);
  background: var(--dps-surface); }
.dps-drop:hover { border-color: var(--dps-accent); }
.dps-big { display: block; font-size: 24px; opacity: .5; margin-bottom: 7px; font-family: ui-monospace, monospace; }

.dps-composer { border: 1.5px solid var(--dps-accent); border-radius: 10px; padding: 13px 14px;
  background: var(--dps-accent-soft); }
.dps-composer p { margin: 0; font-size: 13.5px; line-height: 1.6; }

.dps-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
.dps-card2 { border: 1px solid var(--dps-line); border-radius: 9px; padding: 12px 14px; }
.dps-card-top { display: flex; align-items: flex-start; gap: 8px; }
.dps-cn { font-family: ui-monospace, monospace; font-size: 13px; font-weight: 500; flex: 1; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; }
.dps-act { border: 1px solid var(--dps-line-strong); background: transparent; border-radius: 6px;
  width: 24px; height: 24px; cursor: pointer; color: inherit; font-size: 12px; line-height: 1; flex: none; padding: 0; }
.dps-act:hover:not(:disabled) { background: var(--dps-raise); }
.dps-act-on { color: var(--dps-ok); border-color: var(--dps-ok); background: var(--dps-ok-soft); cursor: default; }
.dps-act:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 1px; }
.dps-cm { font-size: 11px; opacity: .55; font-family: ui-monospace, monospace; margin: 3px 0 6px;
  display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
.dps-ver { border: 1px solid var(--dps-accent); color: var(--dps-accent); padding: 0 5px; border-radius: 3px; font-size: 10px; }
.dps-link { border: 0; background: transparent; color: inherit; cursor: pointer; padding: 0; text-align: left; }
.dps-link:hover { text-decoration: underline; }
.dps-link:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 2px; border-radius: 3px; }
a.dps-btn { text-decoration: none; display: inline-block; }
.dps-topic { cursor: pointer; font-family: inherit; }
.dps-topic-on { background: var(--dps-accent); border-color: var(--dps-accent); color: var(--dps-on-accent); }
.dps-topic:focus-visible { outline: 2px solid var(--dps-accent); outline-offset: 1px; }
.dps-cd { font-size: 12px; opacity: .72; line-height: 1.55;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* code-plugin tab */
.dps-plugin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 12px; align-items: start; }
.dps-plugin-card { min-width: 0; border: 1px solid var(--dps-line); border-radius: 11px;
  background: var(--dps-bg); overflow: hidden; transition: border-color .15s, box-shadow .15s; }
.dps-plugin-card:hover { border-color: var(--dps-line-strong); box-shadow: 0 8px 24px -20px rgba(20,24,40,.55); }
.dps-plugin-card-open { grid-column: 1 / -1; }
.dps-plugin-summary { display: flex; align-items: flex-start; gap: 10px; padding: 13px 14px 8px; }
.dps-plugin-summary .dps-toggle { margin-top: 1px; }
.dps-plugin-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 0 14px 13px 38px; }
.dps-body { display: flex; flex-direction: column; gap: 10px; padding: 10px 12px 12px;
  border-top: 1px solid var(--dps-line); }
.dps-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.dps-btn.dps-danger { border-color: var(--dps-bad); color: var(--dps-bad); }
.dps-btn.dps-danger:hover:not(:disabled) { background: var(--dps-bad-bg); }
.dps-count { font-size: 12.5px; opacity: .75; padding: 2px 0; }
.dps-state { font-size: 12px; white-space: nowrap; }
.dps-restart { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
  font-size: 12.8px; background: var(--dps-warn-bg); border: 1px solid var(--dps-warn); }
.dps-why { margin: 0; font-size: 12.3px; line-height: 1.55; color: var(--dps-accent); }
.dps-select { font: inherit; font-size: 12.5px; padding: 5px 8px; border-radius: 6px; color: inherit;
  background: var(--dps-raise); border: 1px solid var(--dps-line-strong); cursor: pointer; }
.dps-mkt { gap: 6px; }
.dps-market-tabs { padding: 3px; gap: 3px; border-radius: 9px; background: var(--dps-surface); }
.dps-market-tabs button { min-width: 58px; padding: 6px 13px; transition: color .15s, background .15s, box-shadow .15s; }
.dps-market-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 12px; align-items: stretch; }
.dps-market-card { display: flex; flex-direction: column; gap: 9px; min-width: 0; padding: 14px;
  border: 1px solid var(--dps-line); border-radius: 11px; background: var(--dps-bg); }
.dps-market-card:hover { border-color: var(--dps-line-strong); background: var(--dps-surface); }
.dps-market-head { display: flex; align-items: flex-start; gap: 9px; }
.dps-market-source { margin-top: auto; padding-top: 2px; }
.dps-market-card .dps-name { line-height: 1.45; }
.dps-market-card .dps-cd, .dps-market-card .dps-why { margin: 0; }
.dps-chip.dps-cat { margin-left: 7px; font-weight: 400; opacity: .8; }
.dps-log { margin: 0; font-family: var(--dps-mono); font-size: 11.5px; line-height: 1.55;
  background: var(--dps-surface); border: 1px solid var(--dps-line); border-radius: 8px;
  padding: 9px 11px; max-height: 190px; overflow: auto; white-space: pre-wrap; }

@media (prefers-reduced-motion: reduce) { .dps-root *, .dps-modal * { transition: none !important; } }

`;function De(){if(typeof document>"u")return()=>{};if(document.getElementById(Le))return()=>{};let e=document.createElement("style");return e.id=Le,e.textContent=vt,document.head.append(e),()=>e.remove()}var je=require("react");var k=require("react/jsx-runtime");function G({marketApi:e,pluginsApi:t,t:r}){let[n,i]=(0,je.useState)("market");return(0,k.jsxs)("section",{className:"dps-root dps-workbench-page",children:[(0,k.jsxs)("div",{className:"dps-workbench-head",children:[(0,k.jsxs)("div",{children:[(0,k.jsx)("h2",{children:"Plugin Station"}),(0,k.jsx)("p",{children:"\u53D1\u73B0\u3001\u5B89\u88C5\u548C\u7BA1\u7406\u5F53\u524D DSH \u5B9E\u4F8B\u7684\u4EE3\u7801\u63D2\u4EF6\u3002"})]}),(0,k.jsxs)("div",{className:"dps-switch",role:"tablist","aria-label":"Plugin Station \u9875\u9762",children:[(0,k.jsx)("button",{type:"button",role:"tab","aria-selected":n==="market",onClick:()=>i("market"),children:"Market"}),(0,k.jsx)("button",{type:"button",role:"tab","aria-selected":n==="installed",onClick:()=>i("installed"),children:"Code plugins"})]})]}),n==="market"?(0,k.jsx)(N,{api:e,t:r}):(0,k.jsx)(E,{api:t,t:r})]})}var B="settings.pluginStation",yt="dsh-plugin-station",wt=["slots","locale","remote"];async function _t(e){e.effect(()=>e.locale.register(B,{zh:be,en:xe}),"plugin-station: dictionaries"),e.effect(()=>De(),"plugin-station: stylesheet"),await e.remote.$mount(Te);let t=e.locale.bind(B),r=(o,s)=>fe(String(t(o)??o),s),n=()=>e.get("remote.pluginStation"),i=async(o,s)=>{let f=n(),m=s===void 0?await f[o]():await f[o](JSON.stringify(s));return JSON.parse(Oe(m,o))},u={codePlugins:()=>i("codePlugins"),setPluginDisabled:async(o,s)=>{await i("setPluginDisabled",{entryId:o,disabled:s})},removePlugin:o=>i("removePlugin",{name:o}),addPlugin:o=>i("addPlugin",{spec:o}),pendingRestart:()=>i("pendingRestart"),restartHost:()=>i("restartHost")},g={catalog:o=>i("catalog",o),refreshCatalog:()=>i("refreshCatalog"),addPlugin:o=>i("addPlugin",{spec:o}),pendingRestart:()=>i("pendingRestart"),restartHost:()=>i("restartHost")};e.slots.inject("settings.plugins.tab",()=>e.slots.register({name:"settings.plugins.tab",id:"plugin-station-market",order:31,label:()=>r("marketNav"),locale:B,inject:()=>({api:g,t:r})},N)),e.slots.inject("settings.plugins.tab",()=>e.slots.register({name:"settings.plugins.tab",id:"plugin-station-code-plugins",order:30,label:()=>r("codePluginsNav"),locale:B,inject:()=>({api:u,t:r})},E)),e.slots.inject("workbench.page",()=>e.slots.register({name:"workbench.page",id:"plugin-station",order:40,label:"Plugin Station",inject:()=>({marketApi:g,pluginsApi:u,t:r})},G))}

		return module.exports;
	}
});
