/* 把 CodeCraft 安装成本机"桌面应用"
 *  1) 复制单文件应用与图标到 %USERPROFILE%\Apps\CodeCraft
 *  2) 在桌面生成带自定义图标的快捷方式，用 Chrome --app 模式打开（无地址栏的独立窗口）
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { build, extractIdList } = require('./make-shortcut');
const { parse } = require('./lnk-parse');

const ROOT = path.resolve(__dirname, '..');
const SRC_HTML = path.join(ROOT, 'dist', 'CodeCraft 学习站.html');
const SRC_ICO = path.join(ROOT, 'assets', 'icon.ico');
const TEMPLATE = path.join(os.homedir(), 'Desktop', 'Google Chrome.lnk');

const APP_DIR = path.join(os.homedir(), 'Apps', 'CodeCraft');
const APP_HTML = path.join(APP_DIR, 'CodeCraft.html');
const APP_ICO = path.join(APP_DIR, 'icon.ico');
const LNK = path.join(os.homedir(), 'Desktop', 'CodeCraft 学习站.lnk');

const TARGET = path.win32.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe');

for (const f of [SRC_HTML, SRC_ICO, TEMPLATE, TARGET]) {
  if (!fs.existsSync(f)) { console.error('缺少文件:', f); process.exit(1); }
}

fs.mkdirSync(APP_DIR, { recursive: true });
fs.copyFileSync(SRC_HTML, APP_HTML);
fs.copyFileSync(SRC_ICO, APP_ICO);

const uri = pathToFileURL(APP_HTML).href;
const args = `--app="${uri}" --window-size=1400,900`;

const lnk = build({
  idList: extractIdList(fs.readFileSync(TEMPLATE)),
  target: TARGET,
  args,
  workdir: APP_DIR,
  icon: APP_ICO,
  name: 'CodeCraft · 多语言编程训练场',
  relPath: '..\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
  serial: 0xd7bd1205,
});
try {
  fs.writeFileSync(LNK, lnk);
} catch (e) {
  // 桌面上已存在的 .lnk 偶尔会被资源管理器/杀软短暂占用，先删再写
  try { fs.unlinkSync(LNK); fs.writeFileSync(LNK, lnk); }
  catch (e2) { console.error('写入快捷方式失败（文件可能被占用）：', e2.code || e2.message); process.exit(1); }
}

const meta = parse(LNK);
console.log('应用目录 :', APP_DIR);
console.log('应用文件 :', APP_HTML, fs.statSync(APP_HTML).size, 'bytes');
console.log('图标文件 :', APP_ICO, fs.statSync(APP_ICO).size, 'bytes');
console.log('桌面快捷 :', LNK, lnk.length, 'bytes');
console.log('目标     :', meta.linkInfo.localBasePath);
console.log('启动参数 :', meta.strings.ARGS);
console.log('描述     :', meta.strings.NAME);
console.log('图标     :', meta.strings.ICON);

const checks = [
  ['IDList 已写入', meta.items.length === 7],
  ['LinkInfo 指向 chrome.exe', /chrome\.exe$/i.test(meta.linkInfo.localBasePath)],
  ['参数含 --app', /--app="/.test(meta.strings.ARGS || '')],
  ['参数指向本机文件', (meta.strings.ARGS || '').includes(encodeURIComponent('潘雄熠')) || (meta.strings.ARGS || '').includes('CodeCraft.html')],
  ['图标为本地 ico', (meta.strings.ICON || '').endsWith('icon.ico')],
];
let ok = true;
for (const [label, pass] of checks) {
  console.log((pass ? '  ✓ ' : '  ✗ ') + label);
  if (!pass) ok = false;
}
process.exit(ok ? 0 : 1);
