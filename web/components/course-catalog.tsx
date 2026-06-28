import Link from "next/link";
import {
  COURSE_ORDER,
  lessonsOfCourse,
  isFreeLesson,
  FREE_COURSES,
  type Course,
  type Lesson,
} from "@/lib/lessons";
import { COURSES, productsIncludingCourse } from "@/lib/products";

// Mỗi khóa một màu (class tĩnh — KHÔNG ghép động để Tailwind không purge mất).
// Bám quy ước màu dự án: lam → lục → cam → tím.
type CourseColor = { badge: string; hover: string; pill: string; bar: string };
const COURSE_COLORS: Record<Course, CourseColor> = {
  K1: { badge: "bg-blue-600", hover: "hover:border-blue-400", pill: "bg-blue-50 text-blue-700 border-blue-200", bar: "bg-blue-500" },
  K2: { badge: "bg-emerald-600", hover: "hover:border-emerald-400", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" },
  K3: { badge: "bg-amber-500", hover: "hover:border-amber-400", pill: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500" },
  K4: { badge: "bg-violet-600", hover: "hover:border-violet-400", pill: "bg-violet-50 text-violet-700 border-violet-200", bar: "bg-violet-500" },
};

function LessonCard({
  lesson,
  accessCourses,
  color,
}: {
  lesson: Lesson;
  accessCourses: Course[];
  color: CourseColor;
}) {
  const free = isFreeLesson(lesson);
  const unlocked = lesson.available && (free || accessCourses.includes(lesson.course));
  const card = (
    <div
      className={`h-full rounded-2xl border p-4 transition ${
        lesson.available ? `border-line ${color.hover}` : "border-dashed border-line opacity-55"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-sm font-bold text-white rounded-lg px-2.5 py-1.5 ${
            lesson.available ? color.badge : "bg-line"
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

// Liệt kê toàn bộ lộ trình, gom theo 4 khóa (= phân chia gói). accessCourses = các khóa user mở được.
export function CourseCatalog({ accessCourses = [] }: { accessCourses?: Course[] }) {
  return (
    <div className="space-y-10">
      {COURSE_ORDER.map((courseId) => {
        const meta = COURSES.find((c) => c.id === courseId)!;
        const color = COURSE_COLORS[courseId];
        const lessons = lessonsOfCourse(courseId);
        const isFreeCourse = FREE_COURSES.includes(courseId);
        const inPackages = productsIncludingCourse(courseId).map((p) => p.label);
        const doneCount = lessons.filter((l) => l.available).length;

        return (
          <section key={courseId}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className={`inline-block h-4 w-1.5 rounded-full ${color.bar}`} aria-hidden />
                  {meta.name}
                  <span className={`font-mono text-[11px] font-normal border rounded px-1.5 py-0.5 ${color.pill}`}>
                    {courseId}
                  </span>
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
                <LessonCard key={l.no} lesson={l} accessCourses={accessCourses} color={color} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
