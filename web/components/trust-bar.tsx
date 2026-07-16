// Dải số liệu nền tối ngay dưới hero (điểm nhấn "trust-heavy").
// CHỈ dùng số THẬT/suy ra được — không bịa lượt in/học viên. Điểm review lấy từ review đã duyệt.
export function TrustBar({
  totalPhieu,
  courseCount,
  partCount,
  freeCount,
  reviewAvg,
  reviewCount,
}: {
  totalPhieu: number;
  courseCount: number;
  partCount: number;
  freeCount: number;
  reviewAvg: string | null;
  reviewCount: number;
}) {
  const items: { num: string; unit?: string; lbl: string }[] = [
    { num: String(totalPhieu), lbl: "phiếu tính tay · ra thêm liên tục" },
    { num: String(courseCount), unit: "khóa", lbl: `${partCount} phần lộ trình` },
    { num: String(freeCount), lbl: "phiếu xem tự do trước khi mua" },
    // Ô cuối: có review đã duyệt → khoe điểm thật; chưa có → khoe điểm khác biệt "đổi số vô hạn".
    reviewCount > 0
      ? { num: reviewAvg ?? "—", unit: "★", lbl: `${reviewCount} đánh giá học viên` }
      : { num: "∞", unit: "🎲", lbl: "bộ số luyện lại mỗi phiếu" },
  ];

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          {items.map((it) => (
            <div key={it.lbl} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {it.num}
                {it.unit && (
                  <span className="ml-0.5 text-lg font-bold text-[#67d3e8]">{it.unit}</span>
                )}
              </div>
              <div className="mt-1 text-xs text-white/70 sm:text-sm">{it.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
