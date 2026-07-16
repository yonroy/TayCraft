import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/utils";
import { FREE_SLUGS, type Course } from "@/lib/lessons";
import {
  packagesGrantingCourse,
  productById,
  effectivePriceVnd,
  DEFAULT_PRODUCT,
  type Product,
} from "@/lib/products";

// Gói RẺ NHẤT đang bán mở được khóa chứa bài này → đúng mức giá cần để mở đúng bài đang xem.
// (Trước đây paywall đọc COURSE_PRICE_VND ?? 199000 = giá ảo không khớp thang giá nào.)
function cheapestUnlock(course: Course): Product {
  const granting = packagesGrantingCourse(course)
    .map((id) => productById(id))
    .filter((p): p is Product => !!p && p.active);
  const pool = granting.length ? granting : [productById(DEFAULT_PRODUCT)!];
  return pool.reduce((a, b) => (effectivePriceVnd(b) < effectivePriceVnd(a) ? b : a));
}

export function Paywall({ title, course }: { title: string; course: Course }) {
  const p = cheapestUnlock(course);
  const price = effectivePriceVnd(p);
  return (
    <div className="mx-auto max-w-md text-center rounded-3xl border border-line bg-paper p-8 mt-10">
      <div className="text-4xl">🔒</div>
      <h2 className="mt-3 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-dim text-sm">
        Bài này nằm trong gói <b className="text-ink">{p.label}</b>. Mua một lần, mở khóa và học
        trọn đời.
      </p>
      <div className="mt-5 text-3xl font-extrabold text-accent">{formatVnd(price)}</div>
      <p className="mt-1 text-xs text-dim">Trọn đời · hoàn tiền trong 7 ngày nếu chưa hợp</p>
      <div className="mt-5 flex flex-col gap-2">
        <Link href={`/checkout?product=${p.id}`}>
          <Button size="lg" className="w-full">
            Mua gói {p.label}
          </Button>
        </Link>
        <Link href={`/learn/${FREE_SLUGS[0]}`}>
          <Button variant="ghost" size="sm">
            Xem lại bài miễn phí
          </Button>
        </Link>
      </div>
    </div>
  );
}
