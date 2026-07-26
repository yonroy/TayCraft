#!/usr/bin/env node
// check-fill.mjs — Đo ĐỘ LẤP ĐẦY từng trang. Bắt lỗi ngược với check.mjs.
//
// check.mjs bắt phiếu TRÀN (nội dung bị .page{overflow:hidden} cắt âm thầm).
// Tool này bắt phiếu RỖNG: rải nội dung quá mỏng qua nhiều trang → người học in ra
// 4 tờ mà 3 tờ trống một phần ba. "Tràn 0px" KHÔNG có nghĩa là bố cục tốt.
//
//   node tools/check-fill.mjs K3/H3-khoi-gpt-mask.html [...]
//
// Chuẩn (suy từ bản mẫu đã chốt — G1 lấp 95/94%, H4 96/88%):
//   ✓ ≥80%  — tốt
//   ⚠️ 70–79% — hơi mỏng, cân nhắc phân bố lại
//   ❌ <70%  — quá rỗng: PHÂN BỐ LẠI cho đều các trang, hoặc lấp bằng nội dung THẬT
//              (nháp .scratch to hơn, SVG to hơn, thêm ô điền/bước) — đừng để giấy trắng.
//
// ⚠️⚠️ CÁCH CHỮA SAI (đã dính 2026-07-17, H3): NÉN padding/line-height/SVG/ô điền/nháp
//    xuống DƯỚI chuẩn để đẩy fill lên 97%. Fill cao mà nén = VẪN HỎNG (ô nhỏ không viết
//    nổi bằng bút chì). check-fill CHỈ bắt trang rỗng — nó KHÔNG biết bạn nén hay không.
//    Đích đúng: giãn cách CHUẨN + ĐÚNG số trang nội dung cần (KHÔNG trần trên số trang).
//    Nếu giãn cách chuẩn mà một trang < 80% → THÊM/PHÂN BỐ trang, đừng ép về ít trang hơn.

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!files.length) { console.error('Dùng: node tools/check-fill.mjs <file.html> [...]'); process.exit(2); }

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => { try { readFileSync(p); return true; } catch { return false; } });
if (!EDGE) { console.error('❌ Không tìm thấy msedge.exe'); process.exit(2); }

const rel = (p) => relative(ROOT, p).split(sep).join('/');

const PROBE = `
<script>
window.addEventListener('load', function(){
  var o = [];
  document.querySelectorAll('.page').forEach(function(p, i){
    // .foot định vị absolute ở đáy → không tính là nội dung
    var kids = [].slice.call(p.children).filter(function(c){ return !c.classList.contains('foot'); });
    if (!kids.length) { o.push({page:i+1, key:p.classList.contains('key'), pct:0, freeMM:297}); return; }
    var last = kids[kids.length-1];
    var pr = p.getBoundingClientRect(), lr = last.getBoundingClientRect();
    var used = lr.bottom - pr.top, tot = pr.height;
    o.push({ page:i+1, key:p.classList.contains('key'),
             pct: Math.round(used/tot*100), freeMM: Math.round((tot-used)/tot*297) });
  });
  var pre = document.createElement('pre'); pre.id = '__fill__';
  pre.textContent = JSON.stringify(o); document.body.appendChild(pre);
});
<\/script>`;

let anyErr = false;

for (const f of files) {
  const abs = join(ROOT, f);
  let html;
  try { html = readFileSync(abs, 'utf8'); } catch { console.log(`⚠️  Bỏ qua: ${f}`); continue; }

  const tmp = abs.replace(/\.html$/, '_fill.html');
  writeFileSync(tmp, html.replace(/<\/body>/i, PROBE + '</body>'));

  let dom = '';
  try {
    dom = execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--dump-dom',
      '--virtual-time-budget=4000', 'file:///' + tmp.replace(/\\/g, '/')],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) { dom = (e.stdout || '').toString(); }
  finally { try { unlinkSync(tmp); } catch {} }

  const m = dom.match(/<pre id="__fill__">([\s\S]*?)<\/pre>/);
  if (!m) { console.log(`❌ ${rel(abs)} — không đo được`); anyErr = true; continue; }

  console.log(`\n📏 ${rel(abs)}`);
  let worst = 100;
  for (const r of JSON.parse(m[1])) {
    const mark = r.pct >= 80 ? '✓' : r.pct >= 70 ? '⚠️' : '❌';
    console.log(`   ${mark} Trang ${r.page} ${r.key ? 'ĐÁP ÁN' : 'ĐỀ    '}: lấp ${r.pct}%  · trống ~${r.freeMM}mm`);
    worst = Math.min(worst, r.pct);
  }
  if (worst < 70) { console.log('   → Quá rỗng. Gộp trang lại, hoặc lấp bằng nội dung THẬT (đừng nén padding/ô điền).'); anyErr = true; }
  else if (worst < 80) console.log('   → Hơi mỏng, chấp nhận được nếu nội dung đã đủ.');
}

console.log(anyErr ? '\n❌ Có trang quá rỗng.' : '\n✅ Độ lấp đầy đạt.');
process.exit(anyErr ? 1 : 0);
