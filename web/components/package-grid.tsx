import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRODUCTS, COURSES, coursesOfProduct } from "@/lib/products";
import { formatVnd } from "@/lib/utils";

const courseName = (id: string) => COURSES.find((c) => c.id === id)?.name ?? id;

// Hiển thị đủ 4 gói. Chỉ gói active có nút Mua; gói chưa mở gắn nhãn "Sắp mở bán".
export function PackageGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PRODUCTS.map((p) => {
        const courses = coursesOfProduct(p);
        const isBundle = p.courses === "all";
        return (
          <div
            key={p.id}
            className={`flex flex-col rounded-2xl border p-5 ${
              isBundle ? "border-accent ring-1 ring-accent/30" : "border-line"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold leading-snug">{p.label}</h3>
              {isBundle && (
                <span className="text-[11px] font-mono font-bold text-accent whitespace-nowrap">★ phổ biến</span>
              )}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-dim flex-1">
              {courses.map((c) => (
                <li key={c}>
                  <span className="font-mono text-xs text-accent">{c}</span> · {courseName(c)}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-2xl font-extrabold text-accent">{formatVnd(p.priceVnd)}</div>
            <div className="mt-3">
              {p.active ? (
                <Link href="/checkout" className="block">
                  <Button className="w-full">Mua ngay</Button>
                </Link>
              ) : (
                <span className="block text-center text-sm text-dim border border-dashed border-line rounded-xl py-2.5">
                  Sắp mở bán
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
