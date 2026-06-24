import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRODUCTS, COURSES, coursesOfProduct, type Product } from "@/lib/products";
import { formatVnd } from "@/lib/utils";

const courseName = (id: string) => COURSES.find((c) => c.id === id)?.name ?? id;

function PackageCard({ p }: { p: Product }) {
  const courses = coursesOfProduct(p);
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 ${
        p.highlight ? "border-accent ring-2 ring-accent/30 shadow-md lg:scale-[1.03]" : "border-line"
      }`}
    >
      {p.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white">
          ★ Phổ biến nhất · Đáng giá nhất
        </span>
      )}
      <h3 className="font-bold leading-snug">{p.label}</h3>
      {p.tagline && <p className="mt-1 text-xs text-dim">{p.tagline}</p>}

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-accent">{formatVnd(p.priceVnd)}</span>
        {p.compareAtVnd && (
          <span className="text-sm text-dim line-through">{formatVnd(p.compareAtVnd)}</span>
        )}
      </div>
      {p.compareAtVnd && p.compareAtVnd > p.priceVnd && (
        <p className="text-xs text-accent-2 font-semibold mt-0.5">
          Tiết kiệm {formatVnd(p.compareAtVnd - p.priceVnd)}
        </p>
      )}

      <ul className="mt-3 space-y-1 text-sm text-dim">
        {courses.map((c) => (
          <li key={c}>
            <span className="font-mono text-xs text-accent">{c}</span> · {courseName(c)}
            {c === "K1" && <span className="text-accent-2 font-semibold"> (free)</span>}
          </li>
        ))}
      </ul>

      {p.perks && (
        <ul className="mt-3 space-y-1 text-sm flex-1">
          {p.perks.map((perk) => {
            const lack = /không/i.test(perk);
            return (
              <li key={perk} className={lack ? "text-dim" : "text-ink"}>
                <span className={lack ? "text-dim" : "text-accent"}>{lack ? "—" : "✓"}</span> {perk}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4">
        {p.active ? (
          <Link href={`/checkout?product=${p.id}`} className="block">
            <Button className="w-full" variant={p.highlight ? "primary" : "outline"}>
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

// Thang giá "chim mồi": K2 → K3 Pro → K4 Max (mồi) → K5 Full (đích, nổi bật).
export function PackageGrid() {
  return (
    <div>
      <div className="mb-4 rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm">
        <span className="font-mono font-bold text-accent-2">FREE</span>{" "}
        <b className="text-ink">Khóa 1 — Nền tảng AI</b>{" "}
        <span className="text-dim">miễn phí cho mọi người. Lên gói để mở K2–K4 & trọn đời.</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {PRODUCTS.map((p) => (
          <PackageCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
