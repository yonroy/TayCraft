"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  COURSE_ORDER,
  PARTS,
  lessonsOfCourse,
  isFreeLesson,
  FREE_COURSES,
  type Course,
  type Lesson,
} from "@/lib/lessons";
import { COURSES, productsIncludingCourse } from "@/lib/products";

// Mỗi khóa một màu (class TĨNH — không ghép động để Tailwind không purge mất).
// Bám quy ước màu dự án: lam → lục → cam → tím.
type CourseColor = { badge: string; hover: string; pill: string; bar: string; ring: string };
const COURSE_COLORS: Record<Course, CourseColor> = {
  K1: { badge: "bg-blue-600", hover: "hover:border-blue-400", pill: "bg-blue-50 text-blue-700 border-blue-200", bar: "bg-blue-500", ring: "ring-blue-200" },
  K2: { badge: "bg-emerald-600", hover: "hover:border-emerald-400", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500", ring: "ring-emerald-200" },
  K3: { badge: "bg-amber-500", hover: "hover:border-amber-400", pill: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500", ring: "ring-amber-200" },
  K4: { badge: "bg-violet-600", hover: "hover:border-violet-400", pill: "bg-violet-50 text-violet-700 border-violet-200", bar: "bg-violet-500", ring: "ring-violet-200" },
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
      className={`h-full rounded-xl border p-3 transition ${
        lesson.available ? `border-line ${color.hover}` : "border-dashed border-line opacity-55"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-xs font-bold text-white rounded-md px-2 py-1 ${
            lesson.available ? color.badge : "bg-line"
          }`}
        >
          {lesson.no}
        </span>
        <div className="flex-1" />
        {free && <span className="text-[11px] font-mono font-bold text-accent-2">FREE</span>}
        {lesson.available && !unlocked && <span className="text-sm">🔒</span>}
        {!lesson.available && <span className="text-[11px] text-dim font-mono">sắp ra</span>}
      </div>
      <h4 className="mt-2 text-sm font-semibold leading-snug">{lesson.title}</h4>
    </div>
  );

  if (lesson.available && lesson.slug) {
    return <Link href={`/learn/${lesson.slug}`}>{card}</Link>;
  }
  return card;
}

function CourseRow({
  courseId,
  accessCourses,
  defaultOpen,
}: {
  courseId: Course;
  accessCourses: Course[];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = COURSES.find((c) => c.id === courseId)!;
  const color = COURSE_COLORS[courseId];
  const lessons = lessonsOfCourse(courseId);
  const parts = PARTS.filter((p) => p.course === courseId);
  const isFreeCourse = FREE_COURSES.includes(courseId);
  const inPackages = productsIncludingCourse(courseId).map((p) => p.label);
  const doneCount = lessons.filter((l) => l.available).length;
  const panelId = `curriculum-panel-${courseId}`;

  return (
    <div className={`rounded-2xl border transition ${open ? `border-line ring-1 ${color.ring}` : "border-line"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
      >
        <span className={`hidden h-9 w-1.5 shrink-0 rounded-full sm:inline-block ${color.bar}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold leading-snug">{meta.name}</h3>
            <span className={`font-mono text-[11px] font-normal border rounded px-1.5 py-0.5 ${color.pill}`}>
              {courseId}
            </span>
            {isFreeCourse && (
              <span className="font-mono text-[11px] font-bold text-accent-2">FREE</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-dim">{meta.desc}</p>
        </div>
        <span className="shrink-0 text-right">
          <span className="block font-mono text-xs text-dim">
            {doneCount}/{lessons.length} phiếu
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-dim transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div id={panelId} className="border-t border-line px-4 pb-5 pt-4 sm:px-5">
          <p className="mb-4 text-xs text-dim">
            {isFreeCourse ? (
              <span className="text-dim">Miễn phí cho mọi người học</span>
            ) : (
              <>
                Có trong gói: <span className="text-ink">{inPackages.join(" · ")}</span>
              </>
            )}
          </p>
          <div className="space-y-5">
            {parts.map((part) => {
              const partLessons = lessons.filter((l) => l.part === part.id);
              if (partLessons.length === 0) return null;
              return (
                <div key={part.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-dim border border-line rounded-md px-1.5 py-0.5">
                      {part.id}
                    </span>
                    <h4 className="text-sm font-semibold">{part.name}</h4>
                    <span className="font-mono text-[11px] text-dim">
                      {partLessons.filter((l) => l.available).length}/{partLessons.length}
                    </span>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {partLessons.map((l) => (
                      <LessonCard key={l.no} lesson={l} accessCourses={accessCourses} color={color} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Lộ trình gom theo 4 khóa dạng ACCORDION.
// - Mặc định (landing): chỉ K1 mở, còn lại gập cho gọn trang.
// - `openCourses`: danh sách khóa mở sẵn (trang /learn truyền các khóa đã sở hữu để học viên
//   thấy ngay bài học được). Rỗng/không truyền → fallback về mở K1.
export function CurriculumAccordion({
  accessCourses = [],
  openCourses,
}: {
  accessCourses?: Course[];
  openCourses?: Course[];
}) {
  const openSet = openCourses && openCourses.length ? openCourses : null;
  return (
    <div className="space-y-3">
      {COURSE_ORDER.map((courseId, i) => (
        <CourseRow
          key={courseId}
          courseId={courseId}
          accessCourses={accessCourses}
          defaultOpen={openSet ? openSet.includes(courseId) : i === 0}
        />
      ))}
    </div>
  );
}
