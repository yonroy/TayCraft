import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRODUCTS, COURSES, coursesOfProduct, effectivePriceVnd, type Product } from "@/lib/products";
import { promoExpired } from "@/lib/promo";
import { formatVnd } from "@/lib/utils";

const courseName = (id: string) => COURSES.find((c) => c.id === id)?.name ?? id;

// `launch` = thẻ Khóa 1 trong thời gian khai trương → tô nổi bật tông cam (khác Pro tông accent).
function PackageCard({ p, launch = false }: { p: Product; launch?: boolean }) {
  const courses = coursesOfProduct(p);
  const price = effectivePriceVnd(p);
  const emphasis = launch
    ? "border-accent-2 ring-2 ring-accent-2/40 shadow-lg lg:scale-[1.05]"
    : p.highlight
      ? "border-accent ring-2 ring-accent/30 shadow-md lg:scale-[1.03]"
      : "border-line";
  return (
    <div className={`relative flex flex-col rounded-2xl border p-5 ${emphasis}`}>
      {launch ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-2 px-3 py-1 text-[11px] font-bold text-white shadow">
          🎉 Khai trương · chỉ 49K
        </span>
      ) : (
        p.highlight && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white">
            ★ Phổ biến nhất
          </span>
        )
      )}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold leading-snug">{p.label}</h3>
        {p.badge && !launch && (
          <span className="whitespace-nowrap rounded-full border border-line px-2 py-0.5 text-[11px] text-dim">
            {p.badge}
          </span>
        )}
      </div>
      {p.tagline && <p className="mt-1 text-xs text-dim">{p.tagline}</p>}

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-accent">{formatVnd(price)}</span>
        {p.compareAtVnd && p.compareAtVnd > price && (
          <span className="text-sm text-dim line-through">{formatVnd(p.compareAtVnd)}</span>
        )}
      </div>
      {p.compareAtVnd && p.compareAtVnd > price && (
        <p className="text-xs text-accent-2 font-semibold mt-0.5">
          Tiết kiệm {formatVnd(p.compareAtVnd - price)}
        </p>
      )}

      <ul className="mt-3 space-y-1 text-sm text-dim">
        {courses.map((c) => (
          <li key={c}>{courseName(c)}</li>
        ))}
      </ul>

      {p.perks && (
        <ul className="mt-3 space-y-1 text-sm flex-1 text-ink">
          {p.perks.map((perk) => (
            <li key={perk}>
              <span className="text-accent">✓</span> {perk}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {p.active ? (
          <Link href={`/checkout?product=${p.id}`} className="block">
            <Button className="w-full" variant={p.highlight || launch ? "primary" : "outline"}>
              Mua ngay
            </Button>
          </Link>
        ) : (
          <span className="block text-center text-sm text-dim border border-dashed border-line rounded-xl py-2.5">
            Sắp mở bán
          </span>
        )}
      </div>
    </div>
  );
}

// 3 bậc: Cơ bản → Pro (nổi bật) → Trọn bộ. Khóa nền tảng học miễn phí.
export function PackageGrid() {
  const launchActive = !promoExpired(); // còn trong dịp khai trương → làm nổi thẻ Khóa 1
  return (
    <div>
      <div className="mb-4 rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm">
        <span className="font-mono font-bold text-accent-2">🎉 KHAI TRƯƠNG</span>{" "}
        <span className="text-dim">
          Tặng 100 suất Khóa 1 miễn phí · sau đó chỉ 49.000đ. Xem thử 3 phiếu đầu không cần mua.
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {PRODUCTS.map((p) => (
          <PackageCard key={p.id} p={p} launch={p.id === "k1" && launchActive} />
        ))}
      </div>
    </div>
  );
}
