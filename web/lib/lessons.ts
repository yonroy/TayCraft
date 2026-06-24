// Manifest phiếu "AI by Hand" — lộ trình đầy đủ (~138 phiếu) theo ai-by-hand/MUC-LUC-DAY-DU.md.
// Xếp theo thứ tự PHẦN A→N. available=true: đã có file trong content/ai-by-hand (badge số 01–26).
// available=false: placeholder "sắp ra" (badge mã PHẦN, slug=null). isFree=true: xem thử không cần mua.

// Khóa bán hàng (track). Mỗi bài thuộc đúng 1 khóa; gói sản phẩm gom các khóa lại (xem products.ts).
//   K1 Nền tảng AI · K2 Huấn luyện & Kiến trúc · K3 Transformer & LLM · K4 Chuyên sâu & Dự án
export type Course = "K1" | "K2" | "K3" | "K4";

// PHẦN nội dung (A–N) — đơn vị nhỏ trong lộ trình, dùng làm chip phân loại trên thẻ bài.
export type Part = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N";

export interface PartMeta {
  id: Part;
  name: string;
  course: Course;
}

export const PARTS: PartMeta[] = [
  { id: "A", name: "Toán nền tảng", course: "K1" },
  { id: "B", name: "Học máy cổ điển", course: "K1" },
  { id: "C", name: "Nơ-ron & MLP", course: "K1" },
  { id: "D", name: "Mất mát, gradient & tối ưu", course: "K2" },
  { id: "E", name: "Huấn luyện & chuẩn hóa", course: "K2" },
  { id: "F", name: "Thị giác máy tính (CNN)", course: "K2" },
  { id: "G", name: "Dữ liệu chuỗi (RNN/LSTM)", course: "K2" },
  { id: "H", name: "Attention & Transformer", course: "K3" },
  { id: "I", name: "Mô hình ngôn ngữ lớn (LLM)", course: "K3" },
  { id: "J", name: "Mô hình sinh (Generative)", course: "K3" },
  { id: "K", name: "Học tăng cường (RL)", course: "K4" },
  { id: "L", name: "Đánh giá & đo lường", course: "K4" },
  { id: "M", name: "Nâng cao / tùy chọn", course: "K4" },
  { id: "N", name: "Dự án tổng kết (Capstone)", course: "K4" },
];

export interface Lesson {
  no: string; // badge: "01".."26" cho bài đã có, mã PHẦN ("A1"…) cho placeholder
  slug: string | null; // tên file không .html; null nếu chưa ra
  title: string;
  english: string;
  blurb: string;
  part: Part;
  course: Course;
  available: boolean;
  isFree: boolean;
}

export const FREE_SLUGS = ["01-tich-vo-huong", "02-nhan-ma-tran", "03-lop-tuyen-tinh"];

// Khóa mở miễn phí cho MỌI người (lead magnet của phễu). K1 = Nền tảng AI.
export const FREE_COURSES: Course[] = ["K1"];

// Bài này có miễn phí không (free slug riêng lẻ HOẶC thuộc khóa free).
export function isFreeLesson(l: Lesson): boolean {
  return l.isFree || (l.slug != null && FREE_SLUGS.includes(l.slug)) || FREE_COURSES.includes(l.course);
}

// Các asset dùng chung luôn được phép tải (kể cả khi xem bài free).
export const SHARED_ASSETS = ["wb.css", "wb-random.js"];

// Helper dựng placeholder "sắp ra" (slug=null, available=false, isFree=false).
function soon(no: string, part: Part, course: Course, title: string, english: string, blurb: string): Lesson {
  return { no, slug: null, title, english, blurb, part, course, available: false, isFree: false };
}

