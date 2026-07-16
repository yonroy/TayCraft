// FAQ xử lý nghi ngại trước khi mua — mỗi câu không trả lời là một lý do rời trang.
// Dùng <details> native: không cần JS, SEO đọc được toàn bộ nội dung.
import { SectionHeading } from "@/components/section-heading";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Mình cần nền toán đến đâu? Cấp 3 có đủ không?",
    a: "Đủ, thậm chí dư. Bạn chỉ cần cộng–trừ–nhân–chia, lũy thừa và căn bậc hai — toán cấp 2 là làm được. Bộ phiếu dạy lại từ đầu: bài đầu tiên là cộng hai vectơ, mỗi bước đều có giải thích \"vì sao\" và đáp án để đối chiếu. Không cần biết đạo hàm trước — đến bài cần, phiếu sẽ dạy.",
  },
  {
    q: "Mua xong thì nhận bài học thế nào?",
    a: "Thanh toán bằng QR chuyển khoản, hệ thống tự mở khóa ngay khi nhận được tiền (thường dưới 1 phút). Bài học gắn với tài khoản email của bạn — đăng nhập là học được trên web, hoặc bấm in/lưu PDF từng bài. Trả một lần, truy cập trọn đời, không thuê bao.",
  },
  {
    q: "Không có máy in thì học được không?",
    a: "Được. Cách phổ biến nhất: mở phiếu trên màn hình, tính ra giấy nháp rồi đối chiếu đáp án ở trang 2. Muốn bản giấy \"xịn\" để giải bằng bút chì: bấm Lưu PDF rồi mang ra tiệm photo — mỗi bài chỉ 2 trang A4, vài trăm đồng một bài.",
  },
  {
    q: "Khác gì xem video YouTube miễn phí?",
    a: "Xem hiểu và tự làm được là hai chuyện khác nhau. Video xem xong thấy \"à hiểu rồi\", 10 phút sau quên; phiếu bắt bạn tự nhân–cộng từng ô, sai ở đâu lộ ra ngay khi đối chiếu đáp án — kiến thức đi qua tay mới ở lại. Mỗi phiếu còn có nút 🎲 đổi số để luyện lại vô hạn lần với đề mới, thứ video không làm được.",
  },
  {
    q: "Có hoàn tiền không?",
    a: "Có — hoàn 100% trong 7 ngày, không cần lý do. Nhắn qua Facebook (link ở cuối trang) hoặc email kèm mã chuyển khoản là được hoàn lại đúng số tiền đã trả. Ngoài ra bạn có thể thử trước khi mua: 3 phiếu đầu xem tự do trước khi quyết định.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-12 scroll-mt-20">
      <SectionHeading title="Câu hỏi thường gặp" />
      <div className="mt-6 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-line px-5 py-4 open:bg-paper"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="text-dim transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-dim">{f.a}</p>
          </details>
        ))}
      </div>

      {/* FAQPage schema cho Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}
