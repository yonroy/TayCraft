"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  LESSONS,
  PARTS,
  COURSE_ORDER,
  isFreeLesson,
  type Course,
  type Lesson,
  type Part,
} from "@/lib/lessons";
import { COURSES, productsIncludingCourse } from "@/lib/products";

// Bảng điều khiển học tập cho /learn — thay accordion phẳng cũ (LearnCurriculum).
// Trả lời ngay "mình đang ở đâu": hero Tiếp tục học + vòng % + tiến độ từng khóa,
// rồi lưới phiếu có ảnh xem trước, lọc/tìm và tick "đã học".
// Tiến độ lưu localStorage (chưa có bảng DB) → mọi tính toán chạy phía client.

const STORE_KEY = "lamtoanai:tien-do:v1";

interface Progress {
  done: string[]; // slug các bài đã tick
  days: string[]; // ngày (YYYY-MM-DD) có tick — dùng tính chuỗi ngày liên tục
}

const EMPTY: Progress = { done: [], days: [] };

// Kho tiến độ ngoài React (localStorage), đọc qua useSyncExternalStore thay vì
// setState trong useEffect: server & lần render client đầu (trước hydrate) đều
// thấy EMPTY giống nhau (getServerProgress), React tự re-render với dữ liệu thật
// ngay sau khi hydrate xong — hydration-safe mà không phải cascading setState.
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedProgress: Progress = EMPTY;

function readProgress(): Progress {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const p = raw ? (JSON.parse(raw) as Partial<Progress>) : null;
      cachedProgress = p ? { done: p.done ?? [], days: p.days ?? [] } : EMPTY;
    } catch {
      cachedProgress = EMPTY;
    }
  }
  return cachedProgress;
}

function writeProgress(next: Progress) {
  cachedRaw = JSON.stringify(next);
  cachedProgress = next;
  try {
    localStorage.setItem(STORE_KEY, cachedRaw);
  } catch {
    // localStorage bị chặn (chế độ riêng tư) → vẫn giữ trong bộ nhớ cho phiên này
  }
  listeners.forEach((l) => l());
}

function subscribeProgress(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerProgress(): Progress {
  return EMPTY;
}

// Ảnh phiếu THẬT: public/thumbs/<slug>.png, chụp từ trang ĐỀ của chính phiếu đó.
// Bài không có slug, hoặc ảnh lỗi/404 → khung phiếu vẽ bằng CSS (.ld-paper),
// không để ô xám/vỡ trống.

type Filter = "all" | "open" | "free" | "todo" | "done";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "open", label: "Đang mở" },
  { id: "free", label: "Miễn phí" },
  { id: "todo", label: "Chưa học" },
  { id: "done", label: "Đã học" },
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Chuỗi ngày học liên tục tính tới hôm nay (hoặc hôm qua — chưa học hôm nay vẫn giữ chuỗi).
function streakOf(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const d = new Date();
  if (!set.has(todayKey())) d.setDate(d.getDate() - 1);
  let n = 0;
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function VongTienDo({ pct }: { pct: number }) {
  const r = 45;
  const c = 2 * Math.PI * r;
  return (
    <div className="ld-ring">
      <svg viewBox="0 0 110 110" width="110" height="110" aria-hidden="true">
        <circle className="ld-ring-track" cx="55" cy="55" r={r} />
        <circle
          className="ld-ring-bar"
          cx="55"
          cy="55"
          r={r}
          strokeDasharray={`${(c * pct) / 100} ${c}`}
        />
      </svg>
      <div className="ld-ring-lbl">
        <span className="pct">{pct}%</span>
        <span className="sub">tổng tiến độ</span>
      </div>
    </div>
  );
}

function ThePhieu({
  lesson,
  unlocked,
  done,
  onToggle,
  packageLabel,
}: {
  lesson: Lesson;
  unlocked: boolean;
  done: boolean;
  onToggle: (slug: string) => void;
  packageLabel?: string;
}) {
  const free = isFreeLesson(lesson);
  const [imgError, setImgError] = useState(false);
  const img = lesson.slug && !imgError ? `/thumbs/${lesson.slug}.png` : undefined;
  const state = !lesson.available ? "soon" : unlocked ? "open" : "locked";

  const thumb = (
    <div className="ld-thumb">
      {img ? (
        // Ảnh phiếu thật; bài khóa thì làm mờ để vẫn thấy "phiếu dày, đáng mua".
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt=""
          loading="lazy"
          width={430}
          height={615}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`ld-paper c-${lesson.course}`} aria-hidden="true">
          <span className="ph-dice">🎲</span>
          <span className="ph-head" />
          <span className="ph-row w80" />
          <span className="ph-row w50" />
          <span className="ph-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="ph-row w80" />
          <span className="ph-letter">{lesson.part}</span>
        </div>
      )}
      {free && <span className="ld-flag free">FREE</span>}
      {state === "locked" && (
        <span className="ld-lock">
          🔒
          {packageLabel && <b>Gói {packageLabel}</b>}
        </span>
      )}
      {state === "soon" && <span className="ld-flag soon">sắp ra</span>}
    </div>
  );

  const body = (
    <>
      {thumb}
      <div className="ld-card-body">
        <span className="ld-no">{lesson.no}</span>
        <span className="ld-title">{lesson.title}</span>
        <span className="ld-en">{lesson.english}</span>
      </div>
    </>
  );

  return (
    <div className={`ld-card st-${state}${done ? " is-done" : ""}`}>
      {state === "open" && lesson.slug ? (
        <Link href={`/learn/${lesson.slug}`} className="ld-card-link">
          {body}
        </Link>
      ) : state === "locked" ? (
        <Link href="/#packages" className="ld-card-link">
          {body}
        </Link>
      ) : (
        <div className="ld-card-link">{body}</div>
      )}
      {state === "open" && lesson.slug && (
        <label className="ld-check">
          <input
            type="checkbox"
            checked={done}
            onChange={() => onToggle(lesson.slug as string)}
          />
          {done ? "Đã học" : "Đánh dấu đã học"}
        </label>
      )}
    </div>
  );
}

