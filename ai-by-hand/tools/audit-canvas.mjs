#!/usr/bin/env node
// audit-canvas.mjs — Soát "độ lệch" (drift) của bộ phiếu CANVAS so với gold-standard.
// KHÔNG sửa file. Chỉ quét + báo cáo, để /phieu-dong-bo biết phiếu nào lệch ở đâu.
//
//   node tools/audit-canvas.mjs                # quét toàn bộ ai-by-hand/**.html → in báo cáo
//   node tools/audit-canvas.mjs --out report.md   # đồng thời ghi báo cáo Markdown
//   node tools/audit-canvas.mjs --file K1/A10-he-phuong-trinh.html   # chỉ 1 file (chẩn đoán)
//   node tools/audit-canvas.mjs --json         # in JSON thô (cho tool khác đọc)
//
// 4 trục soát (đúng 3 nỗi "lộn xộn" + 1 trục cấu trúc nền):
//   [A] CẤU TRÚC nền  — toolbar/footer/brand/đường dẫn tương đối/2 sheet/gọi generate()
//   [B] KHỐI GIẢNG GIẢI — scaf / intuition / why / hint / quiz / rutra có đồng đều không
//   [C] STYLE BLOCK   — mỗi file tự định nghĩa selector gì trong <style>; cái nào nên hoist vào wb-canvas.css
//   [D] BỐ CỤC/Ô/MÀU  — --cw/--ch override, .schema width, hex màu ngoài bảng canon

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');            // = ai-by-hand/
const args = process.argv.slice(2);
const getFlag = (n) => { const i = args.indexOf(n); return i >= 0 ? (args[i + 1] || true) : null; };
const OUT = getFlag('--out');
const ONLY = getFlag('--file');
const JSON_OUT = args.includes('--json');

// ---- Bảng màu CANON (từ wb-canvas.css + SVG mẫu 01). Hex ngoài tập này = nghi vấn "màu lệch". ----
const CANON = new Set([
  '#1a1a1a', '#6b7280', '#fbf9f4', '#0e7490', '#b45309',          // ink/dim/paper/accent/accent2
  '#fdecd2', '#e3c489', '#ece2ff', '#c3b1f5', '#fff3b0', '#e6cf6a', // in/w/hot
  '#d6ecf6', '#a7d3e3', '#ffe6cc', '#e3a76a',                      // out/bw
  '#e7e2d6', '#fff', '#ffffff', '#fcfaf4', '#fcf7f0', '#fcf6ef',   // nền giấy/hộp
  '#e2dccb', '#d8d2c4', '#cbcbcb', '#ddd', '#dddddd', '#ece7da',   // viền/lưới
  '#9aa3af', '#b9b9b9', '#c9c2b2', '#555', '#f9f9f9', '#f3ede0',   // trục/đường kẻ
  '#7a3d00', '#0c4a5e', '#2e1f6b', '#3a2a08',                      // chữ trên ô màu (key)
  '#7c5cff', '#5b3fd6', '#d9d2ff', '#f7f5ff', '#ffe9d2',           // tím "trực giác"
  '#bfe0ee',                                                       // bóng chiếu mẫu 01
]);

// ---- thu thập file ----
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'tools' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html') && name !== 'index.html') acc.push(p);
  }
  return acc;
}
let files = ONLY && ONLY !== true ? [join(ROOT, String(ONLY))] : walk(ROOT);
files = files.sort();

