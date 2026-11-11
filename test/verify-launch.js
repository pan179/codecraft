/* 验证 Chrome 的 --app 模式能正常打开本机这个单文件应用
 * 用临时 profile 启动，读取 CDP 目标列表确认标题与地址，然后立即关闭，
 * 不影响用户日常浏览器配置。
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const APP = path.join(os.homedir(), 'Apps', 'CodeCraft', 'CodeCraft.html');
const CHROME = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe');
const PORT = 9337;
const PROFILE = path.join(os.tmpdir(), 'codecraft-apptest');

function get(url) {
  return new Promise(resolve => {
    const req = http.get(url, res => {
      let d = '';
      res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(800, () => { req.destroy(); resolve(null); });
  });
}

(async () => {
  for (const f of [APP, CHROME]) if (!fs.existsSync(f)) { console.error('缺少:', f); process.exit(1); }

  const url = pathToFileURL(APP).href;
  const child = spawn(CHROME, [
    `--app=${url}`,
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run', '--no-default-browser-check',
    '--window-size=1400,900',
  ], { stdio: 'ignore' });

  let list = null;
  for (let i = 0; i < 40; i++) {
    await sleep(250);
    list = await get(`http://127.0.0.1:${PORT}/json/list`);
    if (list) break;
  }

  let ok = false;
  if (!list) {
    console.log('✗ 未能连上 Chrome 调试端口');
  } else {
    // 单文件 430KB，首屏渲染需要一点时间，轮询等标题就位
    let targets = [];
    for (let i = 0; i < 24; i++) {
      targets = JSON.parse(list).filter(t => t.type === 'page');
      if (targets.some(t => t.title)) break;
      await sleep(250);
      list = await get(`http://127.0.0.1:${PORT}/json/list`) || list;
    }
    console.log('Chrome app 窗口目标数:', targets.length);
    for (const t of targets) console.log('  title:', JSON.stringify(t.title), '\n  url  :', t.url);
    const hit = targets.find(t => /CodeCraft/.test(t.title || ''));
    ok = !!hit && /CodeCraft\.html$/.test(decodeURI(hit.url || ''));
    console.log(ok ? '✓ --app 模式成功加载本地应用，标题：' + hit.title : '✗ 未找到应用窗口');
  }

  try { child.kill('SIGKILL'); } catch (_) {}
  await sleep(400);
  try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch (_) {}
  process.exit(ok ? 0 : 1);
})();
