"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES } from "@/lib/products";
import { LESSONS, PARTS, FREE_SLUGS, lessonBySlug, lessonsOfCourse, type Course, type Part } from "@/lib/lessons";

// Các PHẦN có bài thật trong khóa `course`, theo đúng cặp (course, part) trong LESSONS —
// không lọc PARTS.course trực tiếp, vì PARTS chỉ khai 1 course "nhà" cho mỗi part.id
// (vd part "G" ghi course K2) trong khi bài G1-embedding-vitri lại thuộc K3. Lọc theo
// PARTS.course làm K3 mất hẳn phần G dù `count` của khóa vẫn đếm G1 (xem learn-dashboard.tsx,
// bài học #58 cùng họ lỗi). Tên phần cũng cần khớp nội dung thật: nếu phần đó ở khóa `course`
// không phải "nhà" của part.id (đúng trường hợp G ở K3) và chỉ có đúng 1 bài, dùng tên bài học
// đó thay cho tên phần chung chung (tránh hiện "RNN/LSTM" cho một phần chỉ có Embedding).
function partsOfCourse(course: Course): { id: Part; name: string }[] {
  const partIds = new Set(LESSONS.filter((l) => l.course === course).map((l) => l.part));
  return PARTS.filter((p) => partIds.has(p.id)).map((p) => {
    if (p.course === course) return p;
    const here = LESSONS.filter((l) => l.course === course && l.part === p.id);
    return here.length === 1 ? { id: p.id, name: here[0].title } : p;
  });
}

// Accordion lộ trình kiểu mockup A: 1 khóa mở tại một thời điểm, liệt kê các PHẦN thật của khóa.
export function LandingCurriculum() {
  const [open, setOpen] = useState<Course | null>("K1");
  return (
    <div className="curriculum">
      <div className="free-callout">
        <div className="fc-title">🎁 Xem miễn phí — không cần mua, không cần đăng nhập</div>
        <div className="fc-chips">
          {FREE_SLUGS.map((slug) => {
            const l = lessonBySlug(slug);
            if (!l) return null;
            return (
              <Link key={slug} href={`/learn/${slug}`} className="fc-chip">
                <span className="n">{l.no}</span> {l.title}
              </Link>
            );
          })}
        </div>
      </div>
      {COURSES.map((c) => {
        const isOpen = open === c.id;
        const parts = partsOfCourse(c.id);
        const count = lessonsOfCourse(c.id).filter((l) => l.available).length;
        const toggle = () => setOpen(isOpen ? null : c.id);
        return (
          <div key={c.id} className={`acc-item ${isOpen ? "open k-active" : ""}`}>
            <div
              className="acc-head"
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }}
            >
              <div className="acc-badge">{c.id}</div>
              <div className="acc-head-txt">
                <div className="k-name">{c.name}</div>
                <div className="k-meta">
                  {c.desc} — {count} phiếu
                </div>
              </div>
              <div className="acc-chevron">▾</div>
            </div>
            <div className="acc-body">
              <div className="acc-body-in">
                {parts.map((p) => {
                  // Bài đầu tiên (theo đúng thứ tự lộ trình) của phần này trong khóa —
                  // điểm vào tự nhiên khi bấm cả phần. Trang /learn/[slug] tự lo paywall,
                  // ở đây không tự chặn bài chưa mua.
                  const first = LESSONS.find((l) => l.course === c.id && l.part === p.id && l.slug);
                  const label = (
                    <>
                      <span className="n">{p.id}</span> {p.name}
                    </>
                  );
                  return first ? (
                    <Link
                      href={`/learn/${first.slug}`}
                      className="topic"
                      key={p.id}
                      style={{ textDecoration: "none", cursor: "pointer" }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <div className="topic" key={p.id}>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