// ---- tiện ích parse ----
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const has = (s, re) => re.test(s);
const countAll = (s, re) => (s.match(re) || []).length;
const firstStyle = (s) => { const m = s.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i); return m ? m[1] : ''; };
function selectorsOf(css) {
  // bỏ comment, tách rule, lấy phần selector trước "{"
  const noC = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const sels = [];
  const re = /([^{}]+)\{[^{}]*\}/g; let m;
  while ((m = re.exec(noC))) {
    m[1].split(',').forEach((s) => { s = s.trim().replace(/\s+/g, ' '); if (s && !s.startsWith('@')) sels.push(s); });
  }
  return sels;
}
const hexes = (s) => (s.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map((h) => h.toLowerCase());

// ---- soát từng file ----
const reports = [];
const selFreq = new Map();     // selector -> Set(file)  (trục C: hoist candidate)
const nonCanon = new Map();    // hex -> count            (trục D)

for (const f of files) {
  let html;
  try { html = readFileSync(f, 'utf8'); } catch { continue; }
  const id = rel(f);
  const inFolder = id.includes('/');
  // Phân loại theo class trang: .sheet = canvas (A4 ngang); .page = dọc cũ (wb.css)
  const isCanvas = /class="sheet\b/.test(html);
  const isDoc = !isCanvas && /class="page\b/.test(html);
  const linksCanvasCss = /wb-canvas\.css/.test(html);
  const kind = isCanvas ? 'canvas' : isDoc ? 'doc' : 'unknown';
  const r = { file: id, kind, isCanvas, inFolder, linksCanvasCss, errors: [], warns: [], info: [], blocks: {}, styleSelectors: [], overrides: {} };

  if (!isCanvas) {
    if (isDoc) r.warns.push('phiếu DỌC cũ (wb.css) — CHƯA chuyển sang canvas');
    else r.warns.push('không nhận dạng được (.sheet/.page) — kiểm tay');
    reports.push(r); continue;
  }
  // canvas nhưng không dùng stylesheet chung → CSS inline trùng lặp, cần link wb-canvas.css
  if (!linksCanvasCss) r.warns.push('canvas nhưng KHÔNG link wb-canvas.css (CSS nhúng nội bộ — nên dùng stylesheet chung)');

  // [A] CẤU TRÚC
  const sheets = countAll(html, /class="sheet\b/g);
  const keySheet = /class="sheet key"/.test(html);
  const foots = countAll(html, /class="foot"/g);
  if (sheets < 2) r.errors.push(`chỉ ${sheets} .sheet (cần ≥2: ĐỀ + ĐÁP ÁN)`);
  if (!keySheet) r.errors.push('thiếu <section class="sheet key"> (trang ĐÁP ÁN)');
  if (foots !== sheets) r.warns.push(`${foots} .foot ≠ ${sheets} .sheet`);
  if (!/wb-random\.js/.test(html)) r.errors.push('thiếu <script src="wb-random.js">');
  if (!/js-randomize/.test(html)) r.errors.push('thiếu nút class="js-randomize" (🎲)');
  if (!/WB\.wire\s*\(/.test(html)) r.warns.push('thiếu WB.wire(generate)');
  if (!/\bgenerate\s*\(\s*\)\s*;/.test(html)) r.warns.push('không thấy lời gọi generate() khởi tạo (SVG có thể trống lúc tải)');
  // brand footer
  const footTexts = [...html.matchAll(/class="foot">\s*<span>([^<]*)<\/span>/g)].map((m) => m[1].trim());
  footTexts.forEach((t) => { if (!t.startsWith('Làm toán AI ✍️')) r.warns.push(`footer brand lệch: "${t.slice(0, 40)}"`); });
  // page numbering
  if (!/Trang\s*1\/\d+\s*·\s*ĐỀ/.test(html)) r.warns.push('thiếu "Trang 1/N · ĐỀ"');
  if (!/·\s*ĐÁP ÁN/.test(html)) r.warns.push('thiếu "Trang N/N · ĐÁP ÁN"');
  if (!/class="badge">ĐÁP ÁN/.test(html)) r.warns.push('thiếu badge "ĐÁP ÁN" ở .ttl trang key');
  // đường dẫn tương đối đúng vị trí file
  const wantPrefix = inFolder ? '../' : '';
  if (inFolder) {
    if (/href="wb-canvas\.css"/.test(html)) r.errors.push('file trong thư mục con nhưng href="wb-canvas.css" (thiếu ../)');
    if (/href="index\.html"/.test(html)) r.warns.push('link Mục lục thiếu ../ (href="index.html")');
    if (/src="wb-random\.js"/.test(html)) r.errors.push('script wb-random.js thiếu ../');
  } else {
    if (/href="\.\.\/wb-canvas\.css"/.test(html)) r.errors.push('file flat nhưng href="../wb-canvas.css" (thừa ../)');
  }
  if (!/class="ttl"/.test(html)) r.warns.push('thiếu .ttl (tiêu đề)');
  if (!/class="tag"/.test(html)) r.info.push('không có .tag (dòng "điền ô trắng · …") ở tiêu đề');

  // [B] KHỐI GIẢNG GIẢI
  for (const b of ['scaf', 'intuition', 'why', 'hint', 'quiz', 'rutra', 'bandh']) {
    r.blocks[b] = new RegExp(`class="[^"]*\\b${b}\\b`).test(html);
  }
  if (!r.blocks.rutra) r.warns.push('thiếu .rutra ("Rút ra") ở trang ĐÁP ÁN');
  const pedagogy = ['scaf', 'intuition', 'quiz', 'rutra'].filter((b) => r.blocks[b]).length;
  if (pedagogy === 0) r.info.push('phiếu "tối giản thuần" (không scaf/intuition/quiz/rutra)');

  // [C] STYLE BLOCK
  const css = firstStyle(html);
  const sels = [...new Set(selectorsOf(css))];
  r.styleSelectors = sels;
  r.info.push(`inline <style>: ${sels.length} selector, ${css.length} ký tự`);
  sels.forEach((s) => { if (!selFreq.has(s)) selFreq.set(s, new Set()); selFreq.get(s).add(id); });

  // [D] BỐ CỤC / Ô / MÀU
  const cw = [...html.matchAll(/--cw\s*:\s*([0-9.]+mm)/g)].map((m) => m[1]);
  const ch = [...html.matchAll(/--ch\s*:\s*([0-9.]+mm)/g)].map((m) => m[1]);
  const schemaW = [...html.matchAll(/\.schema\s*\{[^}]*width\s*:\s*([0-9.]+mm)/g)].map((m) => m[1]);
  r.overrides = {
    cw: [...new Set(cw)], ch: [...new Set(ch)], schemaWidth: [...new Set(schemaW)],
  };
  // hex ngoài canon (chỉ tính trong <style> + thuộc tính SVG fill/stroke, bỏ qua trùng canon)
  const styleHex = hexes(css);
  const svgHex = [...html.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1].toLowerCase());
  const offCanon = [...styleHex, ...svgHex].filter((h) => !CANON.has(h));
  const offSet = {};
  offCanon.forEach((h) => { offSet[h] = (offSet[h] || 0) + 1; nonCanon.set(h, (nonCanon.get(h) || 0) + 1); });
  r.offCanon = offSet;
  if (Object.keys(offSet).length) r.info.push(`màu ngoài canon: ${Object.keys(offSet).join(' ')}`);

  reports.push(r);
}

// ---- tổng hợp ----
const canvasReports = reports.filter((r) => r.isCanvas);
const docReports = reports.filter((r) => r.kind === 'doc');
const unknownReports = reports.filter((r) => r.kind === 'unknown');
const inlineCss = canvasReports.filter((r) => !r.linksCanvasCss).map((r) => r.file);
const flatCanvas = canvasReports.filter((r) => !r.inFolder).map((r) => r.file);

// selector xuất hiện trong NHIỀU file = ứng viên hoist vào wb-canvas.css
const hoist = [...selFreq.entries()].map(([s, set]) => [s, set.size]).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);
// ma trận khối giảng giải
const blockCols = ['scaf', 'intuition', 'why', 'hint', 'quiz', 'rutra'];
const blockCount = Object.fromEntries(blockCols.map((b) => [b, canvasReports.filter((r) => r.blocks[b]).length]));
// outlier màu
const colorOut = [...nonCanon.entries()].sort((a, b) => b[1] - a[1]);

if (JSON_OUT) {
  console.log(JSON.stringify({ reports, hoist, blockCount, colorOut }, null, 2));
  process.exit(0);
}

// ---- in báo cáo ----
const L = [];
const p = (s = '') => L.push(s);
p('# Báo cáo ĐỒNG BỘ phiếu canvas');
p('');
p(`Tổng: **${reports.length}** file · canvas **${canvasReports.length}** · dọc-cũ **${docReports.length}** · không rõ **${unknownReports.length}**`);
if (docReports.length) {
  p('');
  p(`> 🔻 **${docReports.length} phiếu DỌC cũ (wb.css)** — chưa chuyển canvas (ứng viên đồng bộ chính):`);
  p(`> ${docReports.map((r) => r.file).join(', ')}`);
}
if (inlineCss.length) {
  p('');
  p(`> 🟠 **${inlineCss.length} phiếu canvas nhúng CSS nội bộ** (không link wb-canvas.css) — nên dùng stylesheet chung:`);
  p(`> ${inlineCss.join(', ')}`);
}
if (flatCanvas.length) {
  p('');
  p(`> ⚠️ **${flatCanvas.length} bản canvas FLAT** (ngoài K*/) — nghi trùng bản canonical trong thư mục con:`);
  p(`> ${flatCanvas.join(', ')}`);
}
if (unknownReports.length) p(`\n> ❓ Không rõ loại: ${unknownReports.map((r) => r.file).join(', ')}`);

p('');
p('## [A+B] Lỗi & cảnh báo theo file');
const withIssues = canvasReports.filter((r) => r.errors.length || r.warns.length);
p(`${withIssues.length}/${canvasReports.length} file có lỗi/cảnh báo.`);
for (const r of withIssues) {
  p('');
  p(`### ${r.file}`);
  r.errors.forEach((e) => p(`- ❌ ${e}`));
  r.warns.forEach((w) => p(`- ⚠️ ${w}`));
}

p('');
p('## [B] Ma trận khối giảng giải (đồng đều?)');
p('| khối | số file có | tỉ lệ |');
p('|---|---|---|');
for (const b of blockCols) p(`| ${b} | ${blockCount[b]} | ${Math.round(blockCount[b] / canvasReports.length * 100)}% |`);
p('');
p('Phiếu THIẾU `.rutra` (gold-standard có): ' +
  (canvasReports.filter((r) => !r.blocks.rutra).map((r) => r.file).join(', ') || '— không có'));

p('');
p('## [C] Style-block drift — selector nên HOIST vào wb-canvas.css');
p('(selector tự định nghĩa lại trong inline `<style>` ở ≥3 file → trùng lặp, dễ lệch giá trị)');
p('');
p('| selector | số file |');
p('|---|---|');
for (const [s, n] of hoist.slice(0, 30)) p(`| \`${s}\` | ${n} |`);

p('');
p('## [D] Bố cục / cỡ ô / màu lệch');
p('');
p('**Override `--cw` / `--ch` / `.schema width` theo file:**');
p('');
p('| file | --cw | --ch | schema width |');
p('|---|---|---|---|');
for (const r of canvasReports) {
  const o = r.overrides;
  if (o.cw.length || o.ch.length || o.schemaWidth.length)
    p(`| ${r.file} | ${o.cw.join(',') || '–'} | ${o.ch.join(',') || '–'} | ${o.schemaWidth.join(',') || '–'} |`);
}
p('');
p('**Hex màu NGOÀI bảng canon (gộp toàn bộ, sắp theo tần suất):**');
p('');
if (colorOut.length) { p('| hex | số lần | (kiểm: có nên thêm vào canon hay sửa về accent/accent2?) |'); p('|---|---|---|'); for (const [h, n] of colorOut) p(`| \`${h}\` | ${n} | |`); }
else p('— không có màu ngoài canon. 🎉');

const out = L.join('\n');
console.log(out);
if (OUT && OUT !== true) { writeFileSync(join(ROOT, String(OUT)), out, 'utf8'); console.error(`\n→ đã ghi ${OUT}`); }
