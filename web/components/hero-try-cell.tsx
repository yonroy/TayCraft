"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// Widget "làm thử 1 ô sống" trong hero — hiện thân của "làm toán AI bằng tay".
// Khách gõ đáp án tích vô hướng [a1,a2]·[b1,b2] → phản hồi tức thì; nút 🎲 sinh bộ số mới.
// React self-contained — KHÔNG nạp wb-random.js. Số nhỏ (1–5) để tính nhẩm được.
function rand() {
  return 1 + Math.floor(Math.random() * 5); // 1..5, luôn dương → nhẩm dễ, không âm
}

type Nums = { a1: number; a2: number; b1: number; b2: number };

function newNums(): Nums {
  return { a1: rand(), a2: rand(), b1: rand(), b2: rand() };
}

export function HeroTryCell() {
  const [nums, setNums] = useState<Nums>(newNums);
  const [val, setVal] = useState("");
  const answer = useMemo(() => nums.a1 * nums.b1 + nums.a2 * nums.b2, [nums]);
  const parsed = val.trim() === "" ? null : Number(val.trim());
  const isCorrect = parsed !== null && Number.isFinite(parsed) && parsed === answer;
  const isWrong = parsed !== null && !isCorrect;

  function reroll() {
    setNums(newNums());
    setVal("");
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
          ✍️ Làm thử 1 ô
        </p>
        <button
          type="button"
          onClick={reroll}
          className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent"
        >
          🎲 Đổi số
        </button>
      </div>

      <p className="mt-2 text-sm text-dim">
        Tính <b className="text-ink">tích vô hướng</b>: nhân từng cặp rồi cộng.
      </p>

      {/* Phép tính hiển thị dạng số thật, đồng bộ với thẻ phiếu */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-base">
        <span className="text-ink">
          [{nums.a1}, {nums.a2}]
        </span>
        <span className="text-accent">·</span>
        <span className="text-ink">
          [{nums.b1}, {nums.b2}]
        </span>
        <span className="text-dim">=</span>
        <span className="text-dim">
          {nums.a1}×{nums.b1} + {nums.a2}×{nums.b2}
        </span>
        <span className="text-dim">=</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="?"
          aria-label="Nhập đáp án tích vô hướng"
          className={`w-24 rounded-xl border bg-white px-3 py-2 text-center font-mono text-lg font-bold text-ink outline-none transition focus:ring-2 ${
            isCorrect
              ? "border-accent ring-2 ring-accent/30"
              : isWrong
                ? "border-accent-2 ring-2 ring-accent-2/30"
                : "border-line focus:border-accent focus:ring-accent/30"
          }`}
        />
        {isCorrect && (
          <span className="font-bold text-accent" aria-live="polite">
            ✓ Đúng!
          </span>
        )}
        {isWrong && (
          <span className="text-sm font-medium text-accent-2" aria-live="polite">
            Chưa đúng — thử lại nhé
          </span>
        )}
      </div>

      {isCorrect ? (
        <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm">
          <p className="text-ink">
            Đúng rồi! Đó chính là <b className="text-accent">tích vô hướng</b> — phép tính lõi
            của mọi mạng nơ-ron.
          </p>
          <Link
            href="/learn/A3-tich-vo-huong"
            className="mt-1.5 inline-block font-medium text-accent hover:underline"
          >
            Làm cả phiếu tích vô hướng miễn phí →
          </Link>
        </div>
      ) : (
        <p className="mt-3 text-xs text-dim">
          Cả bộ phiếu là những ô như thế này — bạn tự điền, có đáp án để đối chiếu.
        </p>
      )}
    </div>
  );
}
