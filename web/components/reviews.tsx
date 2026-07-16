import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import type { Review } from "@/lib/db/schema";

const AVATAR_COLORS = ["bg-accent", "bg-accent-2", "bg-[#7c5cff]"];

function Stars({ value }: { value: number }) {
  return (
    <span className="text-accent-2 tracking-tight" aria-label={`${value} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return <span key={i}>{value >= n ? "★" : value >= n - 0.5 ? "⯪" : "☆"}</span>;
      })}
    </span>
  );
}

// Đánh giá THẬT của học viên (admin đã duyệt). Chưa có review nào → khối CTA mời
// những học viên đầu tiên để lại cảm nhận (trung thực, không dùng số liệu bịa).
export function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-3xl border border-line bg-paper p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold">Học viên nói gì ✍️</h2>
          <p className="mt-3 text-dim max-w-xl mx-auto">
            Bộ phiếu vừa ra mắt — bạn là một trong những học viên <b className="text-ink">đầu tiên</b>.
            Đã làm thử phiếu nào rồi? Để lại vài dòng cảm nhận giúp người học sau nhé.
          </p>
          <div className="mt-5">
            <Link href="/danh-gia">
              <Button variant="outline">Viết đánh giá đầu tiên →</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <SectionHeading
        title="Học viên nói gì"
        right={
          <p className="text-sm text-dim">
            <span className="text-accent-2 font-bold">★ {avg}/5</span> · {reviews.length} đánh giá
          </p>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <figure key={r.id} className="rounded-2xl border border-line p-5 flex flex-col">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold ${
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                }`}
              >
                {(r.name.trim().split(/\s+/).pop() ?? r.name).charAt(0).toUpperCase()}
              </span>
              <figcaption className="min-w-0">
                <div className="font-semibold truncate">{r.name}</div>
                {r.role && <div className="text-xs text-dim truncate">{r.role}</div>}
              </figcaption>
            </div>
            <div className="mt-3">
              <Stars value={r.rating} />
            </div>
            <blockquote className="mt-2 text-sm text-dim leading-relaxed flex-1">
              “{r.comment}”
            </blockquote>
          </figure>
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-dim">
        Bạn đã học?{" "}
        <Link href="/danh-gia" className="text-accent font-medium hover:underline">
          Để lại cảm nhận →
        </Link>
      </p>
    </section>
  );
}