export function LearnDashboard({ accessCourses = [] }: { accessCourses?: Course[] }) {
  const progress = useSyncExternalStore(subscribeProgress, readProgress, getServerProgress);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const doneSet = useMemo(() => new Set(progress.done), [progress.done]);

  const toggle = useCallback((slug: string) => {
    const current = readProgress();
    const has = current.done.includes(slug);
    const done = has ? current.done.filter((s) => s !== slug) : [...current.done, slug];
    const today = todayKey();
    const days = has || current.days.includes(today) ? current.days : [...current.days, today];
    writeProgress({ done, days });
  }, []);

  const unlocked = useCallback(
    (l: Lesson) => l.available && (isFreeLesson(l) || accessCourses.includes(l.course)),
    [accessCourses],
  );

  // Gói rẻ nhất mở được khóa đó — dùng cho nhãn 🔒 trên thẻ và thẻ tiến độ khóa.
  const packageOf = useCallback((c: Course) => productsIncludingCourse(c)[0]?.label, []);

  const openLessons = useMemo(() => LESSONS.filter(unlocked), [unlocked]);
  const doneCount = openLessons.filter((l) => l.slug && doneSet.has(l.slug)).length;
  const pct = openLessons.length ? Math.round((doneCount / openLessons.length) * 100) : 0;

  // Bài tiếp theo = bài đã mở, chưa học, đầu tiên theo đúng thứ tự lộ trình.
  const next = openLessons.find((l) => l.slug && !doneSet.has(l.slug));
  // PARTS chỉ có 1 dòng metadata mỗi part.id (phần G ghi course K2) dù Phần G có
  // bài G1 thuộc K3 — tra theo part.id thôi, đừng ràng buộc course kẻo G1 bị lệch.
  const nextPart = next ? PARTS.find((p) => p.id === next.part) : undefined;

  const streak = streakOf(progress.days);

  const matches = useCallback(
    (l: Lesson) => {
      const isOpen = unlocked(l);
      const isDone = !!l.slug && doneSet.has(l.slug);
      if (filter === "open" && !isOpen) return false;
      if (filter === "free" && !isFreeLesson(l)) return false;
      if (filter === "done" && !isDone) return false;
      if (filter === "todo" && (!isOpen || isDone)) return false;
      if (q.trim()) {
        const k = q.trim().toLowerCase();
        const hay = `${l.no} ${l.title} ${l.english} ${l.blurb}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    },
    [filter, q, doneSet, unlocked],
  );

  const shown = useMemo(() => LESSONS.filter(matches), [matches]);

  // Nhóm theo (course, part) THẬT có trong LESSONS — không nhóm theo PARTS trực
  // tiếp vì PARTS chỉ khai 1 course cho mỗi part.id (part "G" ghi course K2), còn
  // Phần G có G1 thuộc K3 (xem _SPEC-shared.md §2). Đếm "đã học" tính trên TOÀN BỘ
  // bài của phần đó (không chỉ bài đang hiển thị sau lọc), giữ mẫu số ổn định.
  const sections = useMemo(() => {
    const list: { course: Course; part: Part; name: string; items: Lesson[]; total: number; doneCount: number }[] = [];
    for (const cid of COURSE_ORDER) {
      for (const part of PARTS) {
        const all = LESSONS.filter((l) => l.course === cid && l.part === part.id);
        if (all.length === 0) continue;
        const items = all.filter(matches);
        if (items.length === 0) continue;
        list.push({
          course: cid,
          part: part.id,
          name: part.name,
          items,
          total: all.length,
          doneCount: all.filter((l) => l.slug && doneSet.has(l.slug)).length,
        });
      }
    }
    return list;
  }, [matches, doneSet]);

  return (
    <div className="ld lpc">
      {/* ---------- HERO: tiếp tục học ---------- */}
      <section className="ld-hero">
        <div className="ld-hero-left">
          {next ? (
            <>
              <span className="eyebrow">Tiếp tục học</span>
              <span className="ld-hero-code">{next.no}</span>
              <h2>{next.title}</h2>
              <p className="ld-hero-part">
                {nextPart ? `Phần ${nextPart.id} · ${nextPart.name}` : ""} — Khóa {next.course}
              </p>
              <Link href={`/learn/${next.slug}`} className="btn btn-primary btn-lg">
                Tiếp tục →
              </Link>
            </>
          ) : openLessons.length ? (
            <>
              <span className="eyebrow">Xong hết rồi</span>
              <h2>Bạn đã học hết phiếu đang mở 🎉</h2>
              <p className="ld-hero-part">
                Bấm 🎲 trên phiếu bất kỳ để luyện lại với bộ số mới, hoặc mở thêm khóa.
              </p>
              <Link href="/#packages" className="btn btn-primary btn-lg">
                Xem các gói →
              </Link>
            </>
          ) : (
            <>
              <span className="eyebrow">Bắt đầu</span>
              <h2>Học thử 3 phiếu đầu — miễn phí</h2>
              <p className="ld-hero-part">
                Không cần đăng nhập. In ra giấy, điền tay, bấm 🎲 đổi số luyện lại.
              </p>
              <Link href="/#packages" className="btn btn-primary btn-lg">
                Xem các gói →
              </Link>
            </>
          )}
        </div>
        <div className="ld-hero-right">
          <div className="ld-hero-count">
            Đã học <b>{doneCount}</b>/{openLessons.length} phiếu đang mở
          </div>
          <VongTienDo pct={pct} />
        </div>
      </section>

      {/* ---------- 3 ô thống kê ---------- */}
      <section className="ld-stats">
        <div className="ld-stat">
          <span className="ic">✅</span>
          <span>
            <span className="num">
              {doneCount}/{openLessons.length}
            </span>
            <span className="lbl">phiếu đã học</span>
          </span>
        </div>
        <div className="ld-stat">
          <span className="ic">🔥</span>
          <span>
            <span className="num">{streak} ngày</span>
            <span className="lbl">chuỗi ngày học liên tục</span>
          </span>
        </div>
        <div className="ld-stat">
          <span className="ic">📘</span>
          <span>
            <span className="num">{openLessons.length - doneCount} phiếu</span>
            <span className="lbl">còn lại đang mở</span>
          </span>
        </div>
      </section>

      {/* ---------- tiến độ từng khóa ---------- */}
      <div className="ld-sec-head">
        <h3>Tiến độ theo khóa</h3>
      </div>
      <section className="ld-courses">
        {COURSE_ORDER.map((cid) => {
          const meta = COURSES.find((c) => c.id === cid)!;
          const all = LESSONS.filter((l) => l.course === cid);
          const has = accessCourses.includes(cid);
          const d = all.filter((l) => l.slug && doneSet.has(l.slug)).length;
          const p = all.length ? Math.round((d / all.length) * 100) : 0;
          return (
            <div key={cid} className={`ld-course${has ? (p === 100 ? " done" : "") : " locked"}`}>
              <div className="ld-course-top">
                <span className="ld-course-badge">{cid}</span>
                {has ? (
                  p === 100 ? (
                    <span className="ld-done-badge">✓ Hoàn thành</span>
                  ) : (
                    <span className="ld-pct">{p}%</span>
                  )
                ) : (
                  <span className="ld-pct">🔒</span>
                )}
              </div>
              <div className="ld-course-name">{meta.name}</div>
              {has ? (
                <>
                  <div className="ld-bar">
                    <span className="ld-bar-fill" style={{ width: `${p}%` }} />
                  </div>
                  <div className="ld-course-meta">
                    {d}/{all.length} phiếu
                  </div>
                </>
              ) : (
                <div className="ld-course-lock">
                  <span>Cần gói {packageOf(cid)}</span>
                  <Link href="/#packages">Xem gói →</Link>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ---------- lọc + tìm ---------- */}
      <div className="ld-sec-head">
        <h3>Tất cả bài học</h3>
      </div>
      <div className="ld-filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`ld-chip${filter === f.id ? " active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <span className="ld-count">{shown.length} bài</span>
        <span className="ld-search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm bài theo tên hoặc mã…"
            aria-label="Tìm bài học"
          />
        </span>
      </div>

      {/* ---------- lưới phiếu theo Phần ---------- */}
      {shown.length === 0 ? (
        <p className="ld-empty">Không có phiếu nào khớp bộ lọc. Thử bỏ bớt điều kiện.</p>
      ) : (
        sections.map((s) => (
          <section className="ld-part" key={`${s.course}-${s.part}`}>
            <div className="ld-part-head">
              <span className="ld-part-badge">{s.part}</span>
              <span className="ld-part-name">{s.name}</span>
              <span className="ld-part-course">Khóa {s.course}</span>
              <span className="ld-part-count">
                {s.doneCount}/{s.total} đã học
              </span>
            </div>
            <div className="ld-grid">
              {s.items.map((l) => (
                <ThePhieu
                  key={`${l.course}-${l.no}`}
                  lesson={l}
                  unlocked={unlocked(l)}
                  done={!!l.slug && doneSet.has(l.slug)}
                  onToggle={toggle}
                  packageLabel={packageOf(l.course)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
