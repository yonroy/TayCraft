import Link from "next/link";
import { courseOf, lessonsOfCourse, type Lesson } from "@/lib/lessons";

// Điều hướng "← Bài trước / Bài sau →" giữa các bài CÙNG KHÓA theo đúng thứ tự lộ trình
// (thứ tự trong mảng LESSONS). Link cứ trỏ tới bài kế dù bị khóa — paywall tự lo phần chặn.
// Chỉ xét bài đã phát hành (available + có slug) để link luôn hợp lệ.
export function LessonNav({ slug }: { slug: string }) {
  const course = courseOf(slug);
  if (!course) return null;

  const list = lessonsOfCourse(course).filter((l): l is Lesson & { slug: string } =>
    Boolean(l.available && l.slug),
  );
  const i = list.findIndex((l) => l.slug === slug);
  if (i === -1) return null;

  const prev = i > 0 ? list[i - 1] : null;
  const next = i < list.length - 1 ? list[i + 1] : null;

  return (
    <nav className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3" aria-label="Điều hướng bài học">
      <NavCard lesson={prev} dir="prev" />
      <NavCard lesson={next} dir="next" />
    </nav>
  );
}

function NavCard({
  lesson,
  dir,
}: {
  lesson: (Lesson & { slug: string }) | null;
  dir: "prev" | "next";
}) {
  const isNext = dir === "next";
  const align = isNext ? "text-right items-end" : "text-left items-start";
  const cue = isNext ? "Bài sau →" : "← Bài trước";

  // Đầu/cuối khóa → ô mờ, không bấm được.
  if (!lesson) {
    return (
      <div
        className={`flex flex-col gap-0.5 rounded-2xl border border-line bg-paper px-4 py-3 opacity-50 ${align}`}
        aria-disabled
      >
        <span className="text-xs font-medium text-dim">{cue}</span>
        <span className="text-sm text-dim">{isNext ? "Hết khóa" : "Đầu khóa"}</span>
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className={`group flex flex-col gap-0.5 rounded-2xl border border-line bg-white px-4 py-3 transition hover:border-accent ${align}`}
    >
      <span className="text-xs font-medium text-dim group-hover:text-accent">{cue}</span>
      <span className="line-clamp-1 text-sm font-semibold text-ink group-hover:text-accent">
        <span className="font-mono text-dim group-hover:text-accent">{lesson.no}</span>{" "}
        {lesson.title}
      </span>
    </Link>
  );
}
