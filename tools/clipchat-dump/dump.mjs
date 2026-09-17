#!/usr/bin/env node
/**
 * clipchat-dump — read-only visual + structural snapshot of every UI state of a logged-in SPA page.
 *
 * Per state:  <out>/<state>/{dom.html, shot@1x.png, shot@2x.png, styles.json, meta.json}
 * Global:     <out>/README.md (navigation graph), <out>/index.json, <out>/network.log, <out>/_assets/fonts/*
 *
 * Runs a real Chrome (channel "chrome") on a COPY of your Chrome profile so the logged-in session is reused
 * and your live profile is never touched. Only GET/HEAD/OPTIONS are ever needed for reading; every non-GET
 * request is logged and, with --writes block, aborted.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

// ----------------------------------------------------------------------------- CLI

const DEFAULT_DENY =
  'generat|render|export|delete|remov|trash|save|submit|publish|upload|log ?out|sign ?out|pay|buy|purchase|subscribe|checkout|share|send|create|start|confirm|apply|clear|reset|cancel|duplicate|billing|invite|connect|import';

function parseArgs(list) {
  const out = {};
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (!a.startsWith('--')) continue;
    const eq = a.indexOf('=');
    if (eq > 0) { out[a.slice(2, eq)] = a.slice(eq + 1); continue; }
    const key = a.slice(2);
    const next = list[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = 'true';
    else { out[key] = next; i++; }
  }
  return out;
}

const argv = parseArgs(process.argv.slice(2));
if (argv.help) {
  console.log(`clipchat-dump — read-only UI state dump

  --url <url>                target page (default https://clipchat.ai/create/clipboard)
  --out <dir>                output dir (default ./clipchat-dump)
  --user-data-dir <dir>      Chrome user data dir (default: OS default Chrome dir)
  --profile-directory <n>    profile folder inside it (default: Default)
  --copy-profile <bool>      copy the profile to ./.chrome-profile-copy before use (default true; Chrome 136+ refuses automation on the live default dir)
  --refresh-profile          re-copy the profile even if a copy exists
  --channel chrome|chromium  browser channel (default chrome; chromium cannot decrypt Chrome cookies)
  --cdp <ws-or-http-url>     attach to an already running Chrome (--remote-debugging-port) instead of launching
  --viewport WxH             default 1440x900
  --writes log|block         log every non-GET request (default) or abort it (strict read-only)
  --allow-write <regex>      URLs that may POST even in block mode (e.g. a GraphQL read endpoint)
  --track <file>             audio file to load for the "track-loaded" branch (sends the file to the server!)
  --pause-for-track          instead of --track: pause and let you load the track by hand
  --no-track                 skip the track-loaded branch entirely
  --manual                   REPL: you drive the browser, name each state, script snapshots it
  --max-depth <n>            nesting depth of auto-exploration (default 3)
  --settle <ms>              extra wait after each action (default 700)
  --deny-text <regex>        override the destructive-button deny list
  --config <file>            config module (default ./clipchat-dump.config.mjs next to this script)
  --executable-path <path>   explicit browser binary (overrides --channel)
  --headless                 headless run (only for smoke tests; the real dump needs a visible window)
  --hard-reset               allow page reloads to recover a broken state (re-loads the track too)
`);
  process.exit(0);
}

const here = path.dirname(new URL(import.meta.url).pathname);
const userConfig = await loadConfig(argv.config ?? path.join(here, 'clipchat-dump.config.mjs'));

const cfg = {
  url: argv.url ?? 'https://clipchat.ai/create/clipboard',
  out: path.resolve(argv.out ?? './clipchat-dump'),
  userDataDir: argv['user-data-dir'] ?? defaultUserDataDir(),
  profileDir: argv['profile-directory'] ?? 'Default',
  copyProfile: argv['copy-profile'] !== 'false',
  refreshProfile: argv['refresh-profile'] === 'true',
  profileCopyDir: path.resolve(argv['profile-copy-dir'] ?? './.chrome-profile-copy'),
  channel: argv.channel ?? 'chrome',
  cdp: argv.cdp ?? null,
  viewport: parseViewport(argv.viewport ?? '1440x900'),
  writes: argv.writes ?? 'log',
  allowWrite: argv['allow-write'] ? new RegExp(argv['allow-write'], 'i') : null,
  track: argv.track ? path.resolve(argv.track) : null,
  pauseForTrack: argv['pause-for-track'] === 'true',
  noTrack: argv['no-track'] === 'true',
  manual: argv.manual === 'true',
  maxDepth: Number(argv['max-depth'] ?? 3),
  settle: Number(argv.settle ?? 700),
  denyText: new RegExp(argv['deny-text'] ?? userConfig.denyText ?? DEFAULT_DENY, 'i'),
  headless: argv.headless === 'true',
  executablePath: argv['executable-path'] ?? null,
  hardReset: argv['hard-reset'] === 'true',
  extraCandidates: userConfig.extraCandidates ?? '',
  skip: userConfig.skip ?? [],
  trackReady: userConfig.trackReady ?? 'audio, canvas, [class*="wave" i]',
  extraStates: userConfig.extraStates ?? [],
};

// ----------------------------------------------------------------------------- helpers

async function loadConfig(file) {
  try {
    if (!fs.existsSync(file)) return {};
    const mod = await import(pathToFileURL(file).href);
    const c = mod.default ?? mod;
    if (c.denyText instanceof RegExp) c.denyText = c.denyText.source;
    return c;
  } catch (e) {
    console.warn(`[config] failed to load ${file}: ${e.message}`);
    return {};
  }
}

function defaultUserDataDir() {
  const home = os.homedir();
  switch (process.platform) {
    case 'darwin': return path.join(home, 'Library', 'Application Support', 'Google', 'Chrome');
    case 'win32': return path.join(process.env.LOCALAPPDATA ?? path.join(home, 'AppData', 'Local'), 'Google', 'Chrome', 'User Data');
    default: return path.join(home, '.config', 'google-chrome');
  }
}

function parseViewport(s) {
  const m = /^(\d+)x(\d+)$/.exec(s);
  if (!m) throw new Error(`bad --viewport ${s}`);
  return { width: Number(m[1]), height: Number(m[2]) };
}

const slug = (s) => (s || '')
  .toString().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 32) || 'x';

const sha1 = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const normalizeHtml = (html) => html
  .replace(/\s+/g, ' ')
  .replace(/ style=""/g, '')
  .replace(/(id|aria-controls|aria-labelledby|aria-describedby|for)="[^"]*"/g, '')
  .replace(/style="[^"]*(transform|transition|animation|opacity)[^"]*"/g, '');

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

function isTTY() { return Boolean(process.stdin.isTTY); }
async function prompt(question) {
  if (!isTTY()) { log(`[no tty] skipping prompt: ${question}`); return ''; }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((res) => rl.question(question, res));
  rl.close();
  return ans.trim();
}

const HEAVY = new Set(['Cache', 'Code Cache', 'GPUCache', 'DawnCache', 'DawnGraphiteCache', 'DawnWebGPUCache', 'GrShaderCache', 'ShaderCache',
  'Service Worker', 'CacheStorage', 'blob_storage', 'File System', 'IndexedDB', 'Crashpad', 'BrowserMetrics', 'Safe Browsing',
  'optimization_guide_model_store', 'OptimizationGuidePredictionModels', 'component_crx_cache', 'extensions_crx_cache', 'Media Cache',
  'Session Storage', 'shared_proto_db', 'Sessions', 'segmentation_platform', 'PersistentOriginTrials']);

async function makeProfileCopy(src, profileDir, dest) {
  const target = path.join(dest, profileDir);
  if (fs.existsSync(target) && !cfg.refreshProfile) { log(`profile copy reused: ${dest}`); return dest; }
  if (!fs.existsSync(path.join(src, profileDir))) throw new Error(`profile "${profileDir}" not found in ${src}`);
  log(`copying profile ${src}/${profileDir} -> ${dest} (caches skipped) ...`);
  await fsp.rm(dest, { recursive: true, force: true });
  await fsp.mkdir(dest, { recursive: true });
  for (const f of ['Local State', 'First Run']) {
    if (fs.existsSync(path.join(src, f))) await fsp.copyFile(path.join(src, f), path.join(dest, f)).catch(() => {});
  }
  await fsp.cp(path.join(src, profileDir), target, {
    recursive: true, force: true, errorOnExist: false, dereference: false,
    filter: (p) => {
      const base = path.basename(p);
      if (HEAVY.has(base)) return false;
      if (/^(Singleton|lockfile|LOCK$)/.test(base) || base.endsWith('.lock')) return false;
      return true;
    },
  }).catch((e) => log(`[copy] partial: ${e.message}`));
  for (const lock of ['SingletonLock', 'SingletonSocket', 'SingletonCookie', 'lockfile']) {
    await fsp.rm(path.join(dest, lock), { force: true }).catch(() => {});
  }
  return dest;
}

// ----------------------------------------------------------------------------- browser

let browser = null, context = null, page = null, mode = 'persistent';
const netlog = [];
const writeUrls = new Map();

async function launch() {
  if (cfg.cdp) {
    mode = 'cdp';
    browser = await chromium.connectOverCDP(cfg.cdp);
    context = browser.contexts()[0] ?? (await browser.newContext());
    page = context.pages().find((p) => p.url().startsWith(cfg.url.split('?')[0])) ?? context.pages()[0] ?? (await context.newPage());
    await page.setViewportSize(cfg.viewport).catch(() => {});
  } else {
    let udd = cfg.userDataDir;
    if (cfg.copyProfile) udd = await makeProfileCopy(cfg.userDataDir, cfg.profileDir, cfg.profileCopyDir);
    const opts = {
      headless: cfg.headless,
      viewport: cfg.viewport,
      deviceScaleFactor: 2,
      args: [`--profile-directory=${cfg.profileDir}`, '--disable-blink-features=AutomationControlled', '--no-first-run', '--no-default-browser-check'],
      ignoreDefaultArgs: ['--enable-automation'],
      acceptDownloads: false,
    };
    if (cfg.executablePath) opts.executablePath = cfg.executablePath;
    else if (cfg.channel !== 'chromium') opts.channel = cfg.channel;
    context = await chromium.launchPersistentContext(udd, opts);
    page = context.pages()[0] ?? (await context.newPage());
    for (const p of context.pages()) if (p !== page) await p.close().catch(() => {});
  }
  await context.route('**/*', (route) => {
    const req = route.request();
    const m = req.method();
    const line = `${new Date().toISOString()} ${m} ${req.resourceType()} ${req.url()}`;
    if (m !== 'GET' && m !== 'HEAD' && m !== 'OPTIONS') {
      writeUrls.set(`${m} ${req.url().split('?')[0]}`, (writeUrls.get(`${m} ${req.url().split('?')[0]}`) ?? 0) + 1);
      if (cfg.writes === 'block' && !(cfg.allowWrite && cfg.allowWrite.test(req.url()))) {
        netlog.push(`[BLOCKED] ${line}`);
        return route.abort('blockedbyclient');
      }
      netlog.push(`[WRITE]   ${line}`);
    } else {
      netlog.push(`[read]    ${line}`);
    }
    return route.continue();
  });
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  page.on('download', (d) => d.cancel().catch(() => {}));
}

