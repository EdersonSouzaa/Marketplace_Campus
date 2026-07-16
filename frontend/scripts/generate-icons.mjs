import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BRAND_GREEN = [47, 107, 79, 255];
const CREAM = [244, 237, 225, 255];

const currentDir = dirname(fileURLToPath(import.meta.url));
const outDir = join(currentDir, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

function createCanvas(size) {
  return new Uint8ClampedArray(size * size * 4);
}

function setPixel(data, size, x, y, [r, g, b, a]) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}

function insideRoundedSquare(x, y, size, radius) {
  const nx = x < radius ? radius : x > size - radius ? size - radius : x;
  const ny = y < radius ? radius : y > size - radius ? size - radius : y;
  if (x >= radius && x <= size - radius) return true;
  if (y >= radius && y <= size - radius) return true;
  const dx = x - nx;
  const dy = y - ny;
  return dx * dx + dy * dy <= radius * radius;
}

function fillRoundedSquare(data, size, radius, color) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (insideRoundedSquare(x, y, size, radius)) {
        setPixel(data, size, x, y, color);
      }
    }
  }
}

function fillFullSquare(data, size, color) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      setPixel(data, size, x, y, color);
    }
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  let t = lengthSquared === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;
  return Math.hypot(px - closestX, py - closestY);
}

function drawMonogram(data, size, color, glyphWidth, glyphHeight, strokeWidth) {
  const cx = size / 2;
  const cy = size / 2;
  const xL = cx - glyphWidth / 2;
  const xR = cx + glyphWidth / 2;
  const yTop = cy - glyphHeight / 2;
  const yBottom = cy + glyphHeight / 2;
  const xMid = cx;
  const yMid = yTop + glyphHeight * 0.58;

  const segments = [
    [xL, yTop, xL, yBottom],
    [xR, yTop, xR, yBottom],
    [xL, yTop, xMid, yMid],
    [xR, yTop, xMid, yMid],
  ];

  const halfStroke = strokeWidth / 2;
  const minX = Math.floor(xL - halfStroke);
  const maxX = Math.ceil(xR + halfStroke);
  const minY = Math.floor(yTop - halfStroke);
  const maxY = Math.ceil(yBottom + halfStroke);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      for (const [x1, y1, x2, y2] of segments) {
        if (distanceToSegment(x, y, x1, y1, x2, y2) <= halfStroke) {
          setPixel(data, size, x, y, color);
          break;
        }
      }
    }
  }
}

function buildIcon(size, { maskable }) {
  const data = createCanvas(size);

  if (maskable) {
    fillFullSquare(data, size, BRAND_GREEN);
    drawMonogram(data, size, CREAM, size * 0.32, size * 0.27, size * 0.06);
  } else {
    fillRoundedSquare(data, size, size * 0.22, BRAND_GREEN);
    drawMonogram(data, size, CREAM, size * 0.46, size * 0.4, size * 0.09);
  }

  return data;
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crcInput = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePNG(size, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // filter: none
    const pixelRow = Buffer.from(rgba.buffer, y * size * 4, size * 4);
    pixelRow.copy(raw, rowStart + 1);
  }

  const idatData = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdrData),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const targets = [
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
];

for (const target of targets) {
  const pixels = buildIcon(target.size, { maskable: target.maskable });
  const png = encodePNG(target.size, pixels);
  writeFileSync(join(outDir, target.file), png);
  console.log(`Gerado ${target.file} (${target.size}x${target.size})`);
}
