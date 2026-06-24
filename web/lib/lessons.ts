// Manifest 26 bài "AI by Hand" — trích từ ai-by-hand/index.html.
// available = đã có file phiếu trong content/ai-by-hand. isFree = cho xem thử không cần mua.

export type Section = "Nền tảng" | "Nâng cao" | "Huấn luyện & sinh";

export interface Lesson {
  no: string; // "01".."26"
  slug: string | null; // tên file không .html; null nếu chưa ra
  title: string;
  english: string;
  blurb: string;
  section: Section;
  available: boolean;
  isFree: boolean;
}

export const FREE_SLUGS = ["01-tich-vo-huong", "02-nhan-ma-tran", "03-lop-tuyen-tinh"];

// Các asset dùng chung luôn được phép tải (kể cả khi xem bài free).
export const SHARED_ASSETS = ["wb.css", "wb-random.js"];

export const LESSONS: Lesson[] = [
  { no: "01", slug: "01-tich-vo-huong", title: "Tích vô hướng", english: "Dot Product", blurb: "Nhân từng cặp rồi cộng → một con số. Viên gạch của mọi phép tính AI.", section: "Nền tảng", available: true, isFree: true },
  { no: "02", slug: "02-nhan-ma-tran", title: "Nhân ma trận", english: "Matrix Multiplication", blurb: "Xếp nhiều tích vô hướng: Cᵢⱼ = hàng i · cột j.", section: "Nền tảng", available: true, isFree: true },
  { no: "03", slug: "03-lop-tuyen-tinh", title: "Lớp tuyến tính", english: "y = Wx + b", blurb: "Khối Lego của deep learning: W trộn đầu vào, b dịch chuyển.", section: "Nền tảng", available: true, isFree: true },
  { no: "04", slug: "04-ham-kich-hoat", title: "Hàm kích hoạt", english: "Activation", blurb: "ReLU = max(0,z), sigmoid ép về (0,1). Vì sao cần phi tuyến.", section: "Nền tảng", available: true, isFree: false },
  { no: "05", slug: "05-mot-no-ron", title: "Một nơ-ron", english: "Neuron", blurb: "z = w·x + b → a = f(z). Tế bào của mạng.", section: "Nền tảng", available: true, isFree: false },
  { no: "06", slug: "06-mot-lop-no-ron", title: "Một lớp nơ-ron", english: "A Layer", blurb: "Nhiều nơ-ron song song → vectơ h = ReLU(Wx + b).", section: "Nền tảng", available: true, isFree: false },
  { no: "07", slug: "07-lop-an", title: "Lớp ẩn — MLP nhỏ", english: "Hidden Layer", blurb: "2 → 2(ẩn) → 1. Lan truyền xuôi qua hai lớp.", section: "Nền tảng", available: true, isFree: false },
  { no: "08", slug: "08-sau-rong", title: "Mạng sâu / rộng", english: "Deep vs Wide", blurb: "So hai kiến trúc cùng số tham số, hình dáng khác hẳn.", section: "Nền tảng", available: true, isFree: false },
  { no: "09", slug: "09-softmax", title: "Softmax đầu ra", english: "Softmax", blurb: "Logit → eˣ → chuẩn hóa thành xác suất cộng = 1.", section: "Nền tảng", available: true, isFree: false },
  { no: "10", slug: "10-gradient", title: "Gradient — một bước học", english: "Gradient", blurb: "θ ← θ − η∇: bi lăn xuống đáy parabol. Vai trò của η.", section: "Nền tảng", available: true, isFree: false },

  { no: "11", slug: "11-self-attention", title: "Self-Attention", english: "Tự chú ý", blurb: "Q, K, V → S = QKᵀ → √d → softmax → O = A·V.", section: "Nâng cao", available: true, isFree: false },
  { no: "12", slug: "12-backpropagation", title: "Backpropagation", english: "Lan truyền ngược", blurb: "Forward ra ℒ, backward bằng quy tắc chuỗi ra mọi gradient.", section: "Nâng cao", available: true, isFree: false },
  { no: "13", slug: "13-khoi-transformer", title: "Khối Transformer", english: "Encoder block", blurb: "Z=LN(X+Attn), Y=LN(Z+FFN(Z)). Viên gạch của GPT/BERT.", section: "Nâng cao", available: true, isFree: false },
  { no: "14", slug: "14-khoi-gpt-mask", title: "Khối GPT — Masked Attention", english: "Decoder-only", blurb: "Thêm mask nhân quả → ma trận chú ý tam giác dưới.", section: "Nâng cao", available: true, isFree: false },
  { no: "15", slug: "15-cross-attention", title: "Cross-Attention", english: "Encoder–Decoder", blurb: "Decoder lấy Q hỏi sang bộ nhớ K,V của encoder.", section: "Nâng cao", available: true, isFree: false },
  { no: "16", slug: "16-cnn-tich-chap", title: "CNN — một bộ lọc", english: "Convolution", blurb: "Trượt kernel 3×3 → feature map → ReLU → max-pool.", section: "Nâng cao", available: true, isFree: false },
  { no: "17", slug: "17-cross-entropy", title: "Cross-Entropy", english: "Loss", blurb: "ℒ = −ln p(đúng); gradient gọn g = p − y.", section: "Nâng cao", available: true, isFree: false },
  { no: "18", slug: "18-multi-head-attention", title: "Multi-Head Attention", english: "Nhiều đầu chú ý", blurb: "Chạy nhiều đầu song song, Concat rồi trộn bằng Wᴼ.", section: "Nâng cao", available: true, isFree: false },
  { no: "19", slug: "19-embedding-vitri", title: "Embedding & Positional", english: "Embedding", blurb: "Tra bảng token → vectơ, cộng dấu vị trí sin/cos.", section: "Nâng cao", available: true, isFree: false },
  { no: "20", slug: "20-layernorm", title: "LayerNorm / RMSNorm", english: "Normalization", blurb: "Chuẩn hóa theo hàng: μ, σ, γ, β; RMSNorm rẻ hơn.", section: "Nâng cao", available: true, isFree: false },
  { no: "21", slug: "21-rnn-mot-buoc", title: "RNN — một bước hồi quy", english: "Recurrent", blurb: "hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b): ký ức qua thời gian.", section: "Nâng cao", available: true, isFree: false },
  { no: "22", slug: "22-lstm-mot-o-nho", title: "LSTM — một ô nhớ", english: "Long Short-Term Memory", blurb: "Cổng quên / vào / ra với số thật; băng chuyền ký ức.", section: "Nâng cao", available: true, isFree: false },

  { no: "23", slug: "23-adam-mot-buoc", title: "Adam — một bước cập nhật", english: "Adam", blurb: "m, v, hiệu chỉnh bias, bước thích nghi θ ← θ − η·m̂/√v̂.", section: "Huấn luyện & sinh", available: true, isFree: false },
  { no: "24", slug: "24-autoencoder-vae", title: "Autoencoder / VAE", english: "Autoencoder", blurb: "Nén x → z → dựng lại; reparam z = μ + σ⊙ε để sinh mẫu.", section: "Huấn luyện & sinh", available: true, isFree: false },
  { no: "25", slug: "25-diffusion-khu-nhieu", title: "Diffusion — một bước khử nhiễu", english: "Denoising", blurb: "Đoán nhiễu ε → ước lượng x̂₀ → trộn lại ít nhiễu hơn.", section: "Huấn luyện & sinh", available: true, isFree: false },
  { no: "26", slug: "26-mixture-of-experts", title: "Mixture of Experts", english: "MoE", blurb: "Router softmax chọn top-k chuyên gia cho mỗi token.", section: "Huấn luyện & sinh", available: true, isFree: false },
];

export const SECTIONS: Section[] = ["Nền tảng", "Nâng cao", "Huấn luyện & sinh"];

export function lessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function isFreeSlug(slug: string): boolean {
  return FREE_SLUGS.includes(slug);
}

export const TOTAL_AVAILABLE = LESSONS.filter((l) => l.available).length;
