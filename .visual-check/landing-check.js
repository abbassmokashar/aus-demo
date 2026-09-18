// Headless Chrome check for the landing page layout, using the DevTools Protocol over a raw
// WebSocket client (no extra dependencies). Run: node .visual-check/landing-check.js
const net = require('net');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const SLUG = (process.argv[2] || 'study-in-switzerland').replace(/\.html$/, '');
const PAGE = 'file:///' + path.resolve(__dirname, `../${SLUG}.html`).replace(/\\/g, '/');
const SHOTS = path.join(__dirname, 'landing');

function wsConnect(url) {
  const u = new URL(url);
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(16).toString('base64');
    const sock = net.connect(Number(u.port), u.hostname, () => {
      sock.write(
        `GET ${u.pathname} HTTP/1.1\r\nHost: ${u.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n` +
          `Sec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`
      );
    });
    let buf = Buffer.alloc(0);
    let handshaken = false;
    let onFrame = null;
    const api = {
      send(obj) {
        const data = Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj));
        const mask = crypto.randomBytes(4);
        let header;
        if (data.length < 126) header = Buffer.from([0x81, 0x80 | data.length]);
        else if (data.length < 65536) {
          header = Buffer.alloc(4);
          header[0] = 0x81;
          header[1] = 0x80 | 126;
          header.writeUInt16BE(data.length, 2);
        } else {
          header = Buffer.alloc(10);
          header[0] = 0x81;
          header[1] = 0x80 | 127;
          header.writeBigUInt64BE(BigInt(data.length), 2);
        }
        const masked = Buffer.from(data);
        for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i % 4];
        sock.write(Buffer.concat([header, mask, masked]));
      },
      close() { sock.end(); },
      onFrame(fn) { onFrame = fn; }
    };
    sock.on('error', reject);
    sock.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      if (!handshaken) {
        const i = buf.indexOf('\r\n\r\n');
        if (i === -1) return;
        buf = buf.slice(i + 4);
        handshaken = true;
        resolve(api);
      }
      for (;;) {
        if (buf.length < 2) return;
        const opcode = buf[0] & 0x0f;
        const masked = (buf[1] & 0x80) !== 0;
        let len = buf[1] & 0x7f;
        let off = 2;
        if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; }
        else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10; }
        let maskKey = null;
        if (masked) { if (buf.length < off + 4) return; maskKey = buf.slice(off, off + 4); off += 4; }
        if (buf.length < off + len) return;
        let payload = Buffer.from(buf.slice(off, off + len));
        if (masked) for (let i = 0; i < payload.length; i++) payload[i] ^= maskKey[i % 4];
        buf = buf.slice(off + len);
        if (opcode === 0x8) { sock.end(); return; }
        if (opcode === 0x1 && onFrame) onFrame(payload.toString('utf8'));
      }
    });
  });
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.onFrame((txt) => {
      let msg;
      try { msg = JSON.parse(txt); } catch { return; }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.method + ' ' + JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send({ id, method, params: params || {} });
    });
  }
  async waitFor(method, timeout = 15000) {
    const started = Date.now();
    for (;;) {
      const hit = this.events.find((e) => e.method === method);
      if (hit) { this.events.splice(this.events.indexOf(hit), 1); return hit.params; }
      if (Date.now() - started > timeout) throw new Error(`Timeout waiting for ${method}`);
      await new Promise((r) => setTimeout(r, 60));
    }
  }
  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text + ' ' + (res.exceptionDetails.exception || {}).description);
    return res.result.value;
  }
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'aus-chrome-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1440,900',
    'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    try {
      const list = await getJson(`http://127.0.0.1:${PORT}/json/list`);
      target = list.find((t) => t.type === 'page');
    } catch { /* not up yet */ }
    if (!target) await sleep(300);
  }
  if (!target) throw new Error('Chrome did not expose a debugging target.');

  const ws = await wsConnect(target.webSocketDebuggerUrl);
  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');

  const results = [];
  for (const viewport of [{ w: 1440, h: 900 }, { w: 1024, h: 900 }, { w: 820, h: 900 }, { w: 390, h: 844 }]) {
    cdp.events.length = 0;
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.w, height: viewport.h, deviceScaleFactor: 1, mobile: viewport.w < 700
    });
    const loaded = cdp.waitFor('Page.loadEventFired', 30000);
    await cdp.send('Page.navigate', { url: PAGE });
    await loaded;
    await sleep(2600); // let the preloader release, the form iframe load and reveals settle

    const report = await cdp.evaluate(`(() => {
      const tab = document.getElementById('archiveTab');
      const cs = tab ? getComputedStyle(tab) : null;
      const toc = document.querySelectorAll('.archive-tab-toc-item');
      const imgs = [...document.querySelectorAll('main img, header.lp-hero img')];
      const sections = [...document.querySelectorAll('[data-chapter]')].map(el => el.getAttribute('data-chapter-label'));
      const heroBtn = document.querySelector('.lp-hero-actions .lp-btn');
      const panel = document.querySelector('.lp-form-panel');
      const targets = [...document.querySelectorAll('.lp-form-target iframe, .lp-form-target form, .lp-form-panel iframe')];
      return {
        href: location.href,
        readyState: document.readyState,
        preloaderHidden: !!document.getElementById('preloader')?.classList.contains('is-hidden'),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        tabDisplay: cs ? cs.display : 'missing',
        tabVisible: !!(tab && cs.display !== 'none' && tab.getBoundingClientRect().right <= window.innerWidth + 1),
        tabLabel: document.getElementById('archiveTabLabel')?.textContent,
        tocCount: toc.length,
        tocLabels: [...toc].map(t => t.textContent),
        sections,
        heroBtnText: heroBtn ? heroBtn.textContent.trim() : null,
        heroBtnHref: heroBtn ? heroBtn.getAttribute('href') : null,
        buttonCount: document.querySelectorAll('.lp-btn').length,
        textLinkCount: document.querySelectorAll('.lp-text-link').length,
        tuitionStrip: [...document.querySelectorAll('.lp-tuition-strip div')].map(d => d.textContent.trim()),
        wideCard: (() => {
          const p = document.querySelector('.lp-level-wide');
          if (!p) return null;
          return {
            heading: p.querySelector('h3')?.textContent,
            price: p.querySelector('.lp-price')?.textContent,
            duration: p.querySelector('.lp-level-duration')?.textContent,
            variants: [...p.querySelectorAll('.lp-variant h4')].map(h => h.textContent),
            standardSubjects: [...p.querySelectorAll('.lp-variant:not(.lp-variant-package) .lp-subject-list li')].length,
            packageItems: [...p.querySelectorAll('.lp-variant-package .lp-checklist li')].map(li => li.querySelector('strong')?.textContent),
            excluded: p.querySelector('.lp-package-excluded')?.textContent.trim(),
            columns: getComputedStyle(p.querySelector('.lp-level-wide-body')).gridTemplateColumns.split(' ').length,
            spansFullWidth: Math.round(p.getBoundingClientRect().width) === Math.round(p.parentElement.getBoundingClientRect().width)
          };
        })(),
        factsLists: [...document.querySelectorAll('.lp-facts')].map(dl => [...dl.querySelectorAll('div')].map(d => d.querySelector('dt').textContent + ': ' + d.querySelector('dd').textContent)),
        careerPanels: [...document.querySelectorAll('.lp-career-panel')].map(p => ({ heading: p.querySelector('h3').textContent, roles: p.querySelectorAll('.lp-checklist li').length })),
        mediaCards: [...document.querySelectorAll('.lp-media-card')].map(f => ({ caption: f.querySelector('figcaption').textContent, loaded: f.querySelector('img').naturalWidth > 0 })),
        levelCards: [...document.querySelectorAll('.lp-level-card')].map(c => ({
          tag: c.querySelector('.lp-level-tag')?.textContent,
          title: c.querySelector('h3')?.textContent,
          price: c.querySelector('.lp-price')?.textContent,
          forWhom: c.querySelector('.lp-level-for')?.textContent || null
        })),
        costsPanel: (() => {
          const p = document.querySelector('.lp-costs');
          if (!p) return null;
          return [...p.querySelectorAll('.lp-cost-group')].map(g => ({
            heading: g.querySelector('h3').textContent,
            rows: [...g.querySelectorAll('.lp-cost-list li')].map(li => li.querySelector('.lp-cost-amount').textContent + ' -> ' + li.querySelector('.lp-cost-label').textContent)
          }));
        })(),
        costFiguresOnPage: (() => { const m = document.body.innerText.match(/CHF [0-9'’]+/g) || []; const counts = {}; m.forEach(v => { counts[v] = (counts[v] || 0) + 1; }); return counts; })(),
        bscSubjects: [...document.querySelectorAll('.lp-level-grid .lp-level-card:first-child .lp-subject-list li')].map(li => li.textContent),
        formPanelTop: panel ? Math.round(panel.getBoundingClientRect().top + window.scrollY) : null,
        programsTop: Math.round(document.getElementById('programs').getBoundingClientRect().top + window.scrollY),
        formEmbedded: targets.length,
        imagesLoaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
        imagesTotal: imgs.length
      };
    })()`);

    const consoleErrors = cdp.events
      .filter((e) => e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error')
      .map((e) => e.params.args.map((a) => a.value || a.description).join(' '));
    const logErrors = cdp.events
      .filter((e) => e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
      .map((e) => e.params.entry.text)
      .filter((t) => !/hsforms|hs-scripts|hubspot|favicon/i.test(t));
    const exceptions = cdp.events
      .filter((e) => e.method === 'Runtime.exceptionThrown')
      .map((e) => e.params.exceptionDetails.text + ' ' + (e.params.exceptionDetails.exception?.description || ''));

    // Click the third section-navigator entry and confirm the page actually scrolls there.
    let tocClickScrolled = null;
    if (report.tocCount > 2) {
      await cdp.evaluate(`(() => { window.scrollTo(0, 0); document.querySelectorAll('.archive-tab-toc-item')[2].click(); })()`);
      await sleep(1400);
      tocClickScrolled = await cdp.evaluate(`Math.round(window.scrollY)`);
    }

    let heroAnchorScrolled = null;
    let heroLanding = null;
    await cdp.evaluate(`(() => { window.scrollTo(0, 0); document.querySelector('.lp-hero-actions .lp-btn').click(); })()`);
    await sleep(1600);
    heroAnchorScrolled = await cdp.evaluate(`Math.round(window.scrollY)`);
    heroLanding = await cdp.evaluate(`(() => {
      const navBox = document.getElementById('nav').getBoundingClientRect();
      const sec = document.getElementById('request-brochure').getBoundingClientRect();
      const h2 = document.querySelector('#request-brochure h2').getBoundingClientRect();
      return { navBottom: Math.round(navBox.bottom), sectionTop: Math.round(sec.top), headingTop: Math.round(h2.top), headingHiddenBehindNav: h2.top < navBox.bottom - 1 };
    })()`);

    results.push({ viewport: viewport.w, report, consoleErrors, logErrors, exceptions, tocClickScrolled, heroAnchorScrolled, heroLanding });

    await cdp.evaluate('window.scrollTo(0,0)');
    await sleep(300);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(path.join(SHOTS, `${SLUG}-${viewport.w}.png`), Buffer.from(shot.data, 'base64'));
  }

  for (const r of results) {
    console.log(`--- ${r.viewport}px ---`);
    console.log(JSON.stringify(r.report, null, 1));
    console.log('consoleErrors:', r.consoleErrors.length ? r.consoleErrors : 'none');
    console.log('logErrors:', r.logErrors.length ? r.logErrors : 'none');
    console.log('exceptions:', r.exceptions.length ? r.exceptions : 'none');
    console.log('tocClick scrollY:', r.tocClickScrolled, '| heroAnchor scrollY:', r.heroAnchorScrolled);
    console.log('heroLanding:', r.heroLanding);
  }

  ws.close();
  chrome.kill();
  await sleep(400);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* windows lock */ }
}

main().catch((err) => { console.error('FAILED:', err.message); process.exit(1); });
