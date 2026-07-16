"use client";

import { useState } from "react";
import { COURSES } from "@/lib/products";
import { PARTS, lessonsOfCourse, type Course } from "@/lib/lessons";

// Accordion lộ trình kiểu mockup A: 1 khóa mở tại một thời điểm, liệt kê các PHẦN thật của khóa.
export function LandingCurriculum() {
  const [open, setOpen] = useState<Course | null>("K1");
  return (
    <div className="curriculum">
      {COURSES.map((c) => {
        const isOpen = open === c.id;
        const parts = PARTS.filter((p) => p.course === c.id);
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
                {parts.map((p) => (
                  <div className="topic" key={p.id}>
                    <span className="n">{p.id}</span> {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
