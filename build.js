/* ============================================================
   CodeCraft · 构建脚本
   把 src 下的 html / css / js / data 打成一个独立的 HTML 文件
   用法：node build.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');

const DATA_FILES = [
  'data/lang-python.js',
  'data/lang-c.js',
  'data/lang-cpp.js',
  'data/lang-java.js',
  'data/lang-javascript.js'
];

const APP_FILES = [
  'js/core.js',
  'js/ui.js',
  'js/runner.js',
  'js/app-base.js',
  'js/app-learn.js',
  'js/app-quiz.js',
  'js/app-misc.js'
];

for (const f of DATA_FILES.concat(APP_FILES)) {
  if (!fs.existsSync(path.join(SRC, f))) throw new Error('缺少文件：' + f);
}

const css = read('style.css');
const data = DATA_FILES.map(f => '/* ---- ' + f + ' ---- */\n' + read(f)).join('\n\n');
const app = APP_FILES.map(f => '/* ---- ' + f + ' ---- */\n' + read(f)).join('\n\n');

/* 内联到 <script> 里必须把 </script 转义，否则示例代码里的字符串会提前闭合标签 */
const safeInline = s => s
  .replace(/<\/script/gi, '<\\/script')
  .replace(/<!--/g, '<\\!--');

let html = read('index.html');
html = html.replace('/*__CSS__*/', () => css);
html = html.replace('/*__DATA__*/', () => safeInline(data));
html = html.replace('/*__APP__*/', () => safeInline(app));

if (html.includes('/*__CSS__*/') || html.includes('/*__DATA__*/') || html.includes('/*__APP__*/')) {
  throw new Error('占位符替换失败');
}

fs.mkdirSync(DIST, { recursive: true });
const out = path.join(DIST, 'CodeCraft 学习站.html');
fs.writeFileSync(out, html, 'utf8');

/* 仓库根目录同时放一份 ASCII 命名的发布产物，方便直接下载 */
const release = path.join(ROOT, 'CodeCraft.html');
fs.writeFileSync(release, html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log('已生成：' + out);
console.log('已生成：' + release);
console.log('体积：' + kb + ' KB');
