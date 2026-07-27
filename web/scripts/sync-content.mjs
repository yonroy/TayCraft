// Copy phiếu HTML "Làm toán AI" từ ../ai-by-hand (source of truth) sang ./content/ai-by-hand
// (artifact, gitignored). Chạy tự động trước dev/build (predev/prebuild).
import { cp, rm, mkdir, access } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Rác của công cụ soát phiếu (tools/check.mjs, ảnh chụp màn hình tạm) — đừng copy lên production.
const IGNORE = [
  /^out-.*\.png$/i, // ảnh chụp tạm khi soát tràn lề (out-i2.png…)
  /\.check\.png$/i, // tools/check.mjs --shot
  /^\._check_/, // bản HTML tạm của tools/check.mjs
  /_measure\.html$/i, // bản sao chèn script đo tràn lề
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "..", "..", "ai-by-hand");
const destDir = join(__dirname, "..", "content");
const dest = join(destDir, "ai-by-hand");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(src))) {
  console.error(`[sync-content] Không tìm thấy nguồn: ${src}`);
  process.exit(1);
}

await rm(dest, { recursive: true, force: true });
await mkdir(destDir, { recursive: true });
await cp(src, dest, {
  recursive: true,
  filter: (from) => !IGNORE.some((re) => re.test(basename(from))),
});
console.log(`[sync-content] Đã copy nội dung → ${dest}`);
