import { readFile } from "node:fs/promises";
import { join, normalize, extname, basename } from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { getUser, hasAccess } from "@/lib/auth";
import { isFreeContentSlug, SHARED_ASSETS } from "@/lib/lessons";

export const dynamic = "force-dynamic";

const CONTENT_DIR = join(process.cwd(), "content", "ai-by-hand");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
};

function isAlwaysAllowed(fileName: string): boolean {
  if (SHARED_ASSETS.includes(fileName)) return true; // wb.css, wb-random.js
  if (fileName.endsWith(".html")) {
    const slug = fileName.replace(/\.html$/, "");
    return isFreeContentSlug(slug); // free slug lẻ + toàn bộ khóa free (K1)
  }
  return false;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const rel = normalize(path.join("/")).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(CONTENT_DIR, rel);

  // Chống path traversal: file phải nằm trong CONTENT_DIR.
  if (!filePath.startsWith(CONTENT_DIR)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const fileName = basename(filePath);

  // Kiểm tra quyền: tài nguyên free/shared → cho qua; còn lại cần quyền theo gói của bài.
  if (!isAlwaysAllowed(fileName)) {
    const slug = fileName.endsWith(".html") ? fileName.replace(/\.html$/, "") : undefined;
    const user = await getUser();
    if (!user || !(await hasAccess(user.id, slug))) {
      return new NextResponse("Bạn cần mua khóa học để xem nội dung này.", { status: 402 });
    }
  }

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const type = MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  return new NextResponse(new Uint8Array(data), {
    headers: { "Content-Type": type, "Cache-Control": "private, max-age=0, must-revalidate" },
  });
}
