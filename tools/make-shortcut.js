/* 生成"桌面应用"快捷方式
 *
 * 思路：目标路径的 IDList（最复杂的部分）直接复用同目录下由系统生成的
 * Chrome 快捷方式，保证与 Explorer 自己写出来的字节结构一致；
 * 只重写 LinkInfo、显示名、工作目录、启动参数和图标路径。
 *
 * 用法：node tools/make-shortcut.js <模板lnk> <输出lnk> "<参数>" "<图标ico>" "<显示描述>"
 */
const fs = require('fs');
const path = require('path');

const CLSID = Buffer.from([
  0x01, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
  0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46,
]);

const FLAG = {
  HasLinkTargetIDList: 0x01,
  HasLinkInfo: 0x02,
  HasName: 0x04,
  HasRelativePath: 0x08,
  HasWorkingDir: 0x10,
  HasArguments: 0x20,
  HasIconLocation: 0x40,
  IsUnicode: 0x80,
};

const u32 = n => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0, 0); return b; };
const cstr = s => Buffer.concat([Buffer.from(s.replace(/[^\x00-\x7f]/g, '?'), 'latin1'), Buffer.from([0])]);
const cstrU = s => Buffer.concat([Buffer.from(s, 'utf16le'), Buffer.from([0, 0])]);
const strData = s => {
  const n = Buffer.alloc(2);
  n.writeUInt16LE(s.length + 1, 0);
  return Buffer.concat([n, Buffer.from(s, 'utf16le'), Buffer.from([0, 0])]);
};

/** 从参考 .lnk 中取出 LinkTargetIDList 整段（含 2 字节长度） */
function extractIdList(buf) {
  const flags = buf.readUInt32LE(20);
  if (!(flags & FLAG.HasLinkTargetIDList)) throw new Error('模板缺少 IDList');
  const size = buf.readUInt16LE(76);
  return buf.slice(76, 76 + 2 + size);
}

function linkInfo(targetPath, serial) {
  const label = cstr('');
  const vol = Buffer.concat([u32(16 + label.length), u32(3), u32(serial), u32(16), label]);
  const baseA = cstr(targetPath);
  const baseU = cstrU(targetPath);
  const sufA = Buffer.from([0]);
  const sufU = cstrU('');
  const hdr = 0x24;
  const volOff = hdr;
  const baseOff = volOff + vol.length;
  const sufOff = baseOff + baseA.length;
  const baseUOff = sufOff + sufA.length;
  const sufUOff = baseUOff + baseU.length;
  const total = sufUOff + sufU.length;
  return Buffer.concat([
    u32(total), u32(hdr), u32(1),
    u32(volOff), u32(baseOff), u32(0), u32(sufOff), u32(baseUOff), u32(sufUOff),
    vol, baseA, sufA, baseU, sufU,
  ]);
}

function build({ idList, target, args, workdir, icon, name, relPath, serial }) {
  let flags = FLAG.HasLinkTargetIDList | FLAG.HasLinkInfo | FLAG.IsUnicode;
  if (name) flags |= FLAG.HasName;
  if (relPath) flags |= FLAG.HasRelativePath;
  if (workdir) flags |= FLAG.HasWorkingDir;
  if (args) flags |= FLAG.HasArguments;
  if (icon) flags |= FLAG.HasIconLocation;

  const hdr = Buffer.alloc(76);
  hdr.writeUInt32LE(0x4c, 0);
  CLSID.copy(hdr, 4);
  hdr.writeUInt32LE(flags, 20);
  hdr.writeUInt32LE(0x20, 24);        // FILE_ATTRIBUTE_ARCHIVE
  hdr.writeInt32LE(0, 56);
  hdr.writeUInt32LE(1, 60);           // SW_SHOWNORMAL

  const parts = [hdr, idList, linkInfo(target, serial)];
  if (name) parts.push(strData(name));
  if (relPath) parts.push(strData(relPath));
  if (workdir) parts.push(strData(workdir));
  if (args) parts.push(strData(args));
  if (icon) parts.push(strData(icon));
  parts.push(u32(0));                 // ExtraData 结束标记
  return Buffer.concat(parts);
}

module.exports = { build, extractIdList };

if (require.main === module) {
  const [tpl, out, args, icon, name] = process.argv.slice(2);
  if (!tpl || !out) {
    console.error('用法: node tools/make-shortcut.js <模板lnk> <输出lnk> "<参数>" "<图标>" "<描述>"');
    process.exit(1);
  }
  const os = require('os');
  const tplBuf = fs.readFileSync(tpl);
  const idList = extractIdList(tplBuf);
  // IDList 来自模板，目标必须是模板指向的那个 chrome.exe
  const target = path.win32.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe');
  const workdir = path.win32.dirname(target);
  const relPath = '..\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
  const lnk = build({
    idList, target, args: args || '', workdir, icon: icon || '',
    name: name || '', relPath, serial: 0xd7bd1205,
  });
  fs.writeFileSync(out, lnk);
  console.log('已生成:', out, lnk.length, 'bytes（IDList', idList.length, 'bytes 来自模板）');
  console.log('目标  :', target);
}
