import { HeaderSkeleton, Skel, SpinnerBlock } from "@/components/skeletons";

// Khung xương trang xem phiếu. Cố ý KHÔNG phát minh kiểu mới: khối chờ dùng đúng vòng quay
// + chữ "Đang tải phiếu…" của LessonFrame, và giữ đúng chiều cao h-[calc(100vh-8rem)] của
// iframe để khi phiếu thật thế chỗ thì không nhảy. Thanh nav bài (2 ô "Bài trước/Bài sau")
// cũng dựng sẵn theo đúng lưới grid-cols-2 của LessonNav.

export default function LoadingLesson() {
  return (
    <>
      <HeaderSkeleton />
      <main className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-5xl px-5 py-4 flex items-center justify-between gap-3">
          {/* Chữ tĩnh, giống hệt trang thật → không nhấp nháy. */}
          <span className="text-accent font-medium whitespace-nowrap">← Tất cả bài học</span>
          <Skel className="h-[18px] w-[min(260px,45vw)]" />
        </div>

        <div className="flex-1 bg-paper">
          <SpinnerBlock label="Đang tải phiếu…" className="h-[calc(100vh-8rem)] w-full" />

          <div className="mx-auto max-w-5xl px-5 py-3 text-center text-sm text-dim">
            Mẹo: bấm <b>🎲 Đổi số</b> để luyện bộ số mới · <b>🖨️ In / Lưu PDF</b> để in ra giấy.
          </div>

          <div className="mx-auto max-w-5xl px-5 pb-10">
            <nav className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3" aria-hidden="true">
              {["← Bài trước", "Bài sau →"].map((cue, i) => (
                <div
                  key={cue}
                  className={`flex flex-col gap-0.5 rounded-2xl border border-line bg-white px-4 py-3 ${
                    i === 1 ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs font-medium text-dim">{cue}</span>
                  <Skel className="mt-0.5 h-[17px] w-[min(180px,60%)]" />
                </div>
              ))}
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}
