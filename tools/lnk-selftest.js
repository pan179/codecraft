/* 快捷方式写入器的自检：用 cmd.exe + 哨兵文件验证 Windows 能否解析生成的 .lnk
 * 不打开任何窗口（cmd /c echo 执行完即退），纯文件层验证
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { build } = require('./make-lnk');
const { parse } = require('./lnk-parse');

const tmp = path.join(__dirname, '..', 'tmp');
fs.mkdirSync(tmp, { recursive: true });

const marker = 'C:\\Users\\Public\\lnk-sentinel.txt';
try { fs.unlinkSync(marker); } catch (_) {}

const lnkPath = path.join(tmp, 'selftest.lnk');
const lnk = build({
  target: 'C:\\Windows\\System32\\cmd.exe',
  args: '/c echo lnk-ok> ' + marker,
  workdir: 'C:\\Windows\\System32',
  icon: '',
  name: 'CodeCraft lnk selftest',
  relPath: '',
  serial: 0x1205d7bd,
});
fs.writeFileSync(lnkPath, lnk);

const meta = parse(lnkPath);
console.log('标志位:', meta.header.flagNames.join(' | '));
console.log('目标  :', meta.linkInfo.localBasePath);
console.log('参数  :', meta.strings.ARGS);
console.log('工作目录:', meta.strings.WORKDIR);

if (meta.linkInfo.localBasePath !== 'C:\\Windows\\System32\\cmd.exe') {
  console.error('✗ LinkInfo 目标路径不符');
  process.exit(1);
}

// 交给 Windows 解析并执行
try {
  execFileSync('cmd.exe', ['/c', `start "" "${lnkPath}"`], { stdio: 'ignore', timeout: 15000 });
} catch (e) {
  console.log('start 调用返回:', e.message);
}

const sleep = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const t0 = Date.now();
let ok = false;
while (Date.now() - t0 < 6000) {
  if (fs.existsSync(marker)) { ok = true; break; }
  sleep(120);
}

if (ok) {
  console.log('✓ 系统成功解析并执行了快捷方式，哨兵文件内容:', JSON.stringify(fs.readFileSync(marker, 'utf8').trim()));
  fs.unlinkSync(marker);
} else {
  console.log('✗ 未检测到哨兵文件，快捷方式可能无法被解析');
  process.exit(1);
}
