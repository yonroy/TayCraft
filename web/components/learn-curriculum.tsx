"use client";

import { useState } from "react";
import Link from "next/link";
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

// Accordion lộ trình cho trang /learn — kế thừa ngôn ngữ .lp của trang chủ
// (LandingCurriculum) nhưng thân mở liệt kê BÀI HỌC click được, có trạng thái
// free / đã-mở / khóa / sắp-ra. Nhiều khóa mở đồng thời (học viên có thể sở hữu >1).
function LessonCell({
  lesson,
  accessCourses,
}: {
  lesson: Lesson;
  accessCourses: Course[];
}) {
  const free = isFreeLesson(lesson);
  const unlocked = lesson.available && (free || accessCourses.includes(lesson.course));
  const inner = (
    <>
      <div className="les-top">
        <span className="les-no">{lesson.no}</span>
        {free && <span className="les-flag free">FREE</span>}
        {lesson.available && !unlocked && <span className="les-flag">🔒</span>}
        {!lesson.available && <span className="les-flag soon">sắp ra</span>}
      </div>
      <div className="les-title">{lesson.title}</div>
    </>
  );
  if (lesson.available && lesson.slug) {
    return (
      <Link href={`/learn/${lesson.slug}`} className="les-card">
        {inner}
      </Link>
    );
  }
  return <div className="les-card locked">{inner}</div>;
}

// - Mặc định: chỉ K1 mở.
// - `openCourses`: các khóa mở sẵn (trang /learn truyền các khóa đã sở hữu để
//   học viên thấy ngay bài học được). Rỗng → fallback mở K1.
export function LearnCurriculum({
  accessCourses = [],
  openCourses,
}: {
  accessCourses?: Course[];
  openCourses?: Course[];
}) {
  const [open, setOpen] = useState<Set<Course>>(
    () => new Set<Course>(openCourses && openCourses.length ? openCourses : ["K1"]),
  );
  const toggle = (c: Course) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  return (
    <div className="learn-acc">
      {COURSE_ORDER.map((cid) => {
        const meta = COURSES.find((c) => c.id === cid)!;
        const lessons = lessonsOfCourse(cid);
        const parts = PARTS.filter((p) => p.course === cid);
        const isFreeCourse = FREE_COURSES.includes(cid);
        const inPackages = productsIncludingCourse(cid).map((p) => p.label);
        const doneCount = lessons.filter((l) => l.available).length;
        const isOpen = open.has(cid);
        return (
          <div key={cid} className={`acc-item ${isOpen ? "open k-active" : ""}`}>
            <button
              type="button"
              className="acc-head"
              aria-expanded={isOpen}
              onClick={() => toggle(cid)}
            >
              <div className="acc-badge">{cid}</div>
              <div className="acc-head-txt">
                <div className="k-name">{meta.name}</div>
                <div className="k-meta">
                  {meta.desc} — {doneCount}/{lessons.length} phiếu
                </div>
              </div>
              <div className="acc-chevron">▾</div>
            </button>
            {isOpen && (
              <div className="acc-body-open">
                <p className="acc-meta-line">
                  {isFreeCourse ? (
                    "Miễn phí cho mọi người học"
                  ) : (
                    <>
                      Có trong gói: <b>{inPackages.join(" · ")}</b>
                    </>
                  )}
                </p>
                {parts.map((part) => {
                  const partLessons = lessons.filter((l) => l.part === part.id);
                  if (partLessons.length === 0) return null;
                  return (
                    <div className="les-part" key={part.id}>
                      <div className="les-part-head">
                        <span className="pno">{part.id}</span>
                        <span className="pname">{part.name}</span>
                        <span className="pcount">
                          {partLessons.filter((l) => l.available).length}/{partLessons.length}
                        </span>
                      </div>
                      <div className="les-grid">
                        {partLessons.map((l) => (
                          <LessonCell key={l.no} lesson={l} accessCourses={accessCourses} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
