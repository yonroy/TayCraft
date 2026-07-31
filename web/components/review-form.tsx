"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMMENT_MAX = 500;

export type ReviewFormInitial = {
  name: string;
  role: string;
  rating: number;
  comment: string;
  approved: boolean;
} | null;

const INPUT = "w-full h-11 px-4 rounded-md border border-line focus:border-accent focus:outline-none";

// Form gửi/sửa đánh giá của học viên. Gửi xong chờ admin duyệt mới hiện lên trang chủ.
export function ReviewForm({
  initial,
  defaultName,
}: {
  initial: ReviewFormInitial;
  defaultName: string;
}) {
  const [name, setName] = useState(initial?.name ?? defaultName);
  const [role, setRole] = useState(initial?.role ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, rating, comment }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Có lỗi, vui lòng thử lại.");
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-line bg-paper p-8 text-center">
        <div className="text-5xl">🙏</div>
        <h2 className="mt-3 text-xl font-bold">Cảm ơn bạn!</h2>
        <p className="mt-2 text-dim">
          Cảm nhận của bạn đã được gửi và sẽ hiện trên trang chủ sau khi được duyệt.
        </p>
        <div className="mt-5">
          <Link href="/learn">
            <Button variant="outline">← Quay lại bài học</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {initial && (
        <p className="rounded-md border border-line bg-paper px-4 py-3 text-sm text-dim">
          {initial.approved
            ? "Đánh giá của bạn đang hiển thị. Sửa và gửi lại sẽ cần duyệt lại."
            : "Đánh giá trước của bạn đang chờ duyệt — bạn có thể sửa rồi gửi lại."}
        </p>
      )}

      <div>
        <label className="block text-sm font-semibold">Đánh giá của bạn</label>
        <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Chọn số sao">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} sao`}
              onClick={() => setRating(n)}
              className={`transition ${
                n <= rating ? "text-accent-2" : "text-dim hover:text-accent-2/50"
              }`}
            >
              <Star
                size={28}
                strokeWidth={2}
                fill={n <= rating ? "currentColor" : "none"}
                aria-hidden
              />
            </button>
          ))}
          <span className="ml-2 self-center text-sm text-dim">{rating}/5</span>
        </div>
      </div>

      <div>
        <label htmlFor="rv-name" className="block text-sm font-semibold">
          Tên hiển thị
        </label>
        <input
          id="rv-name"
          className={`mt-1.5 ${INPUT}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
          minLength={2}
          placeholder="VD: Minh Toàn"
        />
      </div>

      <div>
        <label htmlFor="rv-role" className="block text-sm font-semibold">
          Bạn là ai? <span className="font-normal text-dim">(tùy chọn)</span>
        </label>
        <input
          id="rv-role"
          className={`mt-1.5 ${INPUT}`}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          maxLength={60}
          placeholder="VD: Sinh viên CNTT, Data Analyst…"
        />
      </div>

      <div>
        <label htmlFor="rv-comment" className="block text-sm font-semibold">
          Cảm nhận
        </label>
        <textarea
          id="rv-comment"
          className="mt-1.5 w-full rounded-md border border-line px-4 py-3 focus:border-accent focus:outline-none"
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
          required
          minLength={10}
          placeholder="Bạn thấy phiếu nào hữu ích nhất? Điều gì làm bạn 'à, ra thế'?"
        />
        <p className="mt-1 text-right text-xs text-dim">
          {comment.length}/{COMMENT_MAX}
        </p>
      </div>

      {error && <p className="text-sm text-accent-2">{error}</p>}

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? "Đang gửi…" : initial ? "Cập nhật đánh giá" : "Gửi đánh giá"}
      </Button>
      <p className="text-center text-xs text-dim">
        Đánh giá sẽ hiện trên trang chủ sau khi được duyệt.
      </p>
    </form>
  );
}
