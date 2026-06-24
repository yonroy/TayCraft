import Link from "next/link";
import { COURSE_ORDER, lessonsOfCourse, isFreeLesson, FREE_COURSES, type Lesson } from "@/lib/lessons";
import { COURSES, productsIncludingCourse } from "@/lib/products";

function LessonCard({ lesson, access }: { lesson: Lesson; access: boolean }) {
  const free = isFreeLesson(lesson);
  const unlocked = lesson.available && (free || access);
  const card = (
    <div
      className={`h-full rounded-2xl border p-4 transition ${
        lesson.available ? "border-line hover:border-accent" : "border-dashed border-line opacity-55"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-sm font-bold text-white rounded-lg px-2.5 py-1.5 ${
            lesson.available ? "bg-accent" : "bg-line"
          }`}
        >
          {lesson.no}
        </span>
        <span className="font-mono text-[11px] text-dim border border-line rounded-md px-1.5 py-0.5">
          {lesson.part}
        </span>
        <div className="flex-1" />
        {free && <span className="text-xs font-mono font-bold text-accent-2">FREE</span>}
        {lesson.available && !unlocked && <span>🔒</span>}
        {!lesson.available && <span className="text-xs text-dim font-mono">sắp ra</span>}
      </div>
      <h3 className="mt-3 font-semibold leading-snug">{lesson.title}</h3>
      <p className="text-sm text-dim mt-1 line-clamp-2">{lesson.blurb}</p>
    </div>
  );

  if (lesson.available && lesson.slug) {
    return <Link href={`/learn/${lesson.slug}`}>{card}</Link>;
  }
  return card;
}

// Liệt kê toàn bộ lộ trình, gom theo 4 khóa (= phân chia gói). access=true → bài đã mở khóa.
export function CourseCatalog({ access = false }: { access?: boolean }) {
  return (
    <div className="space-y-10">
      {COURSE_ORDER.map((courseId) => {
        const meta = COURSES.find((c) => c.id === courseId)!;
        const lessons = lessonsOfCourse(courseId);
        const isFreeCourse = FREE_COURSES.includes(courseId);
        const inPackages = productsIncludingCourse(courseId).map((p) => p.label);
        const doneCount = lessons.filter((l) => l.available).length;

        return (
          <section key={courseId}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <div>
                <h3 className="text-lg font-bold">
                  <span className="text-accent">{courseId}</span> · {meta.name}
                </h3>
                <p className="text-sm text-dim mt-0.5">{meta.desc}</p>
              </div>
              <div className="text-xs text-dim font-mono">
                {doneCount}/{lessons.length} phiếu
              </div>
            </div>
            {isFreeCourse ? (
              <p className="text-xs mt-2">
                <span className="font-mono font-bold text-accent-2">FREE</span>{" "}
                <span className="text-dim">— Miễn phí cho mọi người học</span>
              </p>
            ) : (
              <p className="text-xs text-dim mt-2">
                Có trong gói: <span className="text-ink">{inPackages.join(" · ")}</span>
              </p>
            )}
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lessons.map((l) => (
                <LessonCard key={l.no} lesson={l} access={access} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
