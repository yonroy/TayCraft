interface Review {
  name: string;
  role: string;
  rating: number; // 1–5, cho phép .5
  comment: string;
}

// Đánh giá (mẫu) của học viên — social proof tĩnh.
const REVIEWS: Review[] = [
  {
    name: "Nguyễn Hoàng Minh",
    role: "Sinh viên CNTT, ĐH Bách Khoa",
    rating: 5,
    comment:
      "Học attention bao lần đọc lý thuyết vẫn mơ hồ. Tự điền Q·Kᵀ rồi softmax bằng số thật một lần là thông luôn. Cảm giác cầm bút tính rất khác.",
  },
  {
    name: "Trần Thảo Vy",
    role: "Data Analyst",
    rating: 5,
    comment:
      "Backprop từng làm mình sợ. Phiếu dắt đi từng ô, nhân–cộng ra gradient, đến lúc nhìn lại thấy nó… dễ thương. In A4 giải bằng bút chì cực cuốn.",
  },
  {
    name: "Lê Quốc Bảo",
    role: "Kỹ sư phần mềm",
    rating: 5,
    comment:
      "Nút 🎲 đổi số là tuyệt chiêu — luyện lại bao nhiêu lần cũng có đề mới. Mình làm softmax với cross-entropy đến khi bấm số nào cũng ra đúng.",
  },
  {
    name: "Phạm Anh Tú",
    role: "Học viên tự học",
    rating: 4.5,
    comment:
      "Nội dung chắc, đi từ dot product lên Transformer rất mạch lạc. Mong ra thêm phần RL sớm. Còn lại thì quá đáng tiền.",
  },
  {
    name: "Đỗ Thu Hà",
    role: "Giáo viên Toán THPT",
    rating: 5,
    comment:
      "Mình dùng để hiểu AI mà dạy lại cho học sinh giỏi. Cách trình bày 'đề + đáp án' giống đề kiểm tra nên rất hợp để giảng.",
  },
  {
    name: "Vũ Đình Khoa",
    role: "Chuyển ngành sang ML",
    rating: 5,
    comment:
      "Không code, không thư viện — chỉ giấy và bút mà hiểu được LayerNorm, multi-head. Tự tin hẳn khi đọc paper vì biết bên trong nó tính gì.",
  },
  {
    name: "Hoàng Mỹ Linh",
    role: "Sinh viên năm 3",
    rating: 4.5,
    comment:
      "Lúc đầu hơi ngợp vì nhiều phiếu, nhưng học theo thứ tự là ổn. Phiếu CNN với embedding giúp mình qua môn Deep Learning ngon lành.",
  },
  {
    name: "Ngô Tấn Phát",
    role: "Backend Developer",
    rating: 5,
    comment:
      "Mua trọn bộ, học buổi tối cho vui mà nghiện. Tự tay chạy một bước Adam rồi diffusion khử nhiễu — kiểu kiến thức nhớ rất lâu.",
  },
];

const AVATAR_COLORS = ["bg-accent", "bg-accent-2", "bg-[#7c5cff]"];

function Stars({ value }: { value: number }) {
  return (
    <span className="text-accent-2 tracking-tight" aria-label={`${value} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return <span key={i}>{value >= n ? "★" : value >= n - 0.5 ? "⯪" : "☆"}</span>;
      })}
    </span>
  );
}

const AGG_RATING = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

export function Reviews() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">Học viên nói gì</h2>
        <p className="text-sm text-dim">
          <span className="text-accent-2 font-bold">★ {AGG_RATING}/5</span> · hơn 400 lượt học
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <figure key={r.name} className="rounded-2xl border border-line p-5 flex flex-col">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold ${
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                }`}
              >
                {(r.name.trim().split(/\s+/).pop() ?? r.name).charAt(0).toUpperCase()}
              </span>
              <figcaption className="min-w-0">
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-xs text-dim truncate">{r.role}</div>
              </figcaption>
            </div>
            <div className="mt-3">
              <Stars value={r.rating} />
            </div>
            <blockquote className="mt-2 text-sm text-dim leading-relaxed flex-1">
              “{r.comment}”
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  );
}