async function settle(extra = cfg.settle) {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(extra);
}

function samePath(a, b) {
  try { return new URL(a).pathname.replace(/\/$/, '') === new URL(b).pathname.replace(/\/$/, ''); } catch { return false; }
}

async function gotoTarget() {
  await page.goto(cfg.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(1500);
  const needLogin = !samePath(page.url(), cfg.url) || (await page.locator('input[type="password"]').count()) > 0;
  if (needLogin) {
    log(`login required (now at ${page.url()})`);
    await prompt('>> Залогинься в открытом окне Chrome, дождись загрузки целевой страницы и нажми Enter... ');
    if (!samePath(page.url(), cfg.url)) await page.goto(cfg.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle(1500);
  }
  await page.bringToFront().catch(() => {});
}

// ----------------------------------------------------------------------------- in-page scripts

const PAGE_FN = {
  // candidates for interaction; returns plain descriptors
  candidates: ({ extra, skip }) => {
    const base = [
      '[role="tab"]', '[role="combobox"]', 'select', '[aria-haspopup]:not([aria-haspopup="false"])',
      '[aria-expanded]', 'summary', 'button[data-state="closed"]', '[role="button"][data-state="closed"]',
      '[data-radix-collection-item][data-state]', '[role="switch"]',
    ];
    const sel = base.concat(extra ? [extra] : []).join(', ');
    const skipEls = new Set();
    for (const s of skip) for (const el of document.querySelectorAll(s)) skipEls.add(el);

    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return false;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0 || cs.pointerEvents === 'none') return false;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
      return true;
    };
    const cssPath = (el) => {
      const parts = [];
      let cur = el;
      while (cur && cur.nodeType === 1 && cur !== document.body) {
        const tid = cur.getAttribute('data-testid') || cur.getAttribute('data-test') || cur.getAttribute('data-cy');
        if (tid) { parts.unshift(`[data-testid="${tid}"]`); break; }
        if (cur.id && !/^(radix|headlessui|react|:r)/.test(cur.id) && !/\d{3,}/.test(cur.id)) { parts.unshift(`#${CSS.escape(cur.id)}`); break; }
        let seg = cur.tagName.toLowerCase();
        const parent = cur.parentElement;
        if (parent) {
          const same = Array.from(parent.children).filter((c) => c.tagName === cur.tagName);
          if (same.length > 1) seg += `:nth-of-type(${same.indexOf(cur) + 1})`;
        }
        parts.unshift(seg);
        cur = parent;
      }
      return (parts[0]?.startsWith('#') || parts[0]?.startsWith('[')) ? parts.join(' > ') : 'body > ' + parts.join(' > ');
    };
    const inPopup = (el) => Boolean(el.closest('[role="listbox"], [role="menu"], [role="dialog"], [data-radix-popper-content-wrapper], [data-state="open"][role="listbox"]'));

    const out = [];
    const seen = new Set();
    for (const el of document.querySelectorAll(sel)) {
      if (seen.has(el) || skipEls.has(el) || !visible(el)) continue;
      seen.add(el);
      const role = el.getAttribute('role') || '';
      const tag = el.tagName.toLowerCase();
      const haspopup = el.getAttribute('aria-haspopup');
      const expanded = el.getAttribute('aria-expanded');
      const state = el.getAttribute('data-state');
      let kind;
      if (role === 'tab') kind = 'tab';
      else if (tag === 'select') kind = 'native-select';
      else if (role === 'switch' || role === 'checkbox') kind = 'switch';
      else if (role === 'combobox' || (haspopup && haspopup !== 'false')) kind = 'select';
      else if (tag === 'summary' || (expanded !== null && !haspopup) || state === 'closed') kind = 'accordion';
      else continue;
      if (kind === 'switch') continue; // toggles change settings; never flip them
      const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      const label = el.getAttribute('aria-label') || el.getAttribute('title') || '';
      const isOpenNow = expanded === 'true' || state === 'open' || (tag === 'summary' && el.parentElement?.open) || el.getAttribute('aria-selected') === 'true';
      out.push({
        css: cssPath(el), kind, tag, role, text, label,
        testid: el.getAttribute('data-testid') || null,
        isOpen: Boolean(isOpenNow),
        inPopup: inPopup(el),
        options: tag === 'select' ? Array.from(el.options).map((o) => ({ value: o.value, text: o.text, selected: o.selected })) : undefined,
        rect: (() => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
      });
    }
    return out;
  },

  isOpen: (css) => {
    const el = document.querySelector(css);
    if (!el) return null;
    if (el.getAttribute('aria-expanded') === 'true') return true;
    if (el.getAttribute('data-state') === 'open') return true;
    if (el.tagName === 'SUMMARY' && el.parentElement?.open) return true;
    if (el.getAttribute('aria-selected') === 'true' && el.getAttribute('role') === 'tab') return true;
    return false;
  },

  popupOpen: () => Array.from(document.querySelectorAll('[role="listbox"], [role="menu"], [data-radix-popper-content-wrapper], [role="dialog"][data-state="open"], [data-state="open"][role="menu"]'))
    .some((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; }),

  outerHTML: () => document.documentElement.outerHTML,

  styles: () => {
    const SKIP = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'TITLE', 'NOSCRIPT', 'TEMPLATE', 'HTML']);
    const bump = (map, key, tag, sample) => {
      if (!key) return;
      const e = map[key] ??= { count: 0, tags: {}, samples: [] };
      e.count++; e.tags[tag] = (e.tags[tag] || 0) + 1;
      if (sample && e.samples.length < 3 && !e.samples.includes(sample)) e.samples.push(sample);
    };
    const fonts = {}, typography = {}, colors = {}, radii = {}, shadows = {}, gradients = {}, borders = {}, icons = {};
    let counted = 0;
    for (const el of document.querySelectorAll('*')) {
      if (SKIP.has(el.tagName)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      counted++;
      const tag = el.tagName.toLowerCase();
      const ownText = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
      const isSvg = el instanceof SVGElement;
      if (ownText) {
        const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        bump(fonts, fam, tag, ownText.slice(0, 40));
        const key = `${fam} / ${cs.fontSize} / ${cs.fontWeight} / lh ${cs.lineHeight} / ls ${cs.letterSpacing}`;
        const t = typography[key] ??= { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, count: 0, colors: {}, samples: [] };
        t.count++; t.colors[cs.color] = (t.colors[cs.color] || 0) + 1;
        if (t.samples.length < 4) t.samples.push({ tag, text: ownText.slice(0, 60) });
        bump(colors, cs.color, 'text', ownText.slice(0, 30));
      }
      if (isSvg) {
        if (cs.fill && cs.fill !== 'none') bump(icons, cs.fill, 'fill');
        if (cs.stroke && cs.stroke !== 'none') bump(icons, cs.stroke, 'stroke');
        continue;
      }
      if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') bump(colors, cs.backgroundColor, 'background', tag);
      if (cs.borderTopStyle !== 'none' && parseFloat(cs.borderTopWidth) > 0) { bump(colors, cs.borderTopColor, 'border', tag); bump(borders, `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`, tag); }
      if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) bump(colors, cs.outlineColor, 'outline', tag);
      if (cs.borderRadius && cs.borderRadius !== '0px') bump(radii, cs.borderRadius, tag);
      if (cs.boxShadow && cs.boxShadow !== 'none') bump(shadows, cs.boxShadow, tag);
      if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) bump(gradients, cs.backgroundImage, tag);
      if (cs.caretColor && ownText) bump(colors, cs.caretColor, 'caret', tag);
    }
    // custom properties + @font-face from accessible stylesheets
    const tokens = {}, fontFaces = [], keyframes = [];
    const walk = (rule, media) => {
      try {
        if (rule.type === 5 /* FONT_FACE */) {
          fontFaces.push({ family: rule.style.getPropertyValue('font-family').trim(), src: rule.style.getPropertyValue('src').trim(), weight: rule.style.getPropertyValue('font-weight').trim(), style: rule.style.getPropertyValue('font-style').trim(), display: rule.style.getPropertyValue('font-display').trim() });
          return;
        }
        if (rule.type === 7 /* KEYFRAMES */) { keyframes.push(rule.name); return; }
        if (rule.style) {
          for (let i = 0; i < rule.style.length; i++) {
            const name = rule.style[i];
            if (!name.startsWith('--')) continue;
            const scope = (media ? `@media ${media} ` : '') + (rule.selectorText || '');
            (tokens[name] ??= {})[scope] = rule.style.getPropertyValue(name).trim();
          }
        }
        if (rule.cssRules) for (const r of rule.cssRules) walk(r, rule.media ? rule.media.mediaText : media);
      } catch { /* ignore */ }
    };
    const sheets = [];
    for (const ss of document.styleSheets) {
      try { sheets.push({ href: ss.href, rules: ss.cssRules.length }); for (const r of ss.cssRules) walk(r, null); }
      catch (e) { sheets.push({ href: ss.href, error: String(e.message || e) }); }
    }
    const rootCS = getComputedStyle(document.documentElement);
    const bodyCS = getComputedStyle(document.body);
    const tokensResolved = {};
    for (const name of Object.keys(tokens)) tokensResolved[name] = rootCS.getPropertyValue(name).trim();
    const loadedFonts = Array.from(document.fonts).map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status }));
    const sortMap = (m) => Object.fromEntries(Object.entries(m).sort((a, b) => b[1].count - a[1].count));
    return {
      url: location.href, title: document.title, viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      documentClass: document.documentElement.className, bodyClass: document.body.className, colorScheme: rootCS.colorScheme,
      root: { fontFamily: rootCS.fontFamily, fontSize: rootCS.fontSize, color: rootCS.color, backgroundColor: bodyCS.backgroundColor, bodyFontFamily: bodyCS.fontFamily },
      elementsCounted: counted,
      fonts: sortMap(fonts),
      typography: Object.fromEntries(Object.entries(typography).sort((a, b) => b[1].count - a[1].count)),
      colors: sortMap(colors), iconColors: sortMap(icons), radii: sortMap(radii), shadows: sortMap(shadows), gradients: sortMap(gradients), borders: sortMap(borders),
      tokens, tokensResolved, fontFaces, loadedFonts, keyframes, stylesheets: sheets,
    };
  },
};

