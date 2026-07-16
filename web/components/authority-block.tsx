import { SectionHeading } from "@/components/section-heading";

// Khối uy tín PHƯƠNG PHÁP "AI by Hand" — nêu nguồn gốc phương pháp học bằng tay của
// GS. Tom Yeh (University of Colorado Boulder) mà bộ phiếu dựa theo.
// TRUNG THỰC: chỉ mô tả PHƯƠNG PHÁP, KHÔNG bịa endorsement/đối tác/lời chứng thực.
const PILLARS = [
  {
    icon: "✍️",
    t: "Tính từng số bằng tay",
    d: "Không xem cho qua: bạn tự nhân–cộng từng ô, nên nhớ vì đã tự làm chứ không phải đọc lướt.",
  },
  {
    icon: "🔢",
    t: "Số thật, ma trận nhỏ",
    d: "Ma trận cỡ vừa mắt, số nguyên dễ nhẩm — đủ để lộ đúng cơ chế, không rối vì con số to.",
  },
  {
    icon: "🧩",
    t: "Từ viên gạch đến Transformer",
    d: "Mỗi khái niệm là một bước tay: dot product → softmax → attention → khối Transformer.",
  },
];

export function AuthorityBlock() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <SectionHeading title="Dựa theo phương pháp “AI by Hand”">
        <p>
          Bộ phiếu bám tinh thần <b className="text-ink">“AI by Hand”</b> do{" "}
          <b className="text-ink">GS. Tom Yeh</b> (University of Colorado Boulder) phổ biến: học
          deep learning bằng cách <b className="text-ink">tự tính từng con số trên giấy</b> thay vì
          chỉ đọc lý thuyết hay xem code chạy.
        </p>
      </SectionHeading>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.t} className="rounded-2xl border border-line p-5">
            <div className="text-2xl" aria-hidden>
              {p.icon}
            </div>
            <h3 className="mt-2 font-bold leading-snug">{p.t}</h3>
            <p className="mt-1.5 text-sm text-dim">{p.d}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-dim">
        “AI by Hand” là phương pháp học công khai của GS. Tom Yeh. Đây là bộ phiếu tiếng Việt biên
        soạn <b className="text-ink">theo tinh thần đó</b> — không phải sản phẩm chính thức và không
        có liên kết hợp tác nào được ngụ ý.
      </p>
    </section>
  );
}
