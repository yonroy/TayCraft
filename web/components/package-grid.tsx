import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRODUCTS, COURSES, coursesOfProduct, effectivePriceVnd, type Product } from "@/lib/products";
import { lessonsOfCourse, type Course } from "@/lib/lessons";
import { promoExpired } from "@/lib/promo";
import { formatVnd } from "@/lib/utils";

const courseName = (id: string) => COURSES.find((c) => c.id === id)?.name ?? id;

// Số phiếu ĐÃ PHÁT HÀNH của một khóa (số thật từ manifest — không bịa).
const availableCount = (id: Course) => lessonsOfCourse(id).filter((l) => l.available).length;

// Quyền lợi dùng chung mọi gói — hiển thị trong khối "bạn nhận được gì".
const SHARED_PERKS = [
  "🎲 Đổi số vô hạn — luyện lại không hết bài",
  "🖨️ In PDF / A4, giải bằng bút chì",
  "↩️ Hoàn tiền 7 ngày — không hỏi lý do",
  "♾️ Học trọn đời nội dung hiện có",
];

// `launch` = thẻ Khóa 1 trong thời gian khai trương → tô nổi bật tông cam (khác Pro tông accent).
function PackageCard({ p, launch = false }: { p: Product; launch?: boolean }) {
  const courses = coursesOfProduct(p);
  const totalPhieu = courses.reduce((s, c) => s + availableCount(c), 0);
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

      {/* Bạn nhận được gì — số phiếu THẬT/khóa + quyền lợi chung + đặc thù gói */}
      <div className="mt-3 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-dim">Bạn nhận được</p>
        <ul className="mt-2 space-y-1 text-sm">
          {courses.map((c) => (
            <li key={c} className="flex items-start gap-1.5">
              <span className="text-accent">✓</span>
              <span>
                <b className="text-ink">{availableCount(c)} phiếu</b>{" "}
                <span className="text-dim">· {courseName(c)}</span>
              </span>
            </li>
          ))}
          {SHARED_PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-1.5 text-dim">
              <span>{perk}</span>
            </li>
          ))}
          {/* Perk đặc thù gói (vd cập nhật 12 tháng, capstone) — bỏ dòng "trọn đời" đã có ở trên */}
          {p.perks
            ?.filter((perk) => !perk.includes("trọn đời"))
            .map((perk) => (
              <li key={perk} className="flex items-start gap-1.5 text-ink">
                <span className="text-accent">✓</span> {perk}
              </li>
            ))}
        </ul>
        <p className="mt-2 text-xs text-dim">
          Tổng <b className="text-ink">{totalPhieu} phiếu</b> đã phát hành · ra thêm liên tục.
        </p>
      </div>

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

// 4 bậc cộng dồn: Khóa 1 → Cơ bản → Pro (nổi bật) → Trọn bộ.
export function PackageGrid() {
  const launchActive = !promoExpired(); // còn trong dịp khai trương → làm nổi thẻ Khóa 1
  return (
    <div>
      {launchActive && (
        <div className="mb-4 rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm">
          <span className="font-mono font-bold text-accent-2">🎉 KHAI TRƯƠNG</span>{" "}
          <span className="text-dim">
            Tặng 100 suất Khóa 1 miễn phí · sau đó chỉ 49.000đ. Xem thử 3 phiếu đầu không cần mua.
          </span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {PRODUCTS.map((p) => (
          <PackageCard key={p.id} p={p} launch={p.id === "k1" && launchActive} />
        ))}
      </div>
    </div>
  );
}
