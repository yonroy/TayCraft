import Script from "next/script";

// Meta (Facebook) Pixel — mount 1 lần trong app/layout.tsx.
//
// Đọc ID từ NEXT_PUBLIC_META_PIXEL_ID. CHƯA CÓ ID (chủ dự án chưa đăng ký Pixel) → KHÔNG render
// GÌ CẢ: không <script>, không <noscript>, không gọi ra facebook.com. Đây là điều kiện nghiệm
// thu — trang phải y hệt trước khi có tính năng này khi thiếu env, không được vỡ hay rò domain lạ.
//
// strategy="afterInteractive" (next/script): script tải SAU khi trang trở nên interactive, không
// chặn LCP/TTI của landing (khác "beforeInteractive" — chặn render, chỉ dành cho script phải chạy
// trước mọi thứ). Vẫn tải sớm hơn "lazyOnload" (đợi trình duyệt rảnh hẳn) — traffic từ ads
// Facebook thường bounce rất nhanh, lazyOnload dễ bỏ lỡ PageView của chính những lượt đó, phản tác
// dụng với mục đích đo lường ads. afterInteractive là điểm cân bằng đúng cho use-case này.
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  // Guard định dạng: Pixel ID chuẩn của Meta chỉ gồm chữ số. Phòng thân nếu env bị gõ nhầm/dính
  // ký tự lạ — không nội suy giá trị bất thường thẳng vào script inline.
  if (!pixelId || !/^\d+$/.test(pixelId)) return null;

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- pixel fallback bắt buộc dùng <img> thô, không phải nội dung trang */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
