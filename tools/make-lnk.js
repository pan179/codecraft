/* 生成 Windows 快捷方式（.lnk，MS-SHLLINK 二进制格式）
 * 用途：给 CodeCraft 生成"桌面应用"图标，指向 Chrome/Edge 的 --app 模式
 *
 * 用法：
 *   node tools/make-lnk.js --target <exe> [--args "..."] [--workdir <dir>]
 *                          [--icon <ico>] [--name <描述>] [--serial <hex>] --out <lnk>
 */
const fs = require('fs');
const path = require('path');

const CLSID = Buffer.from([
  0x01, 0x14, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
  0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46,
]);

const FLAG = {
  HasLinkInfo: 0x02,
  HasName: 0x04,
  HasRelativePath: 0x08,
  HasWorkingDir: 0x10,
  HasArguments: 0x20,
  HasIconLocation: 0x40,
  IsUnicode: 0x80,
};

function cstr(s) { return Buffer.concat([Buffer.from(s, 'latin1'), Buffer.from([0])]); }

/** 以 UTF-16LE 写 null 结尾字符串（LinkInfo 的 Unicode 字段） */
function cstrU(s) { return Buffer.concat([Buffer.from(s, 'utf16le'), Buffer.from([0, 0])]); }

function u32(n) { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0, 0); return b; }

/** VolumeID: 4 size + 4 driveType + 4 serial + 4 labelOffset + label */
function volumeId(serial) {
  const label = cstr('');            // 卷标留空
  const size = 16 + label.length;
  return Buffer.concat([u32(size), u32(3), u32(serial), u32(16), label]);
}

/** LinkInfo：LocalBasePath 指向 exe，CommonPathSuffix 为空
 *  用 0x24 头 + Unicode 字段，保证目标路径含中文（如 C:\Users\潘雄熠\...）时不乱码
 */
function linkInfo(targetPath, serial) {
  const vol = volumeId(serial);
  const baseAnsi = cstr(targetPath.replace(/[^\x00-\x7f]/g, '?'));
  const baseUni = cstrU(targetPath);
  const suffixAnsi = Buffer.from([0]);
  const suffixUni = cstrU('');
  const headerSize = 0x24;
  const volOff = headerSize;
  const baseOff = volOff + vol.length;
  const suffixOff = baseOff + baseAnsi.length;
  const baseUniOff = suffixOff + suffixAnsi.length;
  const suffixUniOff = baseUniOff + baseUni.length;
  const total = suffixUniOff + suffixUni.length;
  return Buffer.concat([
    u32(total), u32(headerSize), u32(1),          // 1 = VolumeIDAndLocalBasePath
    u32(volOff), u32(baseOff), u32(0), u32(suffixOff),
    u32(baseUniOff), u32(suffixUniOff),
    vol, baseAnsi, suffixAnsi, baseUni, suffixUni,
  ]);
}

function strData(s) {
  const buf = Buffer.from(s, 'utf16le');
  const n = Buffer.alloc(2);
  n.writeUInt16LE(s.length + 1, 0);   // CountCharacters 含结尾 \0
  return Buffer.concat([n, buf, Buffer.from([0, 0])]);
}

function build(opt) {
  let flags = FLAG.HasLinkInfo | FLAG.IsUnicode;
  if (opt.name) flags |= FLAG.HasName;
  if (opt.relPath) flags |= FLAG.HasRelativePath;
  if (opt.workdir) flags |= FLAG.HasWorkingDir;
  if (opt.args) flags |= FLAG.HasArguments;
  if (opt.icon) flags |= FLAG.HasIconLocation;

  const hdr = Buffer.alloc(76);
  hdr.writeUInt32LE(0x4c, 0);
  CLSID.copy(hdr, 4);
  hdr.writeUInt32LE(flags, 20);
  hdr.writeUInt32LE(0x20, 24);        // FILE_ATTRIBUTE_ARCHIVE
  // 28..51 时间为 0，52 文件大小为 0
  hdr.writeInt32LE(0, 56);            // IconIndex
  hdr.writeUInt32LE(1, 60);           // SW_SHOWNORMAL

  const parts = [hdr, linkInfo(opt.target, opt.serial || 0)];
  if (opt.name) parts.push(strData(opt.name));
  if (opt.relPath) parts.push(strData(opt.relPath));
  if (opt.workdir) parts.push(strData(opt.workdir));
  if (opt.args) parts.push(strData(opt.args));
  if (opt.icon) parts.push(strData(opt.icon));
  parts.push(u32(0));                 // ExtraData 终止块
  return Buffer.concat(parts);
}

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1] : def;
}

if (require.main === module) {
  const target = arg('target');
  const out = arg('out');
  if (!target || !out) {
    console.error('缺少 --target 或 --out');
    process.exit(1);
  }
  const serial = arg('serial') ? parseInt(arg('serial'), 16) : 0;
  const lnk = build({
    target,
    args: arg('args', ''),
    workdir: arg('workdir', path.dirname(target)),
    icon: arg('icon', ''),
    name: arg('name', ''),
    relPath: arg('relpath', ''),
    serial,
  });
  fs.writeFileSync(out, lnk);
  console.log('已生成:', out, lnk.length, 'bytes');
}

module.exports = { build };
