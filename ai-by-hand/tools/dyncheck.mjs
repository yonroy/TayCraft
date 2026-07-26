#!/usr/bin/env node
// dyncheck.mjs — Soát SỐ ĐỘNG của phiếu: NaN/undefined lọt ra DOM, và 🎲 có đổi số thật không.
//
// Bắt 2 lỗi mà check.mjs (đo tràn) và check-de-key.mjs (soát lệch) đều MÙ:
//   [1] ❌ NaN / undefined / "null" hiện trong ô data-q → lỗi tính toán, in ra giấy là rác.
//   [2] ❌ Bấm 🎲 mà bộ số KHÔNG đổi → hardcode số, hoặc quên gọi generate().
//       (Ngoại lệ hợp lệ: ô đáp án của self-check kiểu "bất biến" CỐ Ý đứng yên —
//        vd G1 "E triệt tiêu". Tool báo tỉ lệ ô đổi, người đọc tự phán.)
//
//   node tools/dyncheck.mjs K3/H4-multi-head-attention.html [...]
//   node tools/dyncheck.mjs K3/H4-multi-head-attention.html --runs 6
//
// Cách chạy: chèn script đo vào BẢN SAO _dyncheck.html rồi mở bằng Edge headless --dump-dom.
// (iframe không đọc được file:// → phải chèn thẳng vào bản sao, giống mẹo của check.mjs.)

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const argv = process.argv.slice(2);
const runsIdx = argv.indexOf('--runs');
const RUNS = runsIdx >= 0 ? +argv[runsIdx + 1] : 5;
// ⚠️ Phải guard runsIdx < 0: không truyền --runs thì runsIdx = −1 → runsIdx+1 = 0 → điều kiện
// cũ (i !== runsIdx+1) loại luôn THAM SỐ ĐẦU TIÊN, tức chính file cần soát. Hệ quả: cú pháp
// mặc định `dyncheck.mjs <file>` (đúng như header file này ghi) chạy ra danh sách rỗng và chỉ in
// dòng "Dùng:" — cổng im lặng không soát gì. Chỉ khi tình cờ thêm --runs nó mới chạy thật.
const files = argv.filter((a, i) => !a.startsWith('--') && (runsIdx < 0 || i !== runsIdx + 1));

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => { try { readFileSync(p); return true; } catch { return false; } });
if (!EDGE) { console.error('❌ Không tìm thấy msedge.exe'); process.exit(2); }

const rel = (p) => relative(ROOT, p).split(sep).join('/');
if (!files.length) { console.error('Dùng: node tools/dyncheck.mjs <file.html> [--runs N]'); process.exit(2); }

const PROBE = (runs) => `
<script>
window.addEventListener('load', function(){
  var out = { runs: [], err: null };
  try {
    for (var r = 0; r < ${runs}; r++) {
      if (typeof generate === 'function') generate();
      var snap = {};
      document.querySelectorAll('[data-q]').forEach(function(el){
        snap[el.getAttribute('data-q')] = (el.textContent || '').trim();
      });
      out.runs.push(snap);
    }
  } catch (e) { out.err = String(e && e.message || e); }
  var pre = document.createElement('pre');
  pre.id = '__dyn__';
  pre.textContent = JSON.stringify(out);
  document.body.appendChild(pre);
});
<\/script>`;

let anyErr = false;

for (const f of files) {
  const abs = join(ROOT, f);
  let html;
  try { html = readFileSync(abs, 'utf8'); } catch { console.log(`⚠️  Bỏ qua (không đọc được): ${f}`); continue; }

  const tmp = abs.replace(/\.html$/, '_dyncheck.html');
  writeFileSync(tmp, html.replace(/<\/body>/i, PROBE(RUNS) + '</body>'));

  let dom = '';
  try {
    dom = execFileSync(EDGE, [
      '--headless=new', '--disable-gpu', '--dump-dom', '--virtual-time-budget=4000',
      'file:///' + tmp.replace(/\\/g, '/'),
    ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) { dom = (e.stdout || '').toString(); }
  finally { try { unlinkSync(tmp); } catch {} }

  const m = dom.match(/<pre id="__dyn__">([\s\S]*?)<\/pre>/);
  if (!m) { console.log(`❌ ${rel(abs)} — không lấy được kết quả đo (script lỗi?)`); anyErr = true; continue; }

  let data;
  try { data = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')); }
  catch { console.log(`❌ ${rel(abs)} — kết quả đo không parse được`); anyErr = true; continue; }

  console.log(`\n🎲 ${rel(abs)}  (×${RUNS} lần gọi generate)`);
  if (data.err) { console.log(`   ❌ generate() ném lỗi: ${data.err}`); anyErr = true; continue; }
  if (!data.runs.length) { console.log('   ❌ không chạy được lần nào'); anyErr = true; continue; }

  const keys = Object.keys(data.runs[0]);
  if (!keys.length) { console.log('   ⚠️  phiếu không có ô data-q nào?'); continue; }

  // [1] NaN / undefined / null
  const bad = new Set();
  data.runs.forEach((snap) => keys.forEach((k) => {
    if (/\b(NaN|undefined|null)\b/i.test(snap[k] || '')) bad.add(k);
  }));
  if (bad.size) { console.log(`   ❌ NaN/undefined trong: ${[...bad].join(', ')}`); anyErr = true; }
  else console.log('   ✓ 0 NaN/undefined');

  // [2] 🎲 có đổi số không
  const changed = keys.filter((k) => new Set(data.runs.map((s) => s[k])).size > 1);
  const pct = Math.round((changed.length / keys.length) * 100);
  const frozen = keys.filter((k) => !changed.includes(k));
  if (!changed.length) {
    console.log(`   ❌ 🎲 KHÔNG đổi số nào (${keys.length} ô) — hardcode, hoặc quên gọi generate()?`);
    anyErr = true;
  } else {
    console.log(`   ✓ 🎲 đổi ${changed.length}/${keys.length} ô (${pct}%)`);
    if (frozen.length) console.log(`   ℹ️  đứng yên: ${frozen.join(', ')}\n      → OK nếu là self-check "bất biến" (cố ý), SAI nếu là số lẽ ra phải đổi.`);
  }
}

console.log(anyErr ? '\n❌ Có phiếu lỗi số động.' : '\n✅ Số động sạch.');
process.exit(anyErr ? 1 : 0);
