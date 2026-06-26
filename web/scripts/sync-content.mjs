// Copy phiếu HTML "Làm toán AI" từ ../ai-by-hand (source of truth) sang ./content/ai-by-hand
// (artifact, gitignored). Chạy tự động trước dev/build (predev/prebuild).
import { cp, rm, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
await cp(src, dest, { recursive: true });
console.log(`[sync-content] Đã copy nội dung → ${dest}`);
