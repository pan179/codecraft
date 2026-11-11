/* 解析 .lnk（MS-SHLLINK）结构，用于比对参考文件与自产物的一致性 */
const fs = require('fs');

exports.parse = parse;
exports.u16 = (b, o) => b.readUInt16LE(o);
exports.u32 = (b, o) => b.readUInt32LE(o);

function parse(file) {
  const b = fs.readFileSync(file);
  const out = { file, size: b.length, header: {}, items: [], strings: {}, linkInfo: null };
  out.header.headerSize = b.readUInt32LE(0);
  const flags = b.readUInt32LE(20);
  out.header.flags = '0x' + flags.toString(16).padStart(8, '0');
  out.header.flagNames = Object.entries({
    HasLinkTargetIDList: 0x1, HasLinkInfo: 0x2, HasName: 0x4, HasRelativePath: 0x8,
    HasWorkingDir: 0x10, HasArguments: 0x20, HasIconLocation: 0x40, IsUnicode: 0x80,
    ForceNoLinkInfo: 0x100, HasExpString: 0x200, RunInSeparateProcess: 0x400,
    HasDarwinID: 0x1000, RunAsUser: 0x2000, HasExpIcon: 0x4000,
    NoPidlAlias: 0x8000, RunWithShimLayer: 0x20000, ForceNoLinkTrack: 0x40000,
    EnableTargetMetadata: 0x80000,
  }).filter(([, v]) => flags & v).map(([k]) => k);
  out.header.fileAttributes = b.readUInt32LE(24);
  out.header.iconIndex = b.readInt32LE(56);
  out.header.showCommand = b.readUInt32LE(60);

  let p = 76;
  if (flags & 0x1) {
    const idlSize = b.readUInt16LE(p);
    out.idListSize = idlSize;
    const start = p + 2;
    let q = start;
    while (q < start + idlSize) {
      const sz = b.readUInt16LE(q);
      if (sz === 0) { q += 2; break; }
      out.items.push({ offset: q, size: sz, type: '0x' + b[q + 2].toString(16), hex: b.slice(q + 2, Math.min(q + sz, q + 2 + 48)).toString('hex') });
      q += sz;
    }
    p = start + idlSize;
  }
  if (flags & 0x2) {
    const liStart = p;
    const liSize = b.readUInt32LE(p);
    const liHdr = b.readUInt32LE(p + 4);
    const liFlags = b.readUInt32LE(p + 8);
    const volOff = b.readUInt32LE(p + 12);
    const baseOff = b.readUInt32LE(p + 16);
    const suffixOff = b.readUInt32LE(p + 20);
    const info = { size: liSize, headerSize: liHdr, flags: liFlags, volumeIdOffset: volOff, localBasePathOffset: baseOff, commonPathSuffixOffset: suffixOff };
    const cstr = off => { let e = p + off; while (b[e] !== 0) e++; return b.toString('latin1', p + off, e); };
    info.localBasePath = cstr(baseOff);
    info.commonPathSuffix = cstr(suffixOff);
    info.volumeId = { size: b.readUInt32LE(p + volOff), driveType: b.readUInt32LE(p + volOff + 4), serial: b.readUInt32LE(p + volOff + 8), labelOffset: b.readUInt32LE(p + volOff + 12) };
    info.volumeId.label = cstr(volOff + info.volumeId.labelOffset);
    out.linkInfo = info;
    p = liStart + liSize;
  }
  const readStr = () => {
    const n = b.readUInt16LE(p); p += 2;
    const s = b.toString('utf16le', p, p + n * 2);
    p += n * 2;
    return s.replace(/\0+$/, '');
  };
  if (flags & 0x4) out.strings.NAME = readStr();
  if (flags & 0x8) out.strings.RELATIVE = readStr();
  if (flags & 0x10) out.strings.WORKDIR = readStr();
  if (flags & 0x20) out.strings.ARGS = readStr();
  if (flags & 0x40) out.strings.ICON = readStr();
  out.tailBytes = p;
  return out;
}

if (require.main === module) {
  for (const f of process.argv.slice(2)) {
    console.log(JSON.stringify(parse(f), null, 2));
  }
}
