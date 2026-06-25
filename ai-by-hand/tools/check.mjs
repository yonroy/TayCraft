#!/usr/bin/env node
// check.mjs — Đo tràn lề phiếu "AI by Hand" BẰNG SỐ (+ tuỳ chọn chụp ảnh).
// Thay cho màn tạo _measure.html thủ công. Chạy:
//   node tools/check.mjs <file.html> [--runs N] [--shot] [--keep]
// Ví dụ: node tools/check.mjs A1-vecto-cong-tru.html --runs 5 --shot
//
// Cơ chế: chèn script đo (scrollHeight − clientHeight cho mỗi .page/.sheet) vào
// bản sao tạm, chạy Edge headless --dump-dom N lần (mỗi lần generate() ra số random
// khác → bắt wrap xấu nhất), in tràn từng trang. Tràn > 2px = ✗ (A4 .page/.sheet
// có overflow:hidden nên tràn bị cắt âm thầm, chỉ đo số mới thấy).

import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve, basename, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const EDGE_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

function findEdge() {
  const hit = EDGE_PATHS.find((p) => existsSync(p));
  if (!hit) {
    console.error("✗ Không tìm thấy msedge.exe. Sửa EDGE_PATHS trong check.mjs.");
    process.exit(2);
  }
  return hit;
}

// ---- parse args ----
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Dùng: node tools/check.mjs <file.html> [--runs N] [--shot] [--keep]");
  process.exit(2);
}
const runs = Number((args.find((a) => a.startsWith("--runs=")) || "").split("=")[1])
  || (args.includes("--runs") ? Number(args[args.indexOf("--runs") + 1]) : 0) || 3;
const wantShot = args.includes("--shot");
const keep = args.includes("--keep");

const target = resolve(process.cwd(), file);
if (!existsSync(target)) {
  console.error("✗ Không thấy file: " + target);
  process.exit(2);
}

const edge = findEdge();

// ---- chèn script đo vào bản sao tạm (cùng thư mục để giữ link wb.css/wb-random.js) ----
const MEASURE = `
<script>
window.addEventListener('load',function(){setTimeout(function(){
  try{ if(typeof generate==='function') generate(); }catch(e){}
  var o=[];document.querySelectorAll('.page,.sheet').forEach(function(p,i){
    var ov=p.scrollHeight-p.clientHeight; o.push('Trang'+(i+1)+'='+ov+(ov>2?'!TRAN':''));});
  document.documentElement.setAttribute('data-measure', o.join('  ') || 'KHONG-CO-TRANG');
},700);});
</script>
</body>`;

const srcDir = dirname(target);
const tmpName = "._check_" + basename(target);
const tmpFile = join(srcDir, tmpName);
let html = readFileSync(target, "utf8");
if (!html.includes("</body>")) {
  console.error("✗ File không có </body>.");
  process.exit(2);
}
writeFileSync(tmpFile, html.replace("</body>", MEASURE), "utf8");

const outDir = mkdtempSync(join(tmpdir(), "phieu-check-"));
const cleanup = () => {
  if (!keep && existsSync(tmpFile)) rmSync(tmpFile, { force: true });
  rmSync(outDir, { recursive: true, force: true });
};
process.on("exit", cleanup);

const url = pathToFileURL(tmpFile).href;
const baseFlags = ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=900,2600", "--virtual-time-budget=4000"];

// ---- chạy N lần, gom kết quả ----
console.log(`\n🔍 Đo tràn: ${basename(target)}  (×${runs} lần random)\n`);
let worst = {};
let anyOverflow = false;

for (let i = 1; i <= runs; i++) {
  let dom = "";
  try {
    dom = execFileSync(edge, [...baseFlags, "--dump-dom", url], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch (e) {
    dom = (e.stdout || "").toString();
  }
  const m = dom.match(/data-measure="([^"]*)"/);
  const line = m ? m[1] : "(không đọc được — generate() lỗi? thử --keep rồi mở thủ công)";
  console.log(`  Lần ${i}: ${line}`);
  if (m) {
    for (const part of m[1].split(/\s+/)) {
      const mm = part.match(/Trang(\d+)=(-?\d+)/);
      if (mm) {
        const k = "Trang" + mm[1];
        const v = Number(mm[2]);
        worst[k] = Math.max(worst[k] ?? -1e9, v);
        if (v > 2) anyOverflow = true;
      }
    }
  }
}

console.log("");
const worstStr = Object.entries(worst).map(([k, v]) => `${k}=${v}px${v > 2 ? " ✗" : " ✓"}`).join("  ");
console.log("  Tràn lớn nhất: " + (worstStr || "(không đo được)"));

// ---- chụp ảnh nếu yêu cầu ----
if (wantShot) {
  const png = join(srcDir, basename(target).replace(/\.html$/i, "") + ".check.png");
  try {
    execFileSync(edge, ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=900,2600", "--virtual-time-budget=4000", "--screenshot=" + png, pathToFileURL(target).href], { stdio: "ignore" });
    if (existsSync(png)) console.log("  📸 Ảnh: " + png);
  } catch { console.log("  (chụp ảnh lỗi)"); }
}

console.log("");
if (anyOverflow) {
  console.log("❌ CÓ TRÀN (>2px). Cân lại 2 trang / tách thêm trang A4 — đừng nhồi.\n");
  process.exitCode = 1;
} else {
  console.log("✅ Khít cả hai mặt. (nhớ soát mắt ảnh: SVG hiện? caption không cắt?)\n");
}