function rgbToHex(str) {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(str);
  if (!m) return null;
  const h = (n) => Number(n).toString(16).padStart(2, '0');
  const a = m[4] === undefined ? 1 : Number(m[4]);
  return `#${h(m[1])}${h(m[2])}${h(m[3])}` + (a < 1 ? h(Math.round(a * 255)) : '');
}

function decorateStyles(s) {
  for (const key of ['colors', 'iconColors']) {
    for (const [k, v] of Object.entries(s[key] ?? {})) v.hex = rgbToHex(k);
  }
  for (const t of Object.values(s.typography ?? {})) {
    t.colorsHex = Object.fromEntries(Object.entries(t.colors).map(([k, n]) => [rgbToHex(k) ?? k, n]));
  }
  s.palette = Object.entries(s.colors ?? {}).map(([k, v]) => ({ css: k, hex: v.hex, count: v.count, roles: Object.keys(v.tags) }));
  return s;
}

// ----------------------------------------------------------------------------- state store

const states = new Map(); // name -> record
const hashes = new Map(); // domHash -> name
const aliases = [];
const nativeSelects = [];
const fontUrls = new Set();

async function currentHash() {
  const html = await page.evaluate(PAGE_FN.outerHTML);
  return sha1(normalizeHtml(html));
}

async function snapshot(name, { parent = null, action = null, kind = 'page', pathSteps = [] } = {}) {
  name = name.replace(/[^a-z0-9_\-.]+/gi, '-');
  const html = await page.evaluate(PAGE_FN.outerHTML);
  const hash = sha1(normalizeHtml(html));
  if (hashes.has(hash) && hashes.get(hash) !== name) {
    const of = hashes.get(hash);
    log(`  = ${name} is identical to ${of} (skipped)`);
    aliases.push({ name, sameAs: of, parent, action });
    return { name, dup: of, hash };
  }
  const dir = path.join(cfg.out, name);
  await fsp.mkdir(dir, { recursive: true });
  await fsp.writeFile(path.join(dir, 'dom.html'), html);
  const fullPage = kind !== 'popup';
  await shoot(path.join(dir, 'shot@1x.png'), 1, fullPage);
  await shoot(path.join(dir, 'shot@2x.png'), 2, fullPage);
  const styles = decorateStyles(await page.evaluate(PAGE_FN.styles));
  for (const ff of styles.fontFaces) for (const m of ff.src.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) { try { const u = new URL(m[2], page.url()); if (/^https?:$/.test(u.protocol)) fontUrls.add(u.href); } catch { /* ignore */ } }
  await fsp.writeFile(path.join(dir, 'styles.json'), JSON.stringify(styles, null, 2));
  const meta = {
    name, parent, action, kind, url: page.url(), title: styles.title, capturedAt: new Date().toISOString(),
    viewport: styles.viewport, scroll: styles.scroll, domHash: hash, pathSteps,
    files: { dom: 'dom.html', shot1x: 'shot@1x.png', shot2x: 'shot@2x.png', styles: 'styles.json' },
  };
  await fsp.writeFile(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2));
  states.set(name, meta);
  hashes.set(hash, name);
  log(`  ✓ ${name}`);
  await writeIndex().catch(() => {});
  return { name, hash };
}

