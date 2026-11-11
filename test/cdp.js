/* ============================================================
   极简 CDP 驱动：用 Edge headless 打开页面、执行 JS、截图
   仅依赖 Node 22 内置的 WebSocket 与 fetch
   ============================================================ */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function waitFor(fn, timeout, gap) {
  const t0 = Date.now();
  while (Date.now() - t0 < (timeout || 15000)) {
    try { const v = await fn(); if (v) return v; } catch (e) {}
    await new Promise(r => setTimeout(r, gap || 200));
  }
  return null;
}

class Session {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.waiting = new Map();
    this.events = [];
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.waiting.has(msg.id)) {
        const { resolve, reject } = this.waiting.get(msg.id);
        this.waiting.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.waiting.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
      setTimeout(() => {
        if (this.waiting.has(id)) { this.waiting.delete(id); reject(new Error('CDP 超时：' + method)); }
      }, 30000);
    });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', {
      expression: expr, returnByValue: true, awaitPromise: true, userGesture: true
    });
    if (r.exceptionDetails) throw new Error('JS 异常：' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
    return r.result.value;
  }
  async shot(file, full) {
    let params = { format: 'png' };
    if (full) {
      const m = await this.send('Page.getLayoutMetrics');
      const h = Math.min(4000, Math.ceil(m.cssContentSize ? m.cssContentSize.height : 1000));
      params = { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: h, scale: 1 } };
    }
    const r = await this.send('Page.captureScreenshot', params);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  }
}

async function launch(port) {
  port = port || 9333;
  const dir = path.join(process.env.TEMP || '/tmp', 'cc-edge-' + port);
  fs.mkdirSync(dir, { recursive: true });
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-features=Translate,MediaRouter', '--hide-scrollbars',
    '--window-size=1440,1000',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + dir,
    'about:blank'
  ], { stdio: 'ignore' });

  const list = await waitFor(async () => {
    const r = await fetch('http://127.0.0.1:' + port + '/json/list');
    const j = await r.json();
    return j && j.length ? j : null;
  }, 20000, 300);
  if (!list) { proc.kill(); throw new Error('浏览器没有启动成功'); }

  const target = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', rej);
    setTimeout(() => rej(new Error('WebSocket 连接超时')), 10000);
  });

  const s = new Session(ws);
  await s.send('Page.enable');
  await s.send('Runtime.enable');
  await s.send('Log.enable');
  return { session: s, proc, ws };
}

module.exports = { launch, waitFor };
