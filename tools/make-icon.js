/* 生成多尺寸 .ico（纯 Node，无依赖）
 * 设计：品牌蓝渐变圆角方块 + 白色终端提示符 >_
 * 画法：超采样绘制 -> 盒式降采样 -> PNG 编码 -> ICO 容器
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SS = 8;                       // 超采样倍数
const SIZES = [256, 128, 64, 48, 32, 24, 16];

/* ---------- 基础几何 ---------- */
function roundRect(x, y, w, h, r) {
  // 返回判断点是否在圆角矩形内的函数
  const x1 = x + r, x2 = x + w - r, y1 = y + r, y2 = y + h - r;
  return (px, py) => {
    if (px < x || px > x + w || py < y || py > y + h) return false;
    if (px >= x1 && px <= x2) return true;
    if (py >= y1 && py <= y2) return true;
    const cx = px < x1 ? x1 : x2;
    const cy = py < y1 ? y1 : y2;
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
  };
}

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function stroke(list, width) {      // list = [[x,y],[x,y],...] 折线，圆头
  return (px, py) => {
    for (let i = 0; i < list.length - 1; i++) {
      const [ax, ay] = list[i], [bx, by] = list[i + 1];
      if (segDist(px, py, ax, ay, bx, by) <= width / 2) return true;
    }
    return false;
  };
}

function lerp(a, b, t) { return a + (b - a) * t; }

/* ---------- 绘制一帧（返回 RGBA Float 数组，尺寸 = n*SS） ---------- */
function render(n) {
  const S = n * SS;
  const out = new Float32Array(S * S * 4);   // r,g,b,a  0..1，预乘前的直通值

  const bgShape = roundRect(S * 0.03, S * 0.03, S * 0.94, S * 0.94, S * 0.235);
  const chevron = stroke([[S * 0.245, S * 0.315], [S * 0.45, S * 0.5], [S * 0.245, S * 0.685]], S * 0.088);
  const bar = stroke([[S * 0.545, S * 0.688], [S * 0.775, S * 0.688]], S * 0.088);

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const px = x + 0.5, py = y + 0.5;
      if (!bgShape(px, py)) continue;

      // 渐变：左上 #3b7bf0 -> 右下 #1b46c8
      const t = (px / S * 0.45 + py / S * 0.55);
      let r = lerp(0.231, 0.106, t), g = lerp(0.482, 0.275, t), b = lerp(0.941, 0.784, t);

      // 顶部 8% 加一层白光，模拟玻璃高光
      const gloss = Math.max(0, 1 - py / (S * 0.62)) * 0.16;
      r = Math.min(1, r + gloss); g = Math.min(1, g + gloss); b = Math.min(1, b + gloss * 0.7);

      // 前景白字
      if (chevron(px, py) || bar(px, py)) { r = 1; g = 1; b = 1; }

      out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = 1;
    }
  }
  return { buf: out, S };
}

/* ---------- 盒式降采样到 n ---------- */
function downsample({ buf, S }, n) {
  const px = Buffer.alloc(n * n * 4);
  const k = SS;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let dy = 0; dy < k; dy++) {
        for (let dx = 0; dx < k; dx++) {
          const i = ((y * k + dy) * S + (x * k + dx)) * 4;
          r += buf[i]; g += buf[i + 1]; b += buf[i + 2]; a += buf[i + 3];
        }
      }
      const cnt = k * k, o = (y * n + x) * 4;
      a /= cnt;
      px[o] = Math.round((r / cnt) * 255);
      px[o + 1] = Math.round((g / cnt) * 255);
      px[o + 2] = Math.round((b / cnt) * 255);
      px[o + 3] = Math.round(a * 255);
    }
  }
  return px;
}

/* ---------- PNG 编码 ---------- */
let crcTable = null;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function png(rgba, n) {
  const raw = Buffer.alloc((n * 4 + 1) * n);
  for (let y = 0; y < n; y++) {
    raw[y * (n * 4 + 1)] = 0;           // filter: none
    rgba.copy(raw, y * (n * 4 + 1) + 1, y * n * 4, (y + 1) * n * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(n, 0);
  ihdr.writeUInt32BE(n, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 6;    // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- 打包 ICO ---------- */
function buildIco(entries) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);            // type: icon
  head.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach((e, i) => {
    const n = e.n;
    const o = i * 16;
    dir[o] = n >= 256 ? 0 : n;
    dir[o + 1] = n >= 256 ? 0 : n;
    dir[o + 2] = 0; dir[o + 3] = 0;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32BE(0, o + 8); dir.writeUInt32LE(e.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.data.length;
  });
  return Buffer.concat([head, dir, ...entries.map(e => e.data)]);
}

/* ---------- 主流程 ---------- */
const frame = render(256);
const entries = SIZES.map(n => ({ n, data: png(downsample(frame, n), n) }));
const ico = buildIco(entries);

const outDir = path.resolve(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });
const icoPath = path.join(outDir, 'icon.ico');
fs.writeFileSync(icoPath, ico);

// 同时输出一张 256 PNG，方便仓库 README 和网页预览
fs.writeFileSync(path.join(outDir, 'icon-256.png'), entries[0].data);

console.log('icon.ico 生成完成:', icoPath, ico.length, 'bytes');
console.log('包含尺寸:', SIZES.join(', '));