async function shoot(file, scale, fullPage) {
  if (mode === 'persistent') {
    await page.screenshot({ path: file, fullPage, scale: scale === 1 ? 'css' : 'device', animations: 'disabled', caret: 'hide', timeout: 30000 });
    return;
  }
  // CDP attach mode: device scale factor of the real window is whatever the OS gives; emulate for 2x.
  const cdp = await context.newCDPSession(page);
  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: cfg.viewport.width, height: cfg.viewport.height, deviceScaleFactor: scale, mobile: false });
    await page.waitForTimeout(150);
    await page.screenshot({ path: file, fullPage, scale: 'device', animations: 'disabled', caret: 'hide', timeout: 30000 });
  } finally {
    await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
    await cdp.detach().catch(() => {});
  }
}

// ----------------------------------------------------------------------------- actions

function describe(c) {
  return `${c.kind}:${c.text || c.label || c.testid || c.css}`;
}

async function clickCandidate(c) {
  const loc = page.locator(c.css).first();
  try {
    if ((await loc.count()) === 0) return false;
    await loc.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    await loc.click({ timeout: 4000 });
  } catch {
    try { await loc.click({ timeout: 3000, force: true }); } catch { return false; }
  }
  await settle();
  return true;
}

async function runStep(step) {
  if (step.click) {
    let loc = page.locator(step.click);
    if (step.text) loc = loc.filter({ hasText: step.text });
    await loc.first().click({ timeout: 8000 });
    await settle();
  } else if (step.hover) {
    await page.locator(step.hover).first().hover({ timeout: 8000 });
    await settle();
  } else if (step.press) {
    await page.keyboard.press(step.press);
    await settle(300);
  } else if (step.wait) {
    await page.waitForTimeout(Number(step.wait));
  } else if (step.type === 'track' || step.track) {
    await loadTrack();
  }
}

