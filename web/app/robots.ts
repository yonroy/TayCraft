import type { MetadataRoute } from "next";

// Cùng biến SITE_URL mà app/layout.tsx dùng cho metadataBase — giữ khớp domain tuyệt đối.
// .replace(/\/+$/, "") cắt MỌI dấu "/" ở cuối: nếu biến trên Vercel lỡ đặt kèm "/"
// (vd "https://www.lamtoanai.xyz/"), nối chuỗi `${SITE_URL}/sitemap.xml` phía dưới sẽ KHÔNG
// ra "//sitemap.xml" (double-slash từng làm Google báo "Page with redirect" cho sitemap.xml).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lamtoanai.xyz").replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/account",
        "/checkout",
        "/auth",
        "/login",
        "/danh-gia", // trang gửi cảm nhận cá nhân hoá theo tài khoản — không cần Google index dù đã mở cho khách ẩn danh xem (app/danh-gia/page.tsx)
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
