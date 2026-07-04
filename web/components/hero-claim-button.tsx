"use client";

import { Button } from "@/components/ui/button";

// Nút chính hero trong dịp khai trương: mở lại LaunchPopup (popup tự xử lý
// mọi nhánh: còn suất / hết suất → 49k / cần đăng nhập OTP).
export function HeroClaimButton() {
  return (
    <Button size="lg" onClick={() => window.dispatchEvent(new CustomEvent("open-launch-popup"))}>
      Nhận Khóa 1 miễn phí →
    </Button>
  );
}