async function closeCandidate(c) {
  // 1) Escape (popups, radix selects, menus)
  await page.keyboard.press('Escape').catch(() => {});
  await settle(300);
  if (!(await stillOpen(c))) return true;
  // 2) click the trigger again (accordions, details)
  await clickCandidate(c);
  if (!(await stillOpen(c))) return true;
  // 3) click on an empty spot
  await page.mouse.click(2, cfg.viewport.height - 2).catch(() => {});
  await settle(300);
  return !(await stillOpen(c));
}

async function stillOpen(c) {
  const open = await page.evaluate(PAGE_FN.isOpen, c.css);
  if (open === true) return true;
  if (c.kind === 'select') return page.evaluate(PAGE_FN.popupOpen);
  return false;
}

async function candidates() {
  return page.evaluate(PAGE_FN.candidates, { extra: cfg.extraCandidates, skip: cfg.skip });
}

function allowed(c) {
  if (c.kind === 'tab') return true;
  const t = `${c.text} ${c.label} ${c.testid ?? ''}`;
  if (cfg.denyText.test(t)) { log(`  - skip (deny-list): ${describe(c)}`); return false; }
  return true;
}

let trackLoaded = false;
async function loadTrack() {
  if (cfg.track) {
    const input = page.locator('input[type="file"]');
    if ((await input.count()) > 0) {
      await input.first().setInputFiles(cfg.track);
    } else {
      const trigger = page.locator('button, [role="button"], label, a').filter({ hasText: /upload|track|audio|file|drop|browse|choose|add/i }).first();
      const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 15000 }), trigger.click()]);
      await chooser.setFiles(cfg.track);
    }
    log('track sent, waiting for it to render...');
    await page.locator(cfg.trackReady).first().waitFor({ state: 'visible', timeout: 90000 }).catch(() => log('  (trackReady selector not seen — continuing on timeout)'));
    await settle(2500);
  } else {
    await prompt('>> Загрузи трек вручную в окне Chrome, дождись отрисовки таймлайна/волны и нажми Enter... ');
    await settle(1500);
  }
  trackLoaded = true;
}