export const LESSONS: Lesson[] = [
  // ── PHẦN A · Toán nền tảng (K1) ─────────────────────────────────────────
  soon("A1", "A", "K1", "Vectơ: cộng, trừ, nhân vô hướng", "Vector ops", "Cộng/trừ từng ô, nhân hệ số — phép tay nền của mọi bài sau."),
  soon("A2", "A", "K1", "Độ dài & chuẩn", "Norm (L1, L2)", "Tính √(Σx²) và Σ|x| — đo độ lớn của một vectơ."),
  { no: "01", slug: "01-tich-vo-huong", title: "Tích vô hướng", english: "Dot Product", blurb: "Nhân từng cặp rồi cộng → một con số. Viên gạch của mọi phép tính AI.", part: "A", course: "K1", available: true, isFree: true },
  soon("A4", "A", "K1", "Cosine similarity", "Cosine", "dot ÷ (‖a‖‖b‖) → độ giống nhau về hướng giữa hai vectơ."),
  soon("A5", "A", "K1", "Phép chiếu vectơ", "Projection", "(a·b/‖b‖²)·b — bóng của a lên hướng b."),
  soon("A6", "A", "K1", "Ma trận chuyển vị", "Transpose", "Lật hàng ↔ cột — thao tác xuất hiện khắp attention/backprop."),
  { no: "02", slug: "02-nhan-ma-tran", title: "Nhân ma trận", english: "Matrix Multiplication", blurb: "Xếp nhiều tích vô hướng: Cᵢⱼ = hàng i · cột j.", part: "A", course: "K1", available: true, isFree: true },
  soon("A8", "A", "K1", "Ma trận × vectơ", "Matvec", "Mỗi hàng một tích vô hướng → vectơ kết quả."),
  soon("A9", "A", "K1", "Định thức & nghịch đảo 2×2", "Determinant", "ad − bc, rồi công thức nghịch đảo ma trận 2×2."),
  soon("A10", "A", "K1", "Hệ phương trình tuyến tính nhỏ", "Linear system", "Khử Gauss cho hệ 2×2 bằng tay."),
  soon("A11", "A", "K1", "Trị riêng / vectơ riêng 2×2", "Eigen", "Giải đa thức đặc trưng → trị riêng & vectơ riêng."),
  soon("A12", "A", "K1", "Đạo hàm một biến", "Derivatives", "Quy tắc lũy thừa/hằng — viên gạch của gradient."),
  soon("A13", "A", "K1", "Quy tắc chuỗi", "Chain rule", "dy/dx = dy/du · du/dx với số thật — gốc của backprop."),
  soon("A14", "A", "K1", "Gradient hàm nhiều biến", "Gradient", "Đạo hàm riêng từng biến → gom thành vectơ ∇."),
  soon("A15", "A", "K1", "Ma trận Jacobian nhỏ", "Jacobian", "Bảng đạo hàm riêng 2×2 cho hàm vectơ → vectơ."),
  soon("A16", "A", "K1", "Xác suất, kỳ vọng, phương sai", "Probability", "Tính E[X], Var(X) trên một bảng nhỏ."),
  soon("A17", "A", "K1", "Phân phối Bernoulli / Categorical", "Distributions", "Xác suất từng lớp, kiểm tổng = 1."),
  soon("A18", "A", "K1", "exp & log (dùng bảng tra)", "Exp & Log", "Tra eˣ, ln x bằng bảng cho sẵn — phục vụ softmax/CE."),
  soon("A19", "A", "K1", "Chuẩn hóa dữ liệu: min-max & z-score", "Normalization", "(x−min)/(max−min) và (x−μ)/σ."),
  soon("A20", "A", "K1", "One-hot encoding", "One-hot", "Nhãn → vectơ 0/1 để máy hiểu được."),

  // ── PHẦN B · Học máy cổ điển (K1) ───────────────────────────────────────
  soon("B1", "B", "K1", "Hồi quy tuyến tính 1 biến", "Linear Regression", "Least squares, tìm y = ax + b khớp dữ liệu."),
  soon("B2", "B", "K1", "Hồi quy tuyến tính nhiều biến", "Multivariate LR", "Normal equation nhỏ (XᵀX) bằng tay."),
  soon("B3", "B", "K1", "Hồi quy logistic 1 bước", "Logistic Regression", "sigmoid(wx+b) → loss → một bước cập nhật."),
  soon("B4", "B", "K1", "k-NN — k láng giềng gần nhất", "k-NN", "Tính khoảng cách, bỏ phiếu chọn lớp."),
  soon("B5", "B", "K1", "k-means 1 vòng", "k-means", "Gán điểm vào cụm + cập nhật tâm cụm."),
  soon("B6", "B", "K1", "PCA 2D", "PCA", "Hiệp phương sai → trục chính → chiếu dữ liệu."),
  soon("B7", "B", "K1", "Naive Bayes", "Naive Bayes", "Nhân các xác suất → so sánh hậu nghiệm."),
  soon("B8", "B", "K1", "Cây quyết định: Entropy & Information Gain", "Decision Tree", "Chọn split tốt nhất theo độ lợi thông tin."),
  soon("B9", "B", "K1", "Cây quyết định: Gini", "Gini", "Tính chỉ số Gini cho từng split."),
  soon("B10", "B", "K1", "SVM: lề hình học", "Margin", "Khoảng cách điểm tới siêu phẳng phân tách."),
  soon("B11", "B", "K1", "Gradient Boosting — ý tưởng", "Boosting", "Khớp phần dư của mô hình trước, một bước."),

  // ── PHẦN C · Nơ-ron & MLP (K1) ──────────────────────────────────────────
  { no: "03", slug: "03-lop-tuyen-tinh", title: "Lớp tuyến tính", english: "y = Wx + b", blurb: "Khối Lego của deep learning: W trộn đầu vào, b dịch chuyển.", part: "C", course: "K1", available: true, isFree: true },
  soon("C2", "C", "K1", "Sigmoid chi tiết + đạo hàm", "Sigmoid", "σ(z) và σ'(z) = σ(1−σ)."),
  soon("C3", "C", "K1", "Tanh + đạo hàm", "Tanh", "tanh(z) và đạo hàm 1 − tanh²."),
  { no: "04", slug: "04-ham-kich-hoat", title: "Hàm kích hoạt", english: "Activation", blurb: "ReLU = max(0,z), sigmoid ép về (0,1). Vì sao cần phi tuyến.", part: "C", course: "K1", available: true, isFree: false },
  { no: "05", slug: "05-mot-no-ron", title: "Một nơ-ron", english: "Neuron", blurb: "z = w·x + b → a = f(z). Tế bào của mạng.", part: "C", course: "K1", available: true, isFree: false },
  { no: "06", slug: "06-mot-lop-no-ron", title: "Một lớp nơ-ron", english: "A Layer", blurb: "Nhiều nơ-ron song song → vectơ h = ReLU(Wx + b).", part: "C", course: "K1", available: true, isFree: false },
  { no: "07", slug: "07-lop-an", title: "Lớp ẩn — MLP nhỏ", english: "Hidden Layer", blurb: "2 → 2(ẩn) → 1. Lan truyền xuôi qua hai lớp.", part: "C", course: "K1", available: true, isFree: false },
  { no: "08", slug: "08-sau-rong", title: "Mạng sâu / rộng", english: "Deep vs Wide", blurb: "So hai kiến trúc cùng số tham số, hình dáng khác hẳn.", part: "C", course: "K1", available: true, isFree: false },
  soon("C9", "C", "K1", "Đếm tham số mạng", "Param count", "Σ(W + b) từng lớp → tổng tham số."),
  { no: "09", slug: "09-softmax", title: "Softmax đầu ra", english: "Softmax", blurb: "Logit → eˣ → chuẩn hóa thành xác suất cộng = 1.", part: "C", course: "K1", available: true, isFree: false },

  // ── PHẦN D · Mất mát, gradient & tối ưu (K2) ────────────────────────────
  soon("D1", "D", "K2", "MSE / MAE", "Regression loss", "Trung bình bình phương / tuyệt đối của sai số."),
  soon("D2", "D", "K2", "Binary Cross-Entropy", "BCE", "−[y ln p + (1−y) ln(1−p)] cho bài nhị phân."),
  { no: "17", slug: "17-cross-entropy", title: "Cross-Entropy", english: "Loss", blurb: "ℒ = −ln p(đúng); gradient gọn g = p − y.", part: "D", course: "K2", available: true, isFree: false },
  soon("D4", "D", "K2", "KL Divergence", "KL", "Σ p ln(p/q) — khoảng cách giữa hai phân phối."),
  { no: "10", slug: "10-gradient", title: "Gradient — một bước học", english: "Gradient", blurb: "θ ← θ − η∇: bi lăn xuống đáy parabol. Vai trò của η.", part: "D", course: "K2", available: true, isFree: false },
  soon("D6", "D", "K2", "Gradient descent 2 biến", "GD 2D", "Đi theo ∇ trên mặt đường đồng mức."),
  { no: "12", slug: "12-backpropagation", title: "Backpropagation", english: "Lan truyền ngược", blurb: "Forward ra ℒ, backward bằng quy tắc chuỗi ra mọi gradient.", part: "D", course: "K2", available: true, isFree: false },
  soon("D8", "D", "K2", "Backprop qua MLP nhiều lớp", "Backprop MLP", "δ lan ngược qua từng lớp ẩn."),
  soon("D9", "D", "K2", "Backprop qua Softmax + CE", "Softmax grad", "Rút gọn đẹp: g = p − y."),
  soon("D10", "D", "K2", "SGD vanilla (1 mini-batch)", "SGD", "Trung bình gradient cả batch → một bước cập nhật."),
  soon("D11", "D", "K2", "Momentum", "Momentum", "v ← βv + ∇; θ ← θ − ηv — quán tính giúp đi nhanh."),
  soon("D12", "D", "K2", "RMSProp", "RMSProp", "Chia bước theo √(trung bình ∇²) từng tham số."),
  { no: "23", slug: "23-adam-mot-buoc", title: "Adam — một bước cập nhật", english: "Adam", blurb: "m, v, hiệu chỉnh bias, bước thích nghi θ ← θ − η·m̂/√v̂.", part: "D", course: "K2", available: true, isFree: false },
  soon("D14", "D", "K2", "AdamW (weight decay)", "AdamW", "Tách phạt trọng số ra khỏi gradient của Adam."),

  // ── PHẦN E · Huấn luyện & chuẩn hóa (K2) ────────────────────────────────
  soon("E1", "E", "K2", "Khởi tạo trọng số (Xavier / He)", "Init", "Tính phương sai khởi tạo theo fan-in."),
  soon("E2", "E", "K2", "Vanishing / Exploding gradient", "Grad flow", "Nhân chuỗi đạo hàm < 1 hoặc > 1 → tắt/nổ."),
  soon("E3", "E", "K2", "L2 regularization / weight decay", "L2 reg", "Thêm λ‖w‖² vào loss & gradient."),
  soon("E4", "E", "K2", "L1 regularization", "L1 reg", "λΣ|w| — đẩy trọng số nhỏ về 0 (thưa)."),
  soon("E5", "E", "K2", "Dropout (mask + scale)", "Dropout", "Nhân mask 0/1 rồi chia (1−p) khi huấn luyện."),
  soon("E6", "E", "K2", "BatchNorm — chuẩn hóa theo batch", "BatchNorm", "μ, σ trên batch rồi γ, β."),
  { no: "20", slug: "20-layernorm", title: "LayerNorm / RMSNorm", english: "Normalization", blurb: "Chuẩn hóa theo hàng: μ, σ, γ, β; RMSNorm rẻ hơn.", part: "E", course: "K2", available: true, isFree: false },
  soon("E8", "E", "K2", "Learning rate schedule (step / cosine)", "LR schedule", "Tính η tại bước t theo lịch."),
  soon("E9", "E", "K2", "Gradient clipping", "Clip", "Cắt gradient theo chuẩn ‖g‖ để tránh nổ."),
  soon("E10", "E", "K2", "Mini-batch vs full-batch", "Batching", "Trung bình gradient theo cỡ batch khác nhau."),
  soon("E11", "E", "K2", "Early stopping", "Early stop", "Đọc đường train/val, chọn điểm dừng."),

  // ── PHẦN F · Thị giác máy tính / CNN (K2) ───────────────────────────────
  { no: "16", slug: "16-cnn-tich-chap", title: "CNN — một bộ lọc", english: "Convolution", blurb: "Trượt kernel 3×3 → feature map → ReLU → max-pool.", part: "F", course: "K2", available: true, isFree: false },
  soon("F2", "F", "K2", "Kích thước đầu ra (stride, padding)", "Output size", "(W − K + 2P)/S + 1."),
  soon("F3", "F", "K2", "Conv nhiều kênh (RGB)", "Multi-channel", "Cộng tích chập trên 3 kênh màu."),
  soon("F4", "F", "K2", "Nhiều bộ lọc → nhiều feature map", "Filters", "Mỗi filter cho một bản đồ đặc trưng."),
  soon("F5", "F", "K2", "Max / Average Pooling", "Pooling", "Lấy max / trung bình mỗi cửa sổ."),
  soon("F6", "F", "K2", "Receptive field", "Receptive field", "Vùng ảnh ảnh hưởng tới một ô sâu."),
  soon("F7", "F", "K2", "Conv 1×1", "1×1 conv", "Trộn kênh theo từng điểm ảnh."),
  soon("F8", "F", "K2", "Transposed conv (upsampling)", "Transposed", "Trải ô ra lưới lớn hơn để phóng to."),
  soon("F9", "F", "K2", "Kết nối tắt (Residual / skip)", "Residual", "y = F(x) + x — giúp mạng rất sâu học được."),
  soon("F10", "F", "K2", "Đếm tham số một lớp conv", "Conv params", "K·K·Cᵢₙ·Cₒᵤₜ + bias."),

  // ── PHẦN G · Dữ liệu chuỗi / RNN-LSTM (K2; embedding ở K3) ───────────────
  { no: "19", slug: "19-embedding-vitri", title: "Embedding & Positional", english: "Embedding", blurb: "Tra bảng token → vectơ, cộng dấu vị trí sin/cos.", part: "G", course: "K3", available: true, isFree: false },
  { no: "21", slug: "21-rnn-mot-buoc", title: "RNN — một bước hồi quy", english: "Recurrent", blurb: "hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b): ký ức qua thời gian.", part: "G", course: "K2", available: true, isFree: false },
  soon("G3", "G", "K2", "RNN trải nhiều bước (BPTT)", "BPTT", "Chạy 3 bước, thấy gradient nhân chuỗi qua thời gian."),
  { no: "22", slug: "22-lstm-mot-o-nho", title: "LSTM — một ô nhớ", english: "Long Short-Term Memory", blurb: "Cổng quên / vào / ra với số thật; băng chuyền ký ức.", part: "G", course: "K2", available: true, isFree: false },
  soon("G5", "G", "K2", "GRU 1 ô", "GRU", "Cổng cập nhật / đặt lại — gọn hơn LSTM."),
  soon("G6", "G", "K2", "Bi-directional RNN", "BiRNN", "Gộp hai chiều xuôi/ngược của chuỗi."),
  soon("G7", "G", "K2", "Seq2seq encoder → decoder", "Seq2seq", "Nén chuỗi → vectơ ngữ cảnh → giải mã."),
  soon("G8", "G", "K2", "Giải mã: Greedy vs Beam search", "Decoding", "Chọn token theo xác suất, giữ top-b nhánh."),
  soon("G9", "G", "K2", "Teacher forcing", "Teacher forcing", "Dùng nhãn thật làm đầu vào bước kế khi huấn luyện."),

  // ── PHẦN H · Attention & Transformer (K3) ───────────────────────────────
  soon("H1", "H", "K3", "Scaled dot-product attention", "Attention", "QKᵀ/√d → softmax → ·V (bản chi tiết từng bước)."),
  { no: "11", slug: "11-self-attention", title: "Self-Attention", english: "Tự chú ý", blurb: "Q, K, V → S = QKᵀ → √d → softmax → O = A·V.", part: "H", course: "K3", available: true, isFree: false },
  { no: "14", slug: "14-khoi-gpt-mask", title: "Khối GPT — Masked Attention", english: "Decoder-only", blurb: "Thêm mask nhân quả → ma trận chú ý tam giác dưới.", part: "H", course: "K3", available: true, isFree: false },
  { no: "18", slug: "18-multi-head-attention", title: "Multi-Head Attention", english: "Nhiều đầu chú ý", blurb: "Chạy nhiều đầu song song, Concat rồi trộn bằng Wᴼ.", part: "H", course: "K3", available: true, isFree: false },
  { no: "15", slug: "15-cross-attention", title: "Cross-Attention", english: "Encoder–Decoder", blurb: "Decoder lấy Q hỏi sang bộ nhớ K,V của encoder.", part: "H", course: "K3", available: true, isFree: false },
  { no: "13", slug: "13-khoi-transformer", title: "Khối Transformer", english: "Encoder block", blurb: "Z=LN(X+Attn), Y=LN(Z+FFN(Z)). Viên gạch của GPT/BERT.", part: "H", course: "K3", available: true, isFree: false },
  soon("H7", "H", "K3", "Positional Encoding sin/cos (chi tiết)", "Positional", "Tính nhiều vị trí × nhiều tần số."),
  soon("H8", "H", "K3", "RoPE — Rotary embedding", "RoPE", "Xoay một cặp chiều theo vị trí token."),
  soon("H9", "H", "K3", "Padding mask trong attention", "Padding mask", "Che các token đệm khỏi điểm chú ý."),
  soon("H10", "H", "K3", "KV cache — sinh token tiếp theo", "KV cache", "Tái dùng K,V cũ, chỉ tính cho token mới."),
  soon("H11", "H", "K3", "FFN trong Transformer", "FFN", "Hai lớp Linear + GELU, tính riêng từng ô."),

  // ── PHẦN I · Mô hình ngôn ngữ lớn / LLM (K3) ────────────────────────────
  soon("I1", "I", "K3", "Tokenization / BPE", "BPE", "Gộp cặp ký tự hay gặp nhất, từng bước."),
  soon("I2", "I", "K3", "Logits → softmax → sampling", "Sampling", "top-k, top-p và nhiệt độ τ."),
  soon("I3", "I", "K3", "Perplexity", "Perplexity", "exp(trung bình −ln p) — đo độ 'ngạc nhiên'."),
  { no: "26", slug: "26-mixture-of-experts", title: "Mixture of Experts", english: "MoE", blurb: "Router softmax chọn top-k chuyên gia cho mỗi token.", part: "I", course: "K3", available: true, isFree: false },
  soon("I5", "I", "K3", "LoRA — cập nhật hạng thấp", "LoRA", "ΔW = B·A với hạng nhỏ, tiết kiệm tham số."),
  soon("I6", "I", "K3", "Quantization int8", "Quantization", "scale + làm tròn trọng số về số nguyên."),
  soon("I7", "I", "K3", "Embedding similarity / RAG retrieval", "RAG", "Cosine giữa truy vấn & tài liệu → chọn top."),
  soon("I8", "I", "K3", "Greedy decode trọn một chuỗi", "Greedy decode", "Sinh từng token đến khi kết thúc."),
  soon("I9", "I", "K3", "Repetition penalty / logit bias", "Logit bias", "Điều chỉnh logit trước softmax."),
  soon("I10", "I", "K3", "Chat template → token hóa", "Chat template", "Gói system/user/assistant thành chuỗi token."),

  // ── PHẦN J · Mô hình sinh / Generative (K3) ─────────────────────────────
  { no: "24", slug: "24-autoencoder-vae", title: "Autoencoder / VAE", english: "Autoencoder", blurb: "Nén x → z → dựng lại; reparam z = μ + σ⊙ε để sinh mẫu.", part: "J", course: "K3", available: true, isFree: false },
  soon("J2", "J", "K3", "VAE — reparam + KL (chi tiết)", "VAE", "z = μ + σ⊙ε; phạt KL kéo về N(0,1)."),
  soon("J3", "J", "K3", "GAN — một bước D và G", "GAN", "Discriminator chấm thật/giả, generator học lừa."),
  soon("J4", "J", "K3", "Diffusion: forward (thêm nhiễu)", "Forward diffusion", "xₜ = √ᾱ x₀ + √(1−ᾱ) ε."),
  { no: "25", slug: "25-diffusion-khu-nhieu", title: "Diffusion — một bước khử nhiễu", english: "Denoising", blurb: "Đoán nhiễu ε → ước lượng x̂₀ → trộn lại ít nhiễu hơn.", part: "J", course: "K3", available: true, isFree: false },
  soon("J6", "J", "K3", "Noise schedule", "Noise schedule", "Tính β, α, ᾱ theo từng bước thời gian."),
  soon("J7", "J", "K3", "Sampling DDPM vs DDIM", "DDPM/DDIM", "So hai cách lấy mẫu khi sinh ảnh."),

  // ── PHẦN K · Học tăng cường / RL (K4) ───────────────────────────────────
  soon("K1", "K", "K4", "Phần thưởng & chiết khấu", "Return", "Return G = Σ γᵏ rₖ — cộng thưởng có chiết khấu."),
  soon("K2", "K", "K4", "Phương trình Bellman", "Bellman", "V(s) ← r + γ V(s')."),
  soon("K3", "K", "K4", "Q-learning — một cập nhật", "Q-learning", "Q ← Q + α[r + γ max Q' − Q]."),
  soon("K4", "K", "K4", "SARSA", "SARSA", "Cập nhật theo hành động thực sự đã đi."),
  soon("K5", "K", "K4", "Chính sách ε-greedy", "ε-greedy", "Cân giữa khám phá ngẫu nhiên và khai thác tham lam."),
  soon("K6", "K", "K4", "Policy Gradient (REINFORCE)", "REINFORCE", "∇ log π · G, một bước cập nhật chính sách."),
  soon("K7", "K", "K4", "Advantage / baseline", "Advantage", "A = G − V để giảm phương sai."),
  soon("K8", "K", "K4", "PPO — ý tưởng cắt (clip)", "PPO", "Kẹp tỉ lệ xác suất để bước cập nhật an toàn."),

  // ── PHẦN L · Đánh giá & đo lường (K4) ───────────────────────────────────
  soon("L1", "L", "K4", "Ma trận nhầm lẫn → Acc/P/R/F1", "Metrics", "Đếm TP/FP/FN/TN → Accuracy, Precision, Recall, F1."),
  soon("L2", "L", "K4", "ROC & AUC", "ROC/AUC", "Vẽ điểm theo ngưỡng, tính diện tích hình thang."),
  soon("L3", "L", "K4", "Cosine similarity (đo embedding)", "Cosine eval", "So hai vectơ biểu diễn bằng cosine."),
  soon("L4", "L", "K4", "BLEU — n-gram", "BLEU", "Đếm n-gram trùng + brevity penalty."),
  soon("L5", "L", "K4", "Top-k accuracy", "Top-k acc", "Đúng nếu nhãn nằm trong top-k dự đoán."),
  soon("L6", "L", "K4", "Calibration (độ tin cậy)", "Calibration", "So xác suất dự đoán với tần suất thực tế."),
  soon("L7", "L", "K4", "FLOPs — đếm phép tính một lớp", "FLOPs", "Đếm nhân–cộng của matmul / conv."),
  soon("L8", "L", "K4", "Độ trễ & thông lượng (ý tưởng)", "Latency", "Ước lượng thời gian chạy và throughput."),

  // ── PHẦN M · Nâng cao / tùy chọn (K4) ───────────────────────────────────
  soon("M1", "M", "K4", "GNN — message passing một bước", "GNN", "Gộp tin nhắn từ các đỉnh hàng xóm."),
  soon("M2", "M", "K4", "Contrastive learning (InfoNCE)", "Contrastive", "Kéo cặp dương lại, đẩy cặp âm ra."),
  soon("M3", "M", "K4", "Triplet loss", "Triplet", "anchor – positive – negative."),
  soon("M4", "M", "K4", "Multi-modal (CLIP)", "CLIP", "Cosine ảnh × chữ trong cùng không gian."),
  soon("M5", "M", "K4", "Knowledge distillation", "Distillation", "Học từ nhãn mềm của mô hình thầy."),

  // ── PHẦN N · Dự án tổng kết / Capstone (K4) ─────────────────────────────
  soon("N1", "N", "K4", "MLP phân loại điểm 2D — đủ vòng", "MLP capstone", "forward → loss → backward → cập nhật, trọn một vòng."),
  soon("N2", "N", "K4", "Mini-CNN nhận chữ số 5×5", "Mini-CNN", "conv → pool → FC → softmax."),
  soon("N3", "N", "K4", "Mini-GPT: 2 token, sinh 1 token", "Mini-GPT", "embedding → attention → FFN → logits."),
  soon("N4", "N", "K4", "Logistic regression hội tụ", "LR converge", "Lặp vài vòng đến khi loss giảm rõ."),
];

export const COURSE_ORDER: Course[] = ["K1", "K2", "K3", "K4"];

export function lessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function isFreeSlug(slug: string): boolean {
  return FREE_SLUGS.includes(slug);
}

// Bài (theo slug) có mở miễn phí cho mọi người không — gồm free slug lẻ + toàn bộ khóa free (K1).
export function isFreeContentSlug(slug: string): boolean {
  if (FREE_SLUGS.includes(slug)) return true;
  const l = lessonBySlug(slug);
  return l ? isFreeLesson(l) : false;
}

// Khóa (K1–K4) chứa bài có slug này — dùng để phân quyền theo gói.
export function courseOf(slug: string): Course | undefined {
  return lessonBySlug(slug)?.course;
}

export function lessonsOfCourse(course: Course): Lesson[] {
  return LESSONS.filter((l) => l.course === course);
}

export const TOTAL_AVAILABLE = LESSONS.filter((l) => l.available).length; // phiếu đã phát hành
export const TOTAL_PLANNED = LESSONS.length; // tổng lộ trình (~138)
