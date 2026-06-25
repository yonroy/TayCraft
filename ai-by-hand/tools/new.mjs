#!/usr/bin/env node
// new.mjs — Sinh khung phiếu "AI by Hand" kiểu GIẢNG GIẢI (skill /phieu-giai-thich).
// Đã cân sẵn 2 trang theo bài học budget: trang ĐỀ nhẹ (intro+trực giác+cho sẵn+các bước),
// sơ đồ + tự-kiểm-tra-đáp-án dồn sang trang ĐÁP ÁN. Chỉ còn điền TOÁN (chỗ /* TODO */).
//
// Dùng:  node tools/new.mjs <code> <slug> "<Tựa VI>" "<English>" [phút]
// Ví dụ: node tools/new.mjs A2 A2-do-dai-chuan "Độ dài & chuẩn" "Norm (L1, L2)" 12
//        → tạo ai-by-hand/A2-do-dai-chuan.html
// Cờ:    --force ghi đè nếu file đã tồn tại.

import { writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
const force = args.includes("--force");
const pos = args.filter((a) => !a.startsWith("--"));
const [code, slug, title, english, minRaw] = pos;
const minutes = minRaw || "12";

if (!code || !slug || !title || !english) {
  console.error('Dùng: node tools/new.mjs <code> <slug> "<Tựa VI>" "<English>" [phút]');
  console.error('Ví dụ: node tools/new.mjs A2 A2-do-dai-chuan "Độ dài & chuẩn" "Norm (L1, L2)" 12');
  process.exit(2);
}

const outFile = resolve(process.cwd(), join("ai-by-hand", slug + ".html"));
// nếu đang đứng trong ai-by-hand/ thì ghi thẳng vào cwd
const altFile = resolve(process.cwd(), slug + ".html");
const target = existsSync(resolve(process.cwd(), "ai-by-hand")) ? outFile : altFile;

if (existsSync(target) && !force) {
  console.error("✗ Đã tồn tại: " + target + "  (thêm --force để ghi đè)");
  process.exit(2);
}

const T = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI by Hand · Bài ${code} — ${title} (A4 in được)</title>
<link rel="stylesheet" href="wb.css">
<style>
/* siết nhẹ chiều cao (additive, không đụng wb.css) — chỉnh nếu check.mjs báo tràn */
.page .step{margin-top:6px;}
.page .intro,.page .intuition{padding-top:7px;padding-bottom:7px;}
.page .quiz{margin-top:7px;padding-top:7px;padding-bottom:7px;}
.page .calc{line-height:1.66;}
.page .why{margin-top:5px;}
</style>
</head>
<body>

<div class="toolbar">
  <a href="index.html">← Mục lục</a>
  <button class="js-randomize">🎲 Đổi số</button>
  <button onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>

<!-- ============ TRANG 1 — ĐỀ BÀI ============ -->
<section class="page">
  <div class="wb-head">
    <div class="brand">AI by Hand <span>✍️</span> · Toán × AI</div>
    <div class="meta">Phiếu in A4 · tính tay<br>Mức: nhập môn · Phần ${code[0]}</div>
  </div>

  <div class="wb-title"><span class="no">Bài ${code}</span><h1>${title} <small>— ${english}</small></h1></div>
  <div class="namebar"><span>Họ tên: <u></u></span><span>Ngày: <u></u></span><span>Thời gian: ~${minutes} phút</span></div>

  <div class="intro">
    <b>Vì sao quan trọng.</b> /* TODO: 2–3 câu nối khái niệm tới bức tranh AI lớn. */
    <div class="formula">/* TODO: công thức gốc */</div>
  </div>

  <div class="intuition">
    <span class="lead">💡 Trực giác</span>
    /* TODO: một phép so sánh đời thường giúp "thấy" ý tưởng trước khi vào số. */
  </div>

  <!-- GIVEN -->
  <div class="step">
    <div class="step-h"><div class="b">0</div><h2>Cho sẵn</h2><span class="tag">/* TODO */</span></div>
    <div class="row">
      <div class="mwrap"><div class="mlabel">x</div>
        <div class="mtx c3"><div class="cell given" data-q="x1">2</div><div class="cell given" data-q="x2">1</div><div class="cell given" data-q="x3">3</div></div></div>
      <div class="note" style="max-width:80mm">/* TODO: một câu lưu ý cách đọc dữ liệu. */</div>
    </div>
  </div>

  <div class="grid2">
  <!-- BƯỚC 1 -->
  <div class="step">
    <div class="step-h"><div class="b">1</div><h2>/* TODO */</h2><span class="tag">/* TODO */</span></div>
    <div class="calc">
      /* TODO: biểu thức với toán hạng data-q + ô trống <span class="blk"></span> */
    </div>
    <div class="why"><b>Vì sao:</b> /* TODO: bản chất bước này (không chỉ thao tác). */</div>
  </div>

  <!-- BƯỚC 2 -->
  <div class="step">
    <div class="step-h"><div class="b">2</div><h2>/* TODO */</h2><span class="tag">/* TODO */</span></div>
    <div class="calc">
      /* TODO */
    </div>
    <div class="why"><b>Vì sao:</b> /* TODO */</div>
  </div>
  </div><!-- /grid2 -->

  <!-- (thêm bước nếu cần — nhớ chạy check.mjs sau mỗi lần thêm) -->

  <div class="quiz">
    <div class="qh">✎ Tự kiểm tra</div>
    <ol>
      <li>/* TODO câu hỏi khái niệm 1 */ → <span class="blk" style="min-width:90px"></span></li>
      <li>/* TODO câu hỏi khái niệm 2 */ → <span class="blk" style="min-width:90px"></span></li>
    </ol>
  </div>

  <div class="wb-foot"><span>AI by Hand ✍️ — Bài ${code} · ${title}</span><span>Trang 1/2 · ĐỀ</span></div>
</section>

<!-- ============ TRANG 2 — ĐÁP ÁN ============ -->
<section class="page key">
  <div class="wb-head">
    <div class="brand">AI by Hand <span>✍️</span> · Toán × AI</div>
    <div class="meta"><span class="key-badge">ĐÁP ÁN</span></div>
  </div>
  <div class="wb-title"><span class="no">Bài ${code}</span><h1>${title} <small>— lời giải</small></h1></div>

  <div class="grid2">
  <div class="step">
    <div class="step-h"><div class="b">1</div><h2>/* TODO */</h2></div>
    <div class="calc ans">/* TODO: lời giải với <span class="blk" data-q="..."></span> */</div>
  </div>
  <div class="step">
    <div class="step-h"><div class="b">2</div><h2>/* TODO */</h2></div>
    <div class="calc ans">/* TODO */</div>
  </div>
  </div>

  <!-- SƠ ĐỒ để ở trang 2 cho cân chiều cao (bài học budget) -->
  <div class="step">
    <div class="step-h"><div class="b" style="background:var(--accent)">▦</div><h2>Sơ đồ: /* TODO */</h2><span class="tag">/* TODO */</span></div>
    <div class="figrow">
      <svg id="fig1" class="fig" viewBox="0 0 210 150" width="70mm" height="50mm" aria-label="/* TODO */"></svg>
      <div style="flex:1">
        <div class="calc ans">/* TODO: vài số đọc từ hình */</div>
        <div class="note">/* TODO: ý nghĩa hình. */</div>
      </div>
    </div>
  </div>

  <div class="quiz">
    <div class="qh">✎ Tự kiểm tra — đáp án</div>
    <ol>
      <li>/* TODO */ → <span class="qa">/* TODO đáp án 1 */</span></li>
      <li>/* TODO */ → <span class="qa">/* TODO đáp án 2 */</span></li>
    </ol>
  </div>

  <div class="intro" style="border-left-color:var(--accent2)">
    <b style="color:var(--accent2)">Rút ra.</b> /* TODO: 2–3 câu chốt + nối sang bài kế. */
  </div>

  <div class="wb-foot"><span>AI by Hand ✍️ — Bài ${code} · ${title}</span><span>Trang 2/2 · ĐÁP ÁN</span></div>
</section>

<script src="wb-random.js"></script>
<script>
function generate(){
  /* TODO: sinh số bằng WB.randInt/randIntNZ/pick; tính kết quả */
  var x = [WB.randInt(-4,5), WB.randInt(-4,5), WB.randInt(-4,5)];

  WB.setAll({
    x1: WB.fmtInt(x[0]), x2: WB.fmtInt(x[1]), x3: WB.fmtInt(x[2])
    /* TODO: thêm mọi khóa data-q (đáp án tính trong đây, KHÔNG hardcode) */
  });
  drawFig1();
}

// Hình tĩnh: vẽ 1 lần. Hình phụ thuộc số: chuyển lời gọi vào generate().
function drawFig1(){
  var svg = document.getElementById('fig1'); if(!svg) return;
  /* TODO: dựng chuỗi SVG → svg.innerHTML = s; (xem mẫu 01-tich-vo-huong.html) */
}

WB.wire(generate);
generate(); // BẮT BUỘC gọi 1 lần lúc tải (kẻo SVG trống / số mặc định lệch)
</script>
</body>
</html>
`;

writeFileSync(target, T, "utf8");
console.log("✅ Đã tạo: " + target);
console.log("\nBước tiếp:");
console.log("  1. Điền toán vào các chỗ /* TODO */ (xem mẫu 01-tich-vo-huong.html + skill /phieu-giai-thich).");
console.log("  2. Đo tràn:   node tools/check.mjs " + slug + ".html --runs 5 --shot");
console.log("  3. Đăng ký:   bật thẻ trong index.html + đặt available:true trong web/lib/lessons.ts.");
