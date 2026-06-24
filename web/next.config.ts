import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đảm bảo các phiếu trong content/ được đóng gói vào serverless function
  // phục vụ nội dung có khóa (/api/learn/...).
  outputFileTracingIncludes: {
    "/api/learn/**": ["./content/**/*"],
  },
};

export default nextConfig;
