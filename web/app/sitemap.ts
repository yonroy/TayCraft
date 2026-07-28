import type { MetadataRoute } from "next";
import { FREE_SLUGS, lessonBySlug } from "@/lib/lessons";

// Cùng biến SITE_URL mà app/layout.tsx dùng cho metadataBase — giữ khớp domain tuyệt đối.
// .replace(/\/+$/, "") cắt MỌI dấu "/" ở cuối: nếu biến trên Vercel lỡ đặt kèm "/"
// (vd "https://www.lamtoanai.xyz/"), nối chuỗi `${SITE_URL}/learn` phía dưới sẽ KHÔNG ra
// "//learn" (double-slash → 308 redirect thay vì 200, tốn crawl budget + loãng canonical).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lamtoanai.xyz").replace(/\/+$/, "");

// Mốc build ổn định — KHÔNG dùng new Date() ở đây: route này chạy lại mỗi lần Google ghé,
// dùng giờ hiện tại sẽ làm lastModified đổi liên tục dù nội dung không đổi.
const BUILD_DATE = new Date("2026-07-28T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  // Chỉ đưa vào sitemap các bài XEM THỬ MIỄN PHÍ thật sự (canView=true cho khách vãng lai,
  // không cần đăng nhập/mua). Bài trả tiền trả nội dung khoá (Paywall) trong trang — không phải
  // lỗi 404/402 ở /learn/<slug>, nhưng vẫn không nên mời Google index như thể là nội dung đầy đủ.
  // Phòng khi FREE_SLUGS lệch khỏi LESSONS (bài bị xoá/đổi slug): lọc theo lesson thật sự tồn tại
  // và đang available, thay vì tin thẳng danh sách slug.
  const freeLessonEntries: MetadataRoute.Sitemap = FREE_SLUGS.filter((slug) => {
    const lesson = lessonBySlug(slug);
    return lesson?.available === true;
  }).map((slug) => ({
    url: `${SITE_URL}/learn/${slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...freeLessonEntries,
  ];
}
