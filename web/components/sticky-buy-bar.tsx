import Link from "next/link";
import { Button } from "@/components/ui/button";
import { productById, DEFAULT_PRODUCT, effectivePriceVnd } from "@/lib/products";
import { formatVnd } from "@/lib/utils";

// Thanh mua cố định đáy màn hình — CHỈ hiện trên mobile (lg:hidden), ẩn ở desktop.
// Trỏ vào gói mặc định (Pro / DEFAULT_PRODUCT). Giá dùng effectivePriceVnd → tôn trọng promo.
export function StickyBuyBar() {
  const product = productById(DEFAULT_PRODUCT);
  if (!product) return null;
  const price = effectivePriceVnd(product);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="truncate text-xs text-dim">{product.label} · trọn đời</p>
          <p className="text-lg font-extrabold leading-tight text-accent">{formatVnd(price)}</p>
        </div>
        <Link href={`/checkout?product=${product.id}`} className="shrink-0">
          <Button size="md">Mua ngay →</Button>
        </Link>
      </div>
    </div>
  );
}
