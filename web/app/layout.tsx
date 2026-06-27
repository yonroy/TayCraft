import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lamtoanai.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Làm toán AI ✍️ — Học AI bằng tay | TayCraft",
  description:
    "Bộ phiếu tính tay dạy nền tảng AI/Deep Learning bằng số thật: dot product, softmax, attention, backprop. In A4, giải bằng bút chì. Tiếng Việt.",
  openGraph: {
    title: "Làm toán AI ✍️ — Học AI bằng tay",
    description:
      "Tự điền ma trận, chạy softmax/attention/backprop bằng số thật trên giấy. Trọn bộ phiếu tính tay, tiếng Việt.",
    url: SITE_URL,
    siteName: "TayCraft — Làm toán AI",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Làm toán AI ✍️ — Học AI bằng tay",
    description: "Trọn bộ phiếu tính tay dạy AI bằng số thật. Tiếng Việt.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
