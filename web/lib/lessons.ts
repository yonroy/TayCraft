// Manifest phiếu "Làm toán AI" — lộ trình đầy đủ (~138 phiếu) theo ai-by-hand/MUC-LUC-DAY-DU.md.
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

// Xem thử miễn phí: 3 phiếu đầu của K1 (A1, A2, A4) — preview của phễu. Phải khớp isFree trong LESSONS.
export const FREE_SLUGS = ["A1-vecto-cong-tru", "A2-do-dai-chuan", "A4-cosine-similarity"];

// Khóa mở miễn phí cho MỌI người. Sau khai trương K1 chuyển sang bán → không còn khóa free nào.
export const FREE_COURSES: Course[] = [];

// Bài này có miễn phí không (free slug riêng lẻ HOẶC thuộc khóa free).
export function isFreeLesson(l: Lesson): boolean {
  return l.isFree || (l.slug != null && FREE_SLUGS.includes(l.slug)) || FREE_COURSES.includes(l.course);
}

// Các asset dùng chung luôn được phép tải (kể cả khi xem bài free).
export const SHARED_ASSETS = ["wb.css", "wb-canvas.css", "wb-random.js"];

export const LESSONS: Lesson[] = [
  // ── PHẦN A · Toán nền tảng (K1) ─────────────────────────────────────────
  { no: "A1", slug: "A1-vecto-cong-tru", title: "Vectơ: cộng, trừ, nhân vô hướng", english: "Vector ops", blurb: "Cộng/trừ từng ô, nhân hệ số — phép tay nền của mọi bài sau.", part: "A", course: "K1", available: true, isFree: true },
  { no: "A2", slug: "A2-do-dai-chuan", title: "Độ dài & chuẩn", english: "Norm (L1, L2)", blurb: "Tính √(Σx²) và Σ|x| — đo độ lớn của một vectơ.", part: "A", course: "K1", available: true, isFree: true },
  { no: "A3", slug: "A3-tich-vo-huong", title: "Tích vô hướng", english: "Dot Product", blurb: "Nhân từng cặp rồi cộng → một con số. Viên gạch của mọi phép tính AI.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A4", slug: "A4-cosine-similarity", title: "Cosine similarity", english: "Cosine", blurb: "dot ÷ (‖a‖‖b‖) → độ giống nhau về hướng giữa hai vectơ.", part: "A", course: "K1", available: true, isFree: true },
  { no: "A5", slug: "A5-phep-chieu", title: "Phép chiếu vectơ", english: "Projection", blurb: "(a·b/‖b‖²)·b — bóng của a lên hướng b.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A6", slug: "A6-ma-tran-chuyen-vi", title: "Ma trận chuyển vị", english: "Transpose", blurb: "Lật hàng ↔ cột — thao tác xuất hiện khắp attention/backprop.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A7", slug: "A7-nhan-ma-tran-bien-doi-2d", title: "Nhân ma trận", english: "Matrix Multiplication", blurb: "Xếp nhiều tích vô hướng: Cᵢⱼ = hàng i · cột j.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A8", slug: "A8-ma-tran-nhan-vecto", title: "Ma trận × vectơ", english: "Matvec", blurb: "Mỗi hàng một tích vô hướng → vectơ kết quả.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A9", slug: "A9-dinh-thuc-nghich-dao", title: "Định thức & nghịch đảo 2×2", english: "Determinant", blurb: "ad − bc, rồi công thức nghịch đảo ma trận 2×2.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A10", slug: "A10-he-phuong-trinh", title: "Hệ phương trình tuyến tính nhỏ", english: "Linear system", blurb: "Khử Gauss cho hệ 2×2 bằng tay.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A11", slug: "A11-tri-rieng", title: "Trị riêng / vectơ riêng 2×2", english: "Eigen", blurb: "Giải đa thức đặc trưng → trị riêng & vectơ riêng.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A12", slug: "A12-dao-ham-mot-bien", title: "Đạo hàm một biến", english: "Derivatives", blurb: "Quy tắc lũy thừa/hằng — viên gạch của gradient.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A13", slug: "A13-quy-tac-chuoi", title: "Quy tắc chuỗi", english: "Chain rule", blurb: "dy/dx = dy/du · du/dx với số thật — gốc của backprop.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A14", slug: "A14-gradient-nhieu-bien", title: "Gradient hàm nhiều biến", english: "Gradient", blurb: "Đạo hàm riêng từng biến → gom thành vectơ ∇.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A15", slug: "A15-jacobian", title: "Ma trận Jacobian nhỏ", english: "Jacobian", blurb: "Bảng đạo hàm riêng 2×2 cho hàm vectơ → vectơ.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A16", slug: "A16-xac-suat-ky-vong", title: "Xác suất, kỳ vọng, phương sai", english: "Probability", blurb: "Tính E[X], Var(X) trên một bảng nhỏ.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A17", slug: "A17-bernoulli-categorical", title: "Phân phối Bernoulli / Categorical", english: "Distributions", blurb: "Xác suất từng lớp, kiểm tổng = 1.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A18", slug: "A18-exp-log", title: "exp & log (dùng bảng tra)", english: "Exp & Log", blurb: "Tra eˣ, ln x bằng bảng cho sẵn — phục vụ softmax/CE.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A19", slug: "A19-chuan-hoa-du-lieu", title: "Chuẩn hóa dữ liệu: min-max & z-score", english: "Normalization", blurb: "(x−min)/(max−min) và (x−μ)/σ.", part: "A", course: "K1", available: true, isFree: false },
  { no: "A20", slug: "A20-one-hot", title: "One-hot encoding", english: "One-hot", blurb: "Nhãn → vectơ 0/1 để máy hiểu được.", part: "A", course: "K1", available: true, isFree: false },

  // ── PHẦN B · Học máy cổ điển (K1) ───────────────────────────────────────
  { no: "B1", slug: "B1-hoi-quy-tuyen-tinh", title: "Hồi quy tuyến tính 1 biến", english: "Linear Regression", blurb: "Least squares, tìm y = ax + b khớp dữ liệu.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B2", slug: "B2-hoi-quy-da-bien", title: "Hồi quy tuyến tính nhiều biến", english: "Multivariate LR", blurb: "Normal equation nhỏ (XᵀX) bằng tay.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B3", slug: "B3-hoi-quy-logistic", title: "Hồi quy logistic 1 bước", english: "Logistic Regression", blurb: "sigmoid(wx+b) → loss → một bước cập nhật.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B4", slug: "B4-knn", title: "k-NN — k láng giềng gần nhất", english: "k-NN", blurb: "Tính khoảng cách, bỏ phiếu chọn lớp.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B5", slug: "B5-kmeans", title: "k-means 1 vòng", english: "k-means", blurb: "Gán điểm vào cụm + cập nhật tâm cụm.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B6", slug: "B6-pca", title: "PCA 2D", english: "PCA", blurb: "Hiệp phương sai → trục chính → chiếu dữ liệu.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B7", slug: "B7-naive-bayes", title: "Naive Bayes", english: "Naive Bayes", blurb: "Nhân các xác suất → so sánh hậu nghiệm.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B8", slug: "B8-cay-quyet-dinh-entropy", title: "Cây quyết định: Entropy & Information Gain", english: "Decision Tree", blurb: "Chọn split tốt nhất theo độ lợi thông tin.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B9", slug: "B9-cay-quyet-dinh-gini", title: "Cây quyết định: Gini", english: "Gini", blurb: "Tính chỉ số Gini cho từng split.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B10", slug: "B10-svm-margin", title: "SVM: lề hình học", english: "Margin", blurb: "Khoảng cách điểm tới siêu phẳng phân tách.", part: "B", course: "K1", available: true, isFree: false },
  { no: "B11", slug: "B11-gradient-boosting", title: "Gradient Boosting — ý tưởng", english: "Boosting", blurb: "Khớp phần dư của mô hình trước, một bước.", part: "B", course: "K1", available: true, isFree: false },

  // ── PHẦN C · Nơ-ron & MLP (K1) ──────────────────────────────────────────
  { no: "C1", slug: "C1-lop-tuyen-tinh", title: "Lớp tuyến tính", english: "y = Wx + b", blurb: "Khối Lego của deep learning: W trộn đầu vào, b dịch chuyển.", part: "C", course: "K1", available: true, isFree: false },
  { no: "C2", slug: "C2-sigmoid", title: "Sigmoid chi tiết + đạo hàm", english: "Sigmoid", blurb: "σ(z) và σ'(z) = σ(1−σ).", part: "C", course: "K1", available: true, isFree: false },
  { no: "C3", slug: "C3-tanh", title: "Tanh + đạo hàm", english: "Tanh", blurb: "tanh(z) và đạo hàm 1 − tanh².", part: "C", course: "K1", available: true, isFree: false },
  { no: "C4", slug: "C4-ham-kich-hoat", title: "Hàm kích hoạt", english: "Activation", blurb: "ReLU = max(0,z), sigmoid ép về (0,1). Vì sao cần phi tuyến.", part: "C", course: "K1", available: true, isFree: false },
  { no: "C5", slug: "C5-mot-no-ron", title: "Một nơ-ron", english: "Neuron", blurb: "z = w·x + b → a = f(z). Tế bào của mạng.", part: "C", course: "K1", available: true, isFree: false },
  { no: "C6", slug: "C6-mot-lop-no-ron", title: "Một lớp nơ-ron", english: "A Layer", blurb: "Nhiều nơ-ron song song → vectơ h = ReLU(Wx + b).", part: "C", course: "K1", available: true, isFree: false },
  { no: "C7", slug: "C7-lop-an", title: "Lớp ẩn — MLP nhỏ", english: "Hidden Layer", blurb: "2 → 2(ẩn) → 1. Lan truyền xuôi qua hai lớp.", part: "C", course: "K1", available: true, isFree: false },
  { no: "C8", slug: "C8-sau-rong", title: "Mạng sâu / rộng", english: "Deep vs Wide", blurb: "So hai kiến trúc cùng số tham số, hình dáng khác hẳn.", part: "C", course: "K1", available: true, isFree: false },
  { no: "C9", slug: "C9-dem-tham-so", title: "Đếm tham số mạng", english: "Param count", blurb: "Σ(W + b) từng lớp → tổng tham số.", part: "C", course: "K1", available: true, isFree: false },
  { no: "C10", slug: "C10-softmax", title: "Softmax đầu ra", english: "Softmax", blurb: "Logit → eˣ → chuẩn hóa thành xác suất cộng = 1.", part: "C", course: "K1", available: true, isFree: false },

  // ── PHẦN D · Mất mát, gradient & tối ưu (K2) ────────────────────────────
  { no: "D1", slug: "D1-mse-mae", title: "MSE / MAE", english: "Regression loss", blurb: "Trung bình bình phương / tuyệt đối của sai số.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D2", slug: "D2-binary-cross-entropy", title: "Binary Cross-Entropy", english: "BCE", blurb: "−[y ln p + (1−y) ln(1−p)] cho bài nhị phân.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D3", slug: "D3-cross-entropy", title: "Cross-Entropy", english: "Loss", blurb: "ℒ = −ln p(đúng); gradient gọn g = p − y.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D4", slug: "D4-kl-divergence", title: "KL Divergence", english: "KL", blurb: "Σ p ln(p/q) — khoảng cách giữa hai phân phối.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D5", slug: "D5-gradient", title: "Gradient — một bước học", english: "Gradient", blurb: "θ ← θ − η∇: bi lăn xuống đáy parabol. Vai trò của η.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D6", slug: "D6-gradient-descent-2-bien", title: "Gradient descent 2 biến", english: "GD 2D", blurb: "Đi theo ∇ trên mặt đường đồng mức.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D7", slug: "D7-backpropagation", title: "Backpropagation", english: "Lan truyền ngược", blurb: "Forward ra ℒ, backward bằng quy tắc chuỗi ra mọi gradient.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D8", slug: "D8-backprop-mlp", title: "Backprop qua MLP nhiều lớp", english: "Backprop MLP", blurb: "δ lan ngược qua từng lớp ẩn.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D9", slug: "D9-backprop-softmax-ce", title: "Backprop qua Softmax + CE", english: "Softmax grad", blurb: "Rút gọn đẹp: g = p − y.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D10", slug: "D10-sgd", title: "SGD vanilla (1 mini-batch)", english: "SGD", blurb: "Trung bình gradient cả batch → một bước cập nhật.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D11", slug: "D11-momentum", title: "Momentum", english: "Momentum", blurb: "v ← βv + ∇; θ ← θ − ηv — quán tính giúp đi nhanh.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D12", slug: "D12-rmsprop", title: "RMSProp", english: "RMSProp", blurb: "Chia bước theo √(trung bình ∇²) từng tham số.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D13", slug: "D13-adam-mot-buoc", title: "Adam — một bước cập nhật", english: "Adam", blurb: "m, v, hiệu chỉnh bias, bước thích nghi θ ← θ − η·m̂/√v̂.", part: "D", course: "K2", available: true, isFree: false },
  { no: "D14", slug: "D14-adamw", title: "AdamW (weight decay)", english: "AdamW", blurb: "Tách phạt trọng số ra khỏi gradient của Adam.", part: "D", course: "K2", available: true, isFree: false },

  // ── PHẦN E · Huấn luyện & chuẩn hóa (K2) ────────────────────────────────
  { no: "E1", slug: "E1-khoi-tao-trong-so", title: "Khởi tạo trọng số (Xavier / He)", english: "Init", blurb: "Tính phương sai khởi tạo theo fan-in.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E2", slug: "E2-vanishing-exploding", title: "Vanishing / Exploding gradient", english: "Grad flow", blurb: "Nhân chuỗi đạo hàm < 1 hoặc > 1 → tắt/nổ.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E3", slug: "E3-l2-regularization", title: "L2 regularization / weight decay", english: "L2 reg", blurb: "Thêm λ‖w‖² vào loss & gradient.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E4", slug: "E4-l1-regularization", title: "L1 regularization", english: "L1 reg", blurb: "λΣ|w| — đẩy trọng số nhỏ về 0 (thưa).", part: "E", course: "K2", available: true, isFree: false },
  { no: "E5", slug: "E5-dropout", title: "Dropout (mask + scale)", english: "Dropout", blurb: "Nhân mask 0/1 rồi chia (1−p) khi huấn luyện.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E6", slug: "E6-batchnorm", title: "BatchNorm — chuẩn hóa theo batch", english: "BatchNorm", blurb: "μ, σ trên batch rồi γ, β.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E7", slug: "E7-layernorm", title: "LayerNorm / RMSNorm", english: "Normalization", blurb: "Chuẩn hóa theo hàng: μ, σ, γ, β; RMSNorm rẻ hơn.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E8", slug: "E8-learning-rate-schedule", title: "Learning rate schedule (step / cosine)", english: "LR schedule", blurb: "Tính η tại bước t theo lịch.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E9", slug: "E9-gradient-clipping", title: "Gradient clipping", english: "Clip", blurb: "Cắt gradient theo chuẩn ‖g‖ để tránh nổ.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E10", slug: "E10-mini-batch", title: "Mini-batch vs full-batch", english: "Batching", blurb: "Trung bình gradient theo cỡ batch khác nhau.", part: "E", course: "K2", available: true, isFree: false },
  { no: "E11", slug: "E11-early-stopping", title: "Early stopping", english: "Early stop", blurb: "Đọc đường train/val, chọn điểm dừng.", part: "E", course: "K2", available: true, isFree: false },

  // ── PHẦN F · Thị giác máy tính / CNN (K2) ───────────────────────────────
  { no: "F1", slug: "F1-cnn-tich-chap", title: "CNN — một bộ lọc", english: "Convolution", blurb: "Trượt kernel 3×3 → feature map → ReLU → max-pool.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F2", slug: "F2-kich-thuoc-dau-ra", title: "Kích thước đầu ra (stride, padding)", english: "Output size", blurb: "(W − K + 2P)/S + 1.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F3", slug: "F3-conv-nhieu-kenh", title: "Conv nhiều kênh (RGB)", english: "Multi-channel", blurb: "Cộng tích chập trên 3 kênh màu.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F4", slug: "F4-nhieu-bo-loc", title: "Nhiều bộ lọc → nhiều feature map", english: "Filters", blurb: "Mỗi filter cho một bản đồ đặc trưng.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F5", slug: "F5-pooling", title: "Max / Average Pooling", english: "Pooling", blurb: "Lấy max / trung bình mỗi cửa sổ.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F6", slug: "F6-receptive-field", title: "Receptive field", english: "Receptive field", blurb: "Vùng ảnh ảnh hưởng tới một ô sâu.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F7", slug: "F7-conv-1x1", title: "Conv 1×1", english: "1×1 conv", blurb: "Trộn kênh theo từng điểm ảnh.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F8", slug: "F8-transposed-conv", title: "Transposed conv (upsampling)", english: "Transposed", blurb: "Trải ô ra lưới lớn hơn để phóng to.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F9", slug: "F9-residual", title: "Kết nối tắt (Residual / skip)", english: "Residual", blurb: "y = F(x) + x — giúp mạng rất sâu học được.", part: "F", course: "K2", available: true, isFree: false },
  { no: "F10", slug: "F10-dem-tham-so-conv", title: "Đếm tham số một lớp conv", english: "Conv params", blurb: "K·K·Cᵢₙ·Cₒᵤₜ + bias.", part: "F", course: "K2", available: true, isFree: false },

  // ── PHẦN G · Dữ liệu chuỗi / RNN-LSTM (K2; embedding ở K3) ───────────────
  { no: "G1", slug: "G1-embedding-vitri", title: "Embedding & Positional", english: "Embedding", blurb: "Tra bảng token → vectơ, cộng dấu vị trí sin/cos.", part: "G", course: "K3", available: true, isFree: false },
  { no: "G2", slug: "G2-rnn-mot-buoc", title: "RNN — một bước hồi quy", english: "Recurrent", blurb: "hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b): ký ức qua thời gian.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G3", slug: "G3-bptt", title: "RNN trải nhiều bước (BPTT)", english: "BPTT", blurb: "Chạy 3 bước, thấy gradient nhân chuỗi qua thời gian.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G4", slug: "G4-lstm-mot-o-nho", title: "LSTM — một ô nhớ", english: "Long Short-Term Memory", blurb: "Cổng quên / vào / ra với số thật; băng chuyền ký ức.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G5", slug: "G5-gru", title: "GRU 1 ô", english: "GRU", blurb: "Cổng cập nhật / đặt lại — gọn hơn LSTM.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G6", slug: "G6-birnn", title: "Bi-directional RNN", english: "BiRNN", blurb: "Gộp hai chiều xuôi/ngược của chuỗi.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G7", slug: "G7-seq2seq", title: "Seq2seq encoder → decoder", english: "Seq2seq", blurb: "Nén chuỗi → vectơ ngữ cảnh → giải mã.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G8", slug: "G8-greedy-beam", title: "Giải mã: Greedy vs Beam search", english: "Decoding", blurb: "Chọn token theo xác suất, giữ top-b nhánh.", part: "G", course: "K2", available: true, isFree: false },
  { no: "G9", slug: "G9-teacher-forcing", title: "Teacher forcing", english: "Teacher forcing", blurb: "Dùng nhãn thật làm đầu vào bước kế khi huấn luyện.", part: "G", course: "K2", available: true, isFree: false },

  // ── PHẦN H · Attention & Transformer (K3) ───────────────────────────────
  { no: "H1", slug: "H1-scaled-dot-product-attention", title: "Scaled dot-product attention", english: "Attention", blurb: "QKᵀ/√d → softmax → ·V (bản chi tiết từng bước).", part: "H", course: "K3", available: true, isFree: false },
  { no: "H2", slug: "H2-self-attention", title: "Self-Attention", english: "Tự chú ý", blurb: "Q, K, V → S = QKᵀ → √d → softmax → O = A·V.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H3", slug: "H3-khoi-gpt-mask", title: "Khối GPT — Masked Attention", english: "Decoder-only", blurb: "Thêm mask nhân quả → ma trận chú ý tam giác dưới.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H4", slug: "H4-multi-head-attention", title: "Multi-Head Attention", english: "Nhiều đầu chú ý", blurb: "Chạy nhiều đầu song song, Concat rồi trộn bằng Wᴼ.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H5", slug: "H5-cross-attention", title: "Cross-Attention", english: "Encoder–Decoder", blurb: "Decoder lấy Q hỏi sang bộ nhớ K,V của encoder.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H6", slug: "H6-khoi-transformer", title: "Khối Transformer", english: "Encoder block", blurb: "Z=LN(X+Attn), Y=LN(Z+FFN(Z)). Viên gạch của GPT/BERT.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H7", slug: "H7-positional-encoding", title: "Positional Encoding sin/cos (chi tiết)", english: "Positional", blurb: "Tính nhiều vị trí × nhiều tần số.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H8", slug: "H8-rope-rotary", title: "RoPE — Rotary embedding", english: "RoPE", blurb: "Xoay một cặp chiều theo vị trí token.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H9", slug: "H9-padding-mask", title: "Padding mask trong attention", english: "Padding mask", blurb: "Che các token đệm khỏi điểm chú ý.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H10", slug: "H10-kv-cache", title: "KV cache — sinh token tiếp theo", english: "KV cache", blurb: "Tái dùng K,V cũ, chỉ tính cho token mới.", part: "H", course: "K3", available: true, isFree: false },
  { no: "H11", slug: "H11-ffn", title: "FFN trong Transformer", english: "FFN", blurb: "Hai lớp Linear + GELU, tính riêng từng ô.", part: "H", course: "K3", available: true, isFree: false },

  // ── PHẦN I · Mô hình ngôn ngữ lớn / LLM (K3) ────────────────────────────
  { no: "I1", slug: "I1-bpe-tokenization", title: "Tokenization / BPE", english: "BPE", blurb: "Gộp cặp ký tự hay gặp nhất, từng bước.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I2", slug: "I2-sampling", title: "Logits → softmax → sampling", english: "Sampling", blurb: "top-k, top-p và nhiệt độ τ.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I3", slug: "I3-perplexity", title: "Perplexity", english: "Perplexity", blurb: "exp(trung bình −ln p) — đo độ 'ngạc nhiên'.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I4", slug: "I4-mixture-of-experts", title: "Mixture of Experts", english: "MoE", blurb: "Router softmax chọn top-k chuyên gia cho mỗi token.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I5", slug: "I5-lora", title: "LoRA — cập nhật hạng thấp", english: "LoRA", blurb: "ΔW = B·A với hạng nhỏ, tiết kiệm tham số.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I6", slug: "I6-quantization", title: "Quantization int8", english: "Quantization", blurb: "scale + làm tròn trọng số về số nguyên.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I7", slug: "I7-rag-retrieval", title: "Embedding similarity / RAG retrieval", english: "RAG", blurb: "Cosine giữa truy vấn & tài liệu → chọn top.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I8", slug: "I8-greedy-decode", title: "Greedy decode trọn một chuỗi", english: "Greedy decode", blurb: "Sinh từng token đến khi kết thúc.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I9", slug: "I9-repetition-penalty", title: "Repetition penalty / logit bias", english: "Logit bias", blurb: "Điều chỉnh logit trước softmax.", part: "I", course: "K3", available: true, isFree: false },
  { no: "I10", slug: "I10-chat-template", title: "Chat template → token hóa", english: "Chat template", blurb: "Gói system/user/assistant thành chuỗi token.", part: "I", course: "K3", available: true, isFree: false },

  // ── PHẦN J · Mô hình sinh / Generative (K3) ─────────────────────────────
  { no: "J1", slug: "J1-autoencoder-vae", title: "Autoencoder / VAE", english: "Autoencoder", blurb: "Nén x → z → dựng lại; reparam z = μ + σ⊙ε để sinh mẫu.", part: "J", course: "K3", available: true, isFree: false },
  { no: "J2", slug: "J2-vae-reparam-kl", title: "VAE — reparam + KL (chi tiết)", english: "VAE", blurb: "z = μ + σ⊙ε; phạt KL kéo về N(0,1).", part: "J", course: "K3", available: true, isFree: false },
  { no: "J3", slug: "J3-gan", title: "GAN — một bước D và G", english: "GAN", blurb: "Discriminator chấm thật/giả, generator học lừa.", part: "J", course: "K3", available: true, isFree: false },
  { no: "J4", slug: "J4-diffusion-forward", title: "Diffusion: forward (thêm nhiễu)", english: "Forward diffusion", blurb: "xₜ = √ᾱ x₀ + √(1−ᾱ) ε.", part: "J", course: "K3", available: true, isFree: false },
  { no: "J5", slug: "J5-diffusion-khu-nhieu", title: "Diffusion — một bước khử nhiễu", english: "Denoising", blurb: "Đoán nhiễu ε → ước lượng x̂₀ → trộn lại ít nhiễu hơn.", part: "J", course: "K3", available: true, isFree: false },
  { no: "J6", slug: "J6-noise-schedule", title: "Noise schedule", english: "Noise schedule", blurb: "Tính β, α, ᾱ theo từng bước thời gian.", part: "J", course: "K3", available: true, isFree: false },
  { no: "J7", slug: "J7-ddpm-ddim", title: "Sampling DDPM vs DDIM", english: "DDPM/DDIM", blurb: "So hai cách lấy mẫu khi sinh ảnh.", part: "J", course: "K3", available: true, isFree: false },

  // ── PHẦN K · Học tăng cường / RL (K4) ───────────────────────────────────
  { no: "K1", slug: "K1-return-discount", title: "Phần thưởng & chiết khấu", english: "Return", blurb: "Return G = Σ γᵏ rₖ — cộng thưởng có chiết khấu.", part: "K", course: "K4", available: true, isFree: false },
  { no: "K2", slug: "K2-bellman", title: "Phương trình Bellman", english: "Bellman", blurb: "V(s) ← r + γ V(s').", part: "K", course: "K4", available: true, isFree: false },
  { no: "K3", slug: "K3-q-learning", title: "Q-learning — một cập nhật", english: "Q-learning", blurb: "Q ← Q + α[r + γ max Q' − Q].", part: "K", course: "K4", available: true, isFree: false },
  { no: "K4", slug: "K4-sarsa", title: "SARSA", english: "SARSA", blurb: "Cập nhật theo hành động thực sự đã đi.", part: "K", course: "K4", available: true, isFree: false },
  { no: "K5", slug: "K5-epsilon-greedy", title: "Chính sách ε-greedy", english: "ε-greedy", blurb: "Cân giữa khám phá ngẫu nhiên và khai thác tham lam.", part: "K", course: "K4", available: true, isFree: false },
  { no: "K6", slug: "K6-policy-gradient", title: "Policy Gradient (REINFORCE)", english: "REINFORCE", blurb: "∇ log π · G, một bước cập nhật chính sách.", part: "K", course: "K4", available: true, isFree: false },
  { no: "K7", slug: "K7-advantage", title: "Advantage / baseline", english: "Advantage", blurb: "A = G − V để giảm phương sai.", part: "K", course: "K4", available: true, isFree: false },
  { no: "K8", slug: "K8-ppo-clip", title: "PPO — ý tưởng cắt (clip)", english: "PPO", blurb: "Kẹp tỉ lệ xác suất để bước cập nhật an toàn.", part: "K", course: "K4", available: true, isFree: false },

  // ── PHẦN L · Đánh giá & đo lường (K4) ───────────────────────────────────
  { no: "L1", slug: "L1-confusion-matrix", title: "Ma trận nhầm lẫn → Acc/P/R/F1", english: "Metrics", blurb: "Đếm TP/FP/FN/TN → Accuracy, Precision, Recall, F1.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L2", slug: "L2-roc-auc", title: "ROC & AUC", english: "ROC/AUC", blurb: "Vẽ điểm theo ngưỡng, tính diện tích hình thang.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L3", slug: "L3-cosine-eval", title: "Cosine similarity (đo embedding)", english: "Cosine eval", blurb: "So hai vectơ biểu diễn bằng cosine.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L4", slug: "L4-bleu", title: "BLEU — n-gram", english: "BLEU", blurb: "Đếm n-gram trùng + brevity penalty.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L5", slug: "L5-topk-accuracy", title: "Top-k accuracy", english: "Top-k acc", blurb: "Đúng nếu nhãn nằm trong top-k dự đoán.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L6", slug: "L6-calibration", title: "Calibration (độ tin cậy)", english: "Calibration", blurb: "So xác suất dự đoán với tần suất thực tế.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L7", slug: "L7-flops", title: "FLOPs — đếm phép tính một lớp", english: "FLOPs", blurb: "Đếm nhân–cộng của matmul / conv.", part: "L", course: "K4", available: true, isFree: false },
  { no: "L8", slug: "L8-latency-throughput", title: "Độ trễ & thông lượng (ý tưởng)", english: "Latency", blurb: "Ước lượng thời gian chạy và throughput.", part: "L", course: "K4", available: true, isFree: false },

  // ── PHẦN M · Nâng cao / tùy chọn (K4) ───────────────────────────────────
  { no: "M1", slug: "M1-gnn-message-passing", title: "GNN — message passing một bước", english: "GNN", blurb: "Gộp tin nhắn từ các đỉnh hàng xóm.", part: "M", course: "K4", available: true, isFree: false },
  { no: "M2", slug: "M2-contrastive-infonce", title: "Contrastive learning (InfoNCE)", english: "Contrastive", blurb: "Kéo cặp dương lại, đẩy cặp âm ra.", part: "M", course: "K4", available: true, isFree: false },
  { no: "M3", slug: "M3-triplet-loss", title: "Triplet loss", english: "Triplet", blurb: "anchor – positive – negative.", part: "M", course: "K4", available: true, isFree: false },
  { no: "M4", slug: "M4-clip", title: "Multi-modal (CLIP)", english: "CLIP", blurb: "Cosine ảnh × chữ trong cùng không gian.", part: "M", course: "K4", available: true, isFree: false },
  { no: "M5", slug: "M5-knowledge-distillation", title: "Knowledge distillation", english: "Distillation", blurb: "Học từ nhãn mềm của mô hình thầy.", part: "M", course: "K4", available: true, isFree: false },

  // ── PHẦN N · Dự án tổng kết / Capstone (K4) ─────────────────────────────
  { no: "N1", slug: "N1-mlp-capstone", title: "MLP phân loại điểm 2D — đủ vòng", english: "MLP capstone", blurb: "forward → loss → backward → cập nhật, trọn một vòng.", part: "N", course: "K4", available: true, isFree: false },
  { no: "N2", slug: "N2-mini-cnn", title: "Mini-CNN nhận chữ số", english: "Mini-CNN", blurb: "conv → pool → FC → softmax.", part: "N", course: "K4", available: true, isFree: false },
  { no: "N3", slug: "N3-mini-gpt", title: "Mini-GPT: 2 token, sinh 1 token", english: "Mini-GPT", blurb: "embedding → attention → FFN → logits.", part: "N", course: "K4", available: true, isFree: false },
  { no: "N4", slug: "N4-logistic-convergence", title: "Logistic regression hội tụ", english: "LR converge", blurb: "Lặp vài vòng đến khi loss giảm rõ.", part: "N", course: "K4", available: true, isFree: false },
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