async function replay(pathSteps) {
  // soft reset: close whatever is open, then re-apply the click path (tabs are idempotent)
  await page.keyboard.press('Escape').catch(() => {});
  await page.keyboard.press('Escape').catch(() => {});
  await settle(300);
  for (const s of pathSteps) {
    if (s.kind === 'track') continue;
    await clickCandidate(s);
  }
}

async function hardReset(pathSteps) {
  await page.goto(cfg.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(1500);
  for (const s of pathSteps) {
    if (s.kind === 'track') { await loadTrack(); continue; }
    await clickCandidate(s);
  }
}

// ----------------------------------------------------------------------------- explorer

async function explore(prefix, pathSteps, depth, seenKeys, baseHash) {
  if (depth > cfg.maxDepth) return;
  const allCands = await candidates();
  const cands = allCands.filter((c) => !seenKeys.has(c.css + '|' + c.text));
  // tabs that are active in the base state of this level; re-clicking them restores the base after a sibling tab switch
  const activeTabs = allCands.filter((c) => c.kind === 'tab' && c.isOpen);
  const restorePath = [...pathSteps, ...activeTabs];
  const levelKeys = new Set(seenKeys);
  for (const c of cands) levelKeys.add(c.css + '|' + c.text);

  for (const c of cands) {
    if (!allowed(c)) continue;
    if (c.kind === 'native-select') {
      if (nativeSelects.some((n) => n.css === c.css)) continue;
      nativeSelects.push({ state: prefix, ...c });
      log(`  ~ native <select> recorded (options only): ${describe(c)}`);
      continue;
    }
    // make sure we start from the base state of this level
    if (baseHash && (await currentHash()) !== baseHash) {
      await replay(restorePath);
      if ((await currentHash()) !== baseHash) {
        if (cfg.hardReset) await hardReset(restorePath);
        else log(`  ! state drift at ${prefix || 'root'} (continuing; use --hard-reset to reload on drift)`);
      }
    }
    const before = page.url();
    if (!(await clickCandidate(c))) { log(`  - unclickable: ${describe(c)}`); continue; }
    if (!samePath(page.url(), before)) {
      log(`  - navigated away on ${describe(c)} -> ${page.url()}; going back`);
      await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await settle();
      continue;
    }
    const nameBase = c.kind === 'tab' ? `tab-${slug(c.text || c.label || c.testid)}` : `open-${slug(c.text || c.label || c.testid)}`;
    const name = prefix ? `${prefix}__${nameBase}` : nameBase;
    const kind = c.kind === 'select' ? 'popup' : c.kind === 'tab' ? 'tab' : 'accordion';
    const res = await snapshot(name, { parent: prefix || 'empty', action: { kind: c.kind, css: c.css, text: c.text, label: c.label, testid: c.testid }, kind, pathSteps: [...pathSteps, c].map(stepOf) });
    const nextPath = [...pathSteps, c];

    if (c.kind === 'tab' || c.kind === 'accordion') {
      // nested content may contain more tabs/selects/accordions
      if (!res.dup) await explore(res.name, nextPath, depth + 1, levelKeys, res.hash);
      if (c.kind === 'accordion') await closeCandidate(c);
    } else {
      // popup: look one level inside the popup for nested tabs/sub-menus (rare), then close
      if (!res.dup && depth + 1 <= cfg.maxDepth) {
        const inner = (await candidates()).filter((x) => x.inPopup && !levelKeys.has(x.css + '|' + x.text) && x.kind === 'tab');
        for (const x of inner) {
          levelKeys.add(x.css + '|' + x.text);
          if (await clickCandidate(x)) await snapshot(`${res.name}__tab-${slug(x.text || x.label)}`, { parent: res.name, action: { kind: x.kind, css: x.css, text: x.text }, kind: 'popup', pathSteps: [...nextPath, x].map(stepOf) });
        }
      }
      if (!(await closeCandidate(c))) {
        log(`  ! could not close ${describe(c)}; replaying path`);
        await replay(restorePath);
      }
    }
  }
}

const stepOf = (c) => (c.kind === 'track' ? { kind: 'track' } : { kind: c.kind, css: c.css, text: c.text || c.label || null });

async function runExtraStates() {
  for (const st of cfg.extraStates) {
    log(`extra state: ${st.name}`);
    try {
      const from = st.from && states.get(st.from);
      if (from) await replay(from.pathSteps.map((s) => ({ ...s, kind: s.kind })));
      for (const step of st.steps ?? []) await runStep(step);
      await snapshot(st.name, { parent: st.from ?? 'empty', action: { kind: 'config', steps: st.steps }, kind: st.kind ?? 'page', pathSteps: st.steps });
      await page.keyboard.press('Escape').catch(() => {});
    } catch (e) {
      log(`  ! extra state ${st.name} failed: ${e.message}`);
    }
  }
}

async function manualLoop(parentDefault) {
  if (!isTTY()) return;
  log('manual mode: drive the browser yourself; type a state name + Enter to snapshot it, "q" to finish');
  let parent = parentDefault;
  for (;;) {
    const ans = await prompt(`>> state name [parent=${parent}] (q = выход): `);
    if (!ans || ans === 'q') break;
    const [nm, kind] = ans.split(/\s+/);
    const res = await snapshot(nm, { parent, action: { kind: 'manual' }, kind: kind ?? 'page', pathSteps: [{ kind: 'manual' }] });
    parent = res.name;
  }
}

// ----------------------------------------------------------------------------- outputs

async function downloadFonts() {
  if (fontUrls.size === 0) return [];
  const dir = path.join(cfg.out, '_assets', 'fonts');
  await fsp.mkdir(dir, { recursive: true });
  const saved = [];
  for (const u of fontUrls) {
    if (u.startsWith('data:')) continue;
    try {
      const resp = await page.request.get(u, { timeout: 20000 });
      if (!resp.ok()) continue;
      const base = path.basename(new URL(u).pathname) || sha1(u);
      const file = path.join(dir, base.replace(/[^a-z0-9._-]+/gi, '_'));
      await fsp.writeFile(file, await resp.body());
      saved.push({ url: u, file: path.relative(cfg.out, file) });
    } catch (e) {
      log(`  - font download failed: ${u} (${e.message})`);
    }
  }
  return saved;
}

async function writeIndex(extra = {}) {
  const idx = {
    url: cfg.url, capturedAt: new Date().toISOString(), viewport: cfg.viewport, mode,
    states: Array.from(states.values()), aliases, nativeSelects, ...extra,
  };
  await fsp.writeFile(path.join(cfg.out, 'index.json'), JSON.stringify(idx, null, 2));
}

function mermaidId(n) { return n.replace(/[^a-zA-Z0-9_]/g, '_'); }

async function writeReadme(fonts) {
  const rows = Array.from(states.values());
  const actionText = (a) => !a ? '—' : a.kind === 'manual' ? 'manual' : a.kind === 'config' ? 'config steps' : `${a.kind}: "${a.text || a.label || a.testid || ''}"`;
  const lines = [];
  lines.push(`# clipchat-dump — ${cfg.url}`, '');
  lines.push(`Снято: ${new Date().toISOString()} · viewport ${cfg.viewport.width}×${cfg.viewport.height} · dpr 1x/2x · режим ${mode} · сеть: ${cfg.writes}`, '');
  lines.push('Каждое состояние: `dom.html` (outerHTML), `shot@1x.png`, `shot@2x.png`, `styles.json` (шрифты, типографика, цвета, токены, радиусы, тени), `meta.json` (путь кликов).', '');
  lines.push('## Состояния', '', '| state | parent | действие | тип | url |', '|---|---|---|---|---|');
  for (const s of rows) lines.push(`| [${s.name}](./${s.name}/) | ${s.parent ?? '—'} | ${actionText(s.action)} | ${s.kind} | ${s.url} |`);
  lines.push('', '## Граф навигации', '', '```mermaid', 'flowchart TD');
  for (const s of rows) {
    const label = s.name.split('__').pop();
    lines.push(`  ${mermaidId(s.name)}["${label}"]`);
    if (s.parent && s.parent !== s.name) lines.push(`  ${mermaidId(s.parent)} -->|${actionText(s.action).replace(/["|]/g, '')}| ${mermaidId(s.name)}`);
  }
  lines.push('```', '');
  lines.push('## Как воспроизвести состояние', '', 'Открыть страницу, затем выполнить `pathSteps` из `meta.json` по порядку: каждый шаг — клик по `css` (проверить, что текст совпадает с `text`). Шаг `{"kind":"track"}` — загрузка трека.', '');
  if (aliases.length) {
    lines.push('## Дубликаты (DOM идентичен другому состоянию, не сохранялись)', '', '| запрошенное | совпадает с | parent |', '|---|---|---|');
    for (const a of aliases) lines.push(`| ${a.name} | ${a.sameAs} | ${a.parent ?? '—'} |`);
    lines.push('');
  }
  if (nativeSelects.length) {
    lines.push('## Нативные `<select>` (раскрытый список рендерит ОС — не снимается; опции ниже)', '');
    for (const n of nativeSelects) lines.push(`- **${n.state || 'empty'}** · \`${n.css}\` · ${n.text || n.label}: ${n.options.map((o) => `${o.text}${o.selected ? ' (selected)' : ''}`).join(', ')}`);
    lines.push('');
  }
  if (fonts.length) {
    lines.push('## Шрифты (скачаны в `_assets/fonts/`)', '');
    for (const f of fonts) lines.push(`- \`${f.file}\` ← ${f.url}`);
    lines.push('');
  }
  lines.push('## Сеть', '', `Не-GET запросов за сессию: ${Array.from(writeUrls.values()).reduce((a, b) => a + b, 0)} (${cfg.writes === 'block' ? 'все заблокированы, кроме allow-write' : 'пропущены, см. network.log'})`, '');
  for (const [k, n] of writeUrls) lines.push(`- ${k} × ${n}`);
  lines.push('');
  await fsp.writeFile(path.join(cfg.out, 'README.md'), lines.join('\n'));
}

// ----------------------------------------------------------------------------- main

async function main() {
  await fsp.mkdir(cfg.out, { recursive: true });
  log(`out: ${cfg.out}`);
  await launch();
  await gotoTarget();

  if (cfg.manual) {
    await snapshot('empty', { kind: 'page', pathSteps: [] });
    await manualLoop('empty');
  } else {
    log('== branch: empty');
    const root = await snapshot('empty', { kind: 'page', pathSteps: [] });
    await explore('', [], 1, new Set(), root.hash);

    if (!cfg.noTrack && (cfg.track || cfg.pauseForTrack || isTTY())) {
      log('== branch: track-loaded');
      if (!cfg.track && !cfg.pauseForTrack) {
        const a = await prompt('>> Ветка "после загрузки трека": загрузить трек вручную сейчас? [y/N] ');
        if (!/^y/i.test(a)) { log('track branch skipped'); }
        else {
          await loadTrack();
        }
      } else {
        await loadTrack();
      }
      if (trackLoaded) {
        const trackStep = { kind: 'track', css: null, text: null };
        const tr = await snapshot('track-loaded', { parent: 'empty', action: { kind: 'track' }, kind: 'page', pathSteps: [stepOf(trackStep)] });
        await explore('track-loaded', [trackStep], 1, new Set(), tr.hash);
      }
    }
    await runExtraStates();
    if (isTTY()) {
      const a = await prompt('>> Авто-обход закончен. Добавить состояния вручную? [y/N] ');
      if (/^y/i.test(a)) await manualLoop('empty');
    }
  }

  const fonts = await downloadFonts();
  await fsp.writeFile(path.join(cfg.out, 'network.log'), netlog.join('\n'));
  await writeIndex({ fonts });
  await writeReadme(fonts);
  log(`done: ${states.size} states, ${aliases.length} duplicates, ${nativeSelects.length} native selects, ${fonts.length} fonts`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => {
    try { await fsp.writeFile(path.join(cfg.out, 'network.log'), netlog.join('\n')); } catch { /* ignore */ }
    if (mode === 'cdp') { await browser?.close().catch(() => {}); }
    else await context?.close().catch(() => {});
  });
