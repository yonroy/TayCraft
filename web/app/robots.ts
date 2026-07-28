import type { MetadataRoute } from "next";

// Cùng biến SITE_URL mà app/layout.tsx dùng cho metadataBase — giữ khớp domain tuyệt đối.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lamtoanai.xyz";

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
        "/danh-gia", // gated: redirect("/login?next=/danh-gia") khi chưa đăng nhập (app/danh-gia/page.tsx)
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
