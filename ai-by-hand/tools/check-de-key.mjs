#!/usr/bin/env node
// check-de-key.mjs — Soát LỆCH ĐỀ↔ĐÁP ÁN cho phiếu GIẢNG GIẢI (wb.css, .page/.page.key).
// Bắt đúng lỗi B7: trang ĐÁP ÁN giải bước mà trang ĐỀ KHÔNG hỏi (học sinh làm đề
// xong, mở đáp án thấy "giải dư"). Chạy SAU khi dựng/sửa phiếu, TRƯỚC khi giao.
//
//   node tools/check-de-key.mjs                      # quét mọi .html dạng giảng-giải trong ai-by-hand/
//   node tools/check-de-key.mjs K1/B7-naive-bayes.html [...]   # chỉ vài file (chẩn đoán)
//
// Tiêu chí (chỉ phiếu có ≥1 <section class="page">):
//   [1] ❌ Bước trong ĐÁP ÁN (.page.key) mà ĐỀ không có  → lỗi thật, exit 1.
//   [2] ⚠️ Footer "Trang x/N" lệch số section.
//   [3] ℹ️ Số cho-sẵn (data-q ở ô/.gv given trong ĐỀ) chỉ xuất hiện 1 lần ở ĐỀ
//       → THƯỜNG là false-positive (bảng dữ liệu đọc trực tiếp); chỉ để tham khảo.
// Quy tắc vàng: mọi bước/phép tính ở ĐÁP ÁN phải có câu hỏi (ô trống) tương ứng ở ĐỀ.
// Tràn 1 trang thì TÁCH TRANG, không cắt bước (xem _specs/README.md G & H).

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');            // = ai-by-hand/
const argv = process.argv.slice(2);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'tools' || name.startsWith('.') || name.startsWith('_')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html') && name !== 'index.html' && !name.includes('_measure') && !name.includes('_check')) acc.push(p);
  }
  return acc;
}
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const files = (argv.length ? argv.map((a) => join(ROOT, a)) : walk(ROOT)).sort();

// "1–2","1-2" -> [1,2]; "3" -> [3]
function expand(label) {
  const m = label.replace(/[–—]/g, '-').match(/(\d+)\s*-\s*(\d+)/);
  if (m) { const a = +m[1], b = +m[2]; return Array.from({ length: b - a + 1 }, (_, i) => a + i); }
  const s = label.match(/\d+/); return s ? [+s[0]] : [];
}
function sectionsOf(html) {
  const re = /<section class="page([^"]*)">([\s\S]*?)<\/section>/g; const out = []; let m;
  while ((m = re.exec(html))) out.push({ key: /\bkey\b/.test(m[1]), body: m[2] });
  return out;
}
function stepNums(body) {
  const re = /<div class="b">([^<]+)<\/div>/g; let m; const s = new Set();
  while ((m = re.exec(body))) expand(m[1]).forEach((n) => s.add(n));
  return s;
}

let scanned = 0, withErr = 0, anyErr = false;
for (const f of files) {
  let html; try { html = readFileSync(f, 'utf8'); } catch { continue; }
  const secs = sectionsOf(html);
  if (!secs.length) continue;                  // không phải phiếu giảng-giải (canvas dùng .sheet)
  scanned++;
  const de = secs.filter((s) => !s.key), key = secs.filter((s) => s.key);
  const errs = [], warns = [], infos = [];
  if (!key.length) errs.push('không có trang ĐÁP ÁN (.page.key)');

  const deSteps = new Set(); de.forEach((s) => stepNums(s.body).forEach((n) => deSteps.add(n)));
  const keySteps = new Set(); key.forEach((s) => stepNums(s.body).forEach((n) => keySteps.add(n)));
  const keyOnly = [...keySteps].filter((n) => !deSteps.has(n)).sort((a, b) => a - b);
  if (keyOnly.length) errs.push(`ĐÁP ÁN có bước ${keyOnly.join(',')} mà ĐỀ không hỏi (thêm câu hỏi/ô trống vào ĐỀ)`);

  const N = secs.length;
  const foots = [...html.matchAll(/Trang\s*(\d+)\/(\d+)/g)].map((m) => [+m[1], +m[2]]);
  if (foots.length !== N) warns.push(`${foots.length} footer "Trang x/N" ≠ ${N} section`);
  const badN = foots.find(([, b]) => b !== N);
  if (badN) warns.push(`footer ghi /${badN[1]} nhưng có ${N} trang`);

  const deBody = de.map((s) => s.body).join('\n');
  const givenKeys = [...deBody.matchAll(/class="(?:gv|cell given|gv [^"]*|[^"]*\bgiven\b[^"]*)"[^>]*data-q="([^"]+)"/g)].map((m) => m[1]);
  const unused = [...new Set(givenKeys)].filter((k) => (deBody.match(new RegExp(`data-q="${k}"`, 'g')) || []).length <= 1);
  if (unused.length) infos.push(`số cho-sẵn dùng 1 lần ở ĐỀ (thường OK — bảng đọc trực tiếp): ${unused.join(', ')}`);

  if (errs.length) { withErr++; anyErr = true; }
  const tag = errs.length ? '❌' : (warns.length ? '⚠️ ' : '✓');
  console.log(`\n${tag} ${rel(f)}  (${N} trang: ${de.length} ĐỀ + ${key.length} ĐÁP ÁN · ĐỀ{${[...deSteps].sort((a, b) => a - b).join(',')}} key{${[...keySteps].sort((a, b) => a - b).join(',')}})`);
  errs.forEach((e) => console.log(`   ❌ ${e}`));
  warns.forEach((w) => console.log(`   ⚠️ ${w}`));
  infos.forEach((i) => console.log(`   ℹ️ ${i}`));
}

console.log(`\n${anyErr ? '❌' : '✅'} Quét ${scanned} phiếu giảng-giải · ${withErr} phiếu LỆCH bước ĐỀ↔ĐÁP ÁN.`);
if (anyErr) { console.log('→ Mỗi bước ở ĐÁP ÁN phải có câu hỏi tương ứng ở ĐỀ. Bước tính→ô trống; bước hình→hình-để-điền (cho dữ liệu, giấu kết quả).\n'); process.exitCode = 1; }
else console.log('');
