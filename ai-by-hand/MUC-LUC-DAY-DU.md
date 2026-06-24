# AI by Hand ✍️ — MỤC LỤC ĐẦY ĐỦ (bản tham vọng)

> Bộ phiếu **tính tay** trọn vẹn dạy AI/Deep Learning từ con số đến mô hình sinh, theo tinh thần Prof. Tom Yeh.
> Mỗi phiếu = 1 file HTML = 2 trang (ĐỀ + ĐÁP ÁN), in A4/A3, giải bằng bút chì.
> **Nguyên tắc bất biến:** mọi thứ phải *tính được bằng tay với số thật* — không công thức suông, không code.

26 phiếu hiện có mới là **xương sống**. Bản đầy đủ dưới đây bổ sung các mảnh còn thiếu để thành một khóa học hoàn chỉnh, học **theo thứ tự** (mỗi phiếu dùng lại kết quả phiếu trước).

**Chú thích trạng thái:**
- ✅ **đã có** — kèm số phiếu hiện tại (file đang chạy).
- 🆕 **cần soạn** — phiếu mới đề xuất.
- ⭐ **ưu tiên cao** — nền tảng/được hỏi nhiều, nên làm trước.

Đánh số theo **PHẦN** (A–N) để dễ chèn phiếu mới mà không phá số cũ. Cột "tính tay" = học sinh thực sự cầm bút làm gì.

---

## PHẦN A — Toán nền tảng cho AI
*Mục tiêu: thành thạo những phép tay mà mọi bài sau lặp đi lặp lại.*

| # | Chủ đề (VI — EN) | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| A1 | Vectơ: cộng, trừ, nhân vô hướng — *Vector ops* | cộng/trừ từng ô, nhân hệ số | 🆕 ⭐ |
| A2 | Độ dài & chuẩn — *Norm (L1, L2)* | √(Σx²), Σ\|x\| | 🆕 ⭐ |
| A3 | Tích vô hướng — *Dot Product* | nhân từng cặp rồi cộng; góc cos θ | ✅ **01** |
| A4 | Cosine similarity | dot ÷ (‖a‖‖b‖) | 🆕 ⭐ |
| A5 | Phép chiếu vectơ — *Projection* | (a·b/‖b‖²)·b | 🆕 |
| A6 | Ma trận chuyển vị — *Transpose* | lật hàng↔cột | 🆕 ⭐ |
| A7 | Nhân ma trận — *Matmul* | Cᵢⱼ = hàng i · cột j | ✅ **02** |
| A8 | Ma trận × vectơ | mỗi hàng một tích vô hướng | 🆕 |
| A9 | Định thức & nghịch đảo 2×2 | ad−bc, công thức nghịch đảo | 🆕 |
| A10 | Hệ phương trình tuyến tính nhỏ | khử Gauss 2×2 | 🆕 |
| A11 | Trị riêng / vectơ riêng 2×2 — *Eigen* | giải đa thức đặc trưng | 🆕 |
| A12 | Đạo hàm một biến — *Derivatives* | quy tắc lũy thừa/hằng | 🆕 ⭐ |
| A13 | Quy tắc chuỗi — *Chain rule* | dy/dx = dy/du·du/dx (số thật) | 🆕 ⭐ |
| A14 | Gradient hàm nhiều biến | đạo hàm riêng → vectơ ∇ | 🆕 ⭐ |
| A15 | Ma trận Jacobian nhỏ | bảng đạo hàm riêng 2×2 | 🆕 |
| A16 | Xác suất, kỳ vọng, phương sai | E[X], Var(X) trên bảng nhỏ | 🆕 |
| A17 | Phân phối Bernoulli / Categorical | xác suất từng lớp cộng = 1 | 🆕 |
| A18 | exp & log (dùng bảng tra) | eˣ, ln x bằng bảng cho sẵn | 🆕 ⭐ |
| A19 | Chuẩn hóa dữ liệu: min-max & z-score | (x−min)/(max−min); (x−μ)/σ | 🆕 ⭐ |
| A20 | One-hot encoding | nhãn → vectơ 0/1 | 🆕 |

---

## PHẦN B — Học máy cổ điển (Classic ML)
*Mục tiêu: hiểu các mô hình "trước deep learning", đều giải tay được.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| B1 | Hồi quy tuyến tính 1 biến — *Linear Regression* | least squares, y=ax+b | 🆕 ⭐ |
| B2 | Hồi quy tuyến tính nhiều biến | normal equation nhỏ (XᵀX) | 🆕 |
| B3 | Hồi quy logistic 1 bước — *Logistic Regression* | sigmoid(wx+b) → loss → 1 cập nhật | 🆕 ⭐ |
| B4 | k-NN — *k láng giềng gần nhất* | tính khoảng cách, bỏ phiếu | 🆕 ⭐ |
| B5 | k-means 1 vòng | gán cụm + cập nhật tâm | 🆕 ⭐ |
| B6 | PCA 2D | hiệp phương sai → trục chính → chiếu | 🆕 |
| B7 | Naive Bayes | nhân xác suất → hậu nghiệm | 🆕 |
| B8 | Cây quyết định: Entropy & Information Gain | chọn split tốt nhất | 🆕 ⭐ |
| B9 | Cây quyết định: Gini | chỉ số Gini cho từng split | 🆕 |
| B10 | SVM: lề hình học — *Margin* | khoảng cách điểm tới siêu phẳng | 🆕 |
| B11 | Gradient Boosting ý tưởng | khớp phần dư 1 bước | 🆕 |

---

## PHẦN C — Nơ-ron & mạng truyền thẳng
*Mục tiêu: từ 1 nơ-ron đến mạng nhiều lớp, lan truyền xuôi.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| C1 | Lớp tuyến tính y = Wx + b | W trộn đầu vào, b dịch | ✅ **03** |
| C2 | Sigmoid chi tiết + đạo hàm | σ(z), σ'(z)=σ(1−σ) | 🆕 ⭐ |
| C3 | Tanh + đạo hàm | tanh(z), 1−tanh² | 🆕 |
| C4 | Họ ReLU: ReLU / LeakyReLU / GELU | max(0,z); xấp xỉ GELU | ✅ **04** (mở rộng) |
| C5 | Một nơ-ron | z=w·x+b → a=f(z) | ✅ **05** |
| C6 | Một lớp nơ-ron song song | h = f(Wx+b) | ✅ **06** |
| C7 | MLP 2 lớp — lan truyền xuôi | 2→2→1 forward | ✅ **07** |
| C8 | Mạng sâu vs rộng | so kiến trúc cùng tham số | ✅ **08** |
| C9 | Đếm tham số mạng | Σ(W+b) từng lớp | 🆕 |
| C10 | Softmax đầu ra (+ nhiệt độ τ) | eˣ/Σ; ảnh hưởng τ | ✅ **09** (mở rộng τ) |

---

## PHẦN D — Huấn luyện: mất mát, gradient, tối ưu
*Mục tiêu: hiểu vì sao và làm sao mạng học được.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| D1 | MSE / MAE | trung bình bình phương/tuyệt đối sai số | 🆕 ⭐ |
| D2 | Binary Cross-Entropy | −[y ln p + (1−y) ln(1−p)] | 🆕 ⭐ |
| D3 | Cross-Entropy đa lớp | −ln p(đúng); g=p−y | ✅ **17** |
| D4 | KL Divergence | Σ p ln(p/q) | 🆕 |
| D5 | Gradient descent 1 chiều | θ ← θ − η∇ trên parabol | ✅ **10** |
| D6 | Gradient descent 2 biến | đi theo ∇ trên đường đồng mức | 🆕 |
| D7 | Backprop 1 nơ-ron | quy tắc chuỗi ra mọi gradient | ✅ **12** |
| D8 | Backprop qua MLP nhiều lớp | δ lan ngược từng lớp | 🆕 ⭐ |
| D9 | Backprop qua Softmax+CE | rút gọn g = p − y | 🆕 |
| D10 | SGD vanilla (1 mini-batch) | trung bình gradient batch → cập nhật | 🆕 ⭐ |
| D11 | Momentum | v ← βv + ∇; θ ← θ − ηv | 🆕 ⭐ |
| D12 | RMSProp | chia theo √(trung bình ∇²) | 🆕 |
| D13 | Adam | m, v, hiệu chỉnh bias, bước thích nghi | ✅ **23** |
| D14 | AdamW (weight decay) | tách phạt trọng số khỏi gradient | 🆕 |

---

## PHẦN E — Kỹ thuật huấn luyện & chuẩn hóa
*Mục tiêu: làm mạng học ổn định, không overfit.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| E1 | Khởi tạo trọng số (Xavier / He) | tính phương sai khởi tạo theo fan-in | 🆕 ⭐ |
| E2 | Vanishing / Exploding gradient | nhân chuỗi đạo hàm < 1 hoặc > 1 | 🆕 ⭐ |
| E3 | L2 regularization / weight decay | thêm λ‖w‖² vào loss & gradient | 🆕 ⭐ |
| E4 | L1 regularization | λΣ\|w\|, đẩy về 0 | 🆕 |
| E5 | Dropout (mask + scale) | nhân mask 0/1, chia (1−p) | 🆕 ⭐ |
| E6 | BatchNorm — chuẩn hóa theo batch | μ, σ trên batch + γ, β | 🆕 ⭐ |
| E7 | LayerNorm / RMSNorm — theo hàng | (x−μ)/σ ·γ+β; RMSNorm bỏ μ | ✅ **20** |
| E8 | Learning rate schedule (step / cosine) | tính η tại bước t | 🆕 |
| E9 | Gradient clipping | cắt theo chuẩn ‖g‖ | 🆕 |
| E10 | Mini-batch vs full-batch | trung bình gradient theo cỡ batch | 🆕 |
| E11 | Early stopping | đọc đường train/val, chọn điểm dừng | 🆕 |

---

## PHẦN F — Thị giác máy tính (CNN)
*Mục tiêu: ảnh là ma trận số; tích chập trượt cửa sổ.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| F1 | Tích chập 1 bộ lọc | trượt kernel 3×3, nhân–cộng từng ô | ✅ **16** |
| F2 | Kích thước đầu ra (stride, padding) | (W−K+2P)/S + 1 | 🆕 ⭐ |
| F3 | Conv nhiều kênh (RGB) | cộng tích chập trên 3 kênh | 🆕 |
| F4 | Nhiều bộ lọc → nhiều feature map | mỗi filter một bản đồ | 🆕 |
| F5 | Max / Average Pooling | lấy max/trung bình mỗi cửa sổ | 🆕 ⭐ |
| F6 | Receptive field | vùng ảnh ảnh hưởng 1 ô sâu | 🆕 |
| F7 | Conv 1×1 | trộn kênh theo từng điểm | 🆕 |
| F8 | Transposed conv (upsampling) | trải ô ra lưới lớn hơn | 🆕 |
| F9 | Kết nối tắt (Residual / skip) | y = F(x) + x | 🆕 ⭐ |
| F10 | Đếm tham số một lớp conv | K·K·Cᵢₙ·Cₒᵤₜ + bias | 🆕 |

---

## PHẦN G — Dữ liệu chuỗi (RNN / LSTM)
*Mục tiêu: xử lý chuỗi, mang "ký ức" qua thời gian.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| G1 | Embedding tra bảng + vị trí | token→vectơ, cộng PE sin/cos | ✅ **19** |
| G2 | RNN 1 bước | hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b) | ✅ **21** |
| G3 | RNN trải nhiều bước (BPTT ý tưởng) | chạy 3 bước, thấy gradient nhân chuỗi | 🆕 |
| G4 | LSTM 1 ô | cổng quên/vào/ra + ô nhớ c | ✅ **22** |
| G5 | GRU 1 ô | cổng cập nhật/đặt lại (gọn hơn LSTM) | 🆕 |
| G6 | Bi-directional RNN | gộp 2 chiều xuôi/ngược | 🆕 |
| G7 | Seq2seq encoder→decoder | nén chuỗi → vectơ → giải | 🆕 |
| G8 | Giải mã: Greedy vs Beam search | chọn token theo xác suất, giữ top-b | 🆕 ⭐ |
| G9 | Teacher forcing | dùng nhãn thật làm đầu vào bước kế | 🆕 |

---

## PHẦN H — Attention & Transformer
*Mục tiêu: trái tim của LLM hiện đại.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| H1 | Scaled dot-product attention | QKᵀ/√d → softmax → ·V (chi tiết) | 🆕 |
| H2 | Self-Attention | gói gọn Q,K,V 3 token | ✅ **11** |
| H3 | Masked / Causal (GPT) | đặt −∞ tam giác trên | ✅ **14** |
| H4 | Multi-Head Attention | nhiều đầu song song, Concat·Wᴼ | ✅ **18** |
| H5 | Cross-Attention (encoder–decoder) | Q từ decoder, K,V từ encoder | ✅ **15** |
| H6 | Khối Transformer (encoder block) | LN(X+Attn), LN(Z+FFN) | ✅ **13** |
| H7 | Positional Encoding sin/cos (bản chi tiết) | tính nhiều vị trí, nhiều tần số | 🆕 |
| H8 | RoPE — Rotary embedding | xoay 1 cặp chiều theo vị trí | 🆕 |
| H9 | Padding mask trong attention | che token đệm | 🆕 |
| H10 | KV cache — sinh token tiếp theo | tái dùng K,V cũ, chỉ tính token mới | 🆕 ⭐ |
| H11 | FFN trong Transformer | 2 lớp Linear + GELU (tính riêng) | 🆕 |

---

## PHẦN I — Mô hình ngôn ngữ lớn (LLM) chi tiết
*Mục tiêu: hiểu cơ chế thật bên trong ChatGPT/LLaMA.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| I1 | Tokenization / BPE | gộp cặp ký tự hay gặp nhất | 🆕 ⭐ |
| I2 | Logits → softmax → sampling | top-k, top-p, nhiệt độ | 🆕 ⭐ |
| I3 | Perplexity | exp(trung bình −ln p) | 🆕 |
| I4 | Mixture of Experts — router top-k | softmax router → chọn 2/3 → trộn | ✅ **26** |
| I5 | LoRA — cập nhật hạng thấp | ΔW = B·A (hạng nhỏ) | 🆕 ⭐ |
| I6 | Quantization int8 | scale + làm tròn về nguyên | 🆕 ⭐ |
| I7 | Embedding similarity / RAG retrieval | cosine giữa truy vấn & tài liệu → chọn top | 🆕 ⭐ |
| I8 | Greedy decode trọn 1 chuỗi | sinh từng token đến hết | 🆕 |
| I9 | Repetition penalty / logit bias | điều chỉnh logit trước softmax | 🆕 |
| I10 | Chat template → token hóa | gói system/user/assistant thành chuỗi token | 🆕 |

---

## PHẦN J — Mô hình sinh (Generative)
*Mục tiêu: máy tạo ra dữ liệu mới.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| J1 | Autoencoder — nén & dựng lại | x→z→x̂, lỗi dựng lại | ✅ **24** (AE) |
| J2 | VAE — reparam + KL (bản chi tiết) | z=μ+σ⊙ε; phạt KL về N(0,1) | 🆕 |
| J3 | GAN — 1 bước D và G | discriminator chấm thật/giả, generator lừa | 🆕 ⭐ |
| J4 | Diffusion: forward (thêm nhiễu) | xₜ = √ᾱ x₀ + √(1−ᾱ) ε | 🆕 |
| J5 | Diffusion: khử nhiễu 1 bước | đoán ε → x̂₀ → xₜ₋₁ | ✅ **25** |
| J6 | Noise schedule | tính β, α, ᾱ theo bước | 🆕 |
| J7 | Sampling DDPM vs DDIM | so 2 cách lấy mẫu | 🆕 |

---

## PHẦN K — Học tăng cường (Reinforcement Learning)
*Mục tiêu: học qua thử–sai & phần thưởng; nền của RLHF.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| K1 | Phần thưởng & chiết khấu | return G = Σ γᵏ rₖ | 🆕 ⭐ |
| K2 | Phương trình Bellman | V(s) ← r + γ V(s') | 🆕 ⭐ |
| K3 | Q-learning — 1 cập nhật | Q ← Q + α[r + γ max Q' − Q] | 🆕 ⭐ |
| K4 | SARSA | cập nhật theo hành động thực đi | 🆕 |
| K5 | Chính sách ε-greedy | chọn ngẫu nhiên vs tham lam | 🆕 |
| K6 | Policy Gradient (REINFORCE) | ∇ log π · G, 1 bước | 🆕 ⭐ |
| K7 | Advantage / baseline | A = G − V để giảm phương sai | 🆕 |
| K8 | PPO — ý tưởng cắt (clip) | tỉ lệ xác suất bị kẹp | 🆕 |

---

## PHẦN L — Đánh giá, đo lường & triển khai
*Mục tiêu: biết mô hình tốt cỡ nào, tốn bao nhiêu.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| L1 | Ma trận nhầm lẫn → Acc/Precision/Recall/F1 | đếm TP/FP/FN/TN | 🆕 ⭐ |
| L2 | ROC & AUC | vẽ điểm, diện tích hình thang | 🆕 |
| L3 | Cosine similarity (đo embedding) | so 2 vectơ biểu diễn | 🆕 |
| L4 | BLEU — n-gram | đếm n-gram trùng, brevity penalty | 🆕 |
| L5 | Top-k accuracy | đúng nếu nhãn nằm trong top-k | 🆕 |
| L6 | Calibration (độ tin cậy) | so xác suất dự đoán vs thực tế | 🆕 |
| L7 | FLOPs — đếm phép tính 1 lớp | nhân–cộng của matmul/conv | 🆕 ⭐ |
| L8 | Độ trễ & thông lượng (ý tưởng) | ước lượng thời gian/throughput | 🆕 |

---

## PHẦN M — Nâng cao / tùy chọn
*Mục tiêu: các nhánh hiện đại, làm khi đã vững.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| M1 | GNN — message passing 1 bước | gộp tin nhắn từ hàng xóm | 🆕 |
| M2 | Contrastive learning (InfoNCE) | kéo cặp dương, đẩy cặp âm | 🆕 |
| M3 | Triplet loss | anchor–positive–negative | 🆕 |
| M4 | Multi-modal (CLIP) | cosine ảnh×chữ trong cùng không gian | 🆕 |
| M5 | Knowledge distillation | học từ nhãn mềm của thầy | 🆕 |

---

## PHẦN N — Dự án tổng kết (Capstone)
*Mục tiêu: ghép nhiều phiếu thành một vòng huấn luyện hoàn chỉnh.*

| # | Chủ đề | Tính tay cái gì | Trạng thái |
|---|---|---|---|
| N1 | MLP phân loại điểm 2D — đủ vòng | forward → loss → backward → cập nhật | 🆕 ⭐ |
| N2 | Mini-CNN nhận chữ số 5×5 | conv→pool→FC→softmax | 🆕 |
| N3 | Mini-GPT: 2 token, sinh 1 token | embedding→attention→FFN→logits | 🆕 ⭐ |
| N4 | Logistic regression hội tụ (vài vòng) | lặp đến khi loss giảm rõ | 🆕 |

---

## Tổng kết & gợi ý thứ tự làm

- **Đã có:** 26 phiếu (đánh ✅ ở trên).
- **Đề xuất mới:** ~115 phiếu nữa → **tổng ~140 phiếu** cho "phiên bản đầy đủ nhất".
- **Lộ trình ra phiếu khuyến nghị** (cuốn chiếu, dạy được sớm):
  1. **Đợt 1 — Toán nền (A):** A1, A2, A4, A6, A12, A13, A14, A18, A19 — vá lỗ hổng nền tảng.
  2. **Đợt 2 — Huấn luyện lõi (D, E):** D1, D2, D8, D10, D11, E1, E3, E5, E6 — bộ "trái tim" của training.
  3. **Đợt 3 — ML cổ điển (B):** B1, B3, B4, B5, B8 — học viên thấy bức tranh rộng.
  4. **Đợt 4 — CNN & chuỗi (F, G):** F2, F5, F9, G5, G8.
  5. **Đợt 5 — LLM & sinh (H, I, J):** H1, H10, I1, I2, I5, I6, I7, J3.
  6. **Đợt 6 — RL & đánh giá (K, L):** K1, K2, K3, K6, L1, L7.
  7. **Đợt 7 — Capstone (N):** N1, N3.

> Mỗi phiếu mới tuân thủ `CACH-TAO-PHIEU.md` (số động qua `data-q`+`WB.setAll`, 2 trang ĐỀ/ĐÁP ÁN, ≥1 sơ đồ SVG, đo tràn lề bằng số), bật thẻ trong `index.html`, thêm vào `web/lib/lessons.ts`.
> Khi mở rộng vượt 26, nên cân nhắc **lại cách đánh số** trong `index.html`/`lessons.ts` (đổi sang mã PHẦN A1…N4, hoặc giữ số chạy 27, 28, …) — quyết định trước khi ra đợt mới.

---

## Chia khóa & cách bán (với ~140 phiếu)

**Nguyên tắc:**
1. Không bán lẻ 14 phần (quá vụn → giá thấp, khách rối, khó support).
2. Không subscription — đây là tài liệu học theo nhịp riêng → **mua một lần + trọn đời**.
3. Gom 14 phần thành **4 khóa** theo cung học, mỗi khóa là một cột mốc rõ ràng.

### Chia 14 phần → 4 khóa

| Khóa | Gồm phần | ~Phiếu | Vai trò |
|---|---|---|---|
| **K1 · Nền tảng AI** | A Toán nền + B ML cổ điển + C Nơ-ron/MLP | ~41 | Cửa vào / mồi — Phần A để FREE |
| **K2 · Huấn luyện & Kiến trúc** | D Tối ưu + E Chuẩn hóa + F CNN + G RNN/LSTM | ~44 | Lõi deep learning |
| **K3 · Transformer & LLM** ⭐ | H Attention + I LLM + J Mô hình sinh | ~28 | Premium — cầu cao nhất |
| **K4 · Chuyên sâu & Dự án** | K RL + L Đánh giá + M Nâng cao + N Capstone | ~25 | Track nâng cao / hoàn thiện |

> Mỗi khóa tự đứng được nhưng nối tiếp nhau. Người chỉ quan tâm LLM mua thẳng K3; người mới đi từ K1.

### Bộ gói đã chốt (4 sản phẩm) + neo "trọn bộ"

> **Quyết định (2026-06-24):** gộp **K1+K2 = "Cơ bản"**; **K3** đứng riêng (Transformer/LLM); **K4 = "Nâng cao"**; cộng **Trọn bộ (All-Access)**.

| Sản phẩm (product id) | Gồm khóa | Giá đề xuất | Ghi chú |
|---|---|---|---|
| **FREE** | Phần A | 0đ | Tạm mở 01–03; mở **toàn Phần A** khi có → lead magnet |
| **Cơ bản** `co-ban` | K1 + K2 | ~249k | Nền tảng → huấn luyện/kiến trúc |
| **Transformer & LLM** `k3` ⭐ | K3 | ~299k | Cầu cao nhất |
| **Nâng cao** `nang-cao` | K4 | ~199k | RL / đánh giá / capstone |
| **ALL-ACCESS trọn bộ** `all-access` ⭐ | tất cả | **599k** (early-bird **349k**) | Trọn đời + nhận mọi phiếu mới — **sản phẩm chính** |

**Neo giá:** mua lẻ 3 gói ≈ 750k → All-Access 599k → đa số chọn trọn bộ.
**Hiện tại (Pha 1):** chỉ bán **All-Access ở giá `COURSE_PRICE_VND` (199k)**; gói lẻ đã dựng cấu trúc nhưng `active=false`, bật khi mỗi khóa đủ ~20 phiếu.

#### Gán 26 phiếu hiện có → khóa (đã set `course` trong `web/lib/lessons.ts`)
- **K1:** 01–10 · **K2:** 12,16,17,20,21,22,23 · **K3:** 11,13,14,15,18,19,24,25,26 · **K4:** (chưa có phiếu)

### Cảnh báo khi triển khai
- **Tôn trọng tiên quyết:** K3/K4 cần nền K1/K2 → mỗi trang khóa ghi "cần học trước…", đẩy All-Access làm mặc định.
- **Grandfather người mua sớm:** khách 199k hiện tại được nâng thẳng vào All-Access trọn đời (uy tín + câu chuyện marketing).
- **Ra & bán theo đợt:** mỗi đợt phiếu mới = lý do tăng giá + email khách cũ.
- **Bắt đầu đơn giản:** ngắn hạn chỉ cần **FREE Phần A + All-Access (early-bird 349k → 599k)**; tách 4 khóa lẻ khi mỗi track đã đủ dày (~20+ phiếu).

### Tác động kỹ thuật (web/) — ✅ Pha 1 đã làm
- ✅ `web/lib/lessons.ts`: thêm `course: K1–K4` cho mỗi bài + helper `courseOf()`.
- ✅ `web/lib/products.ts` (mới): `COURSES` + `PRODUCTS` (4 gói) + `packagesGrantingCourse()`/`productById()`. Chỉ `all-access` `active=true`.
- ✅ DB: `enrollments.package` + `orders.product` (mặc định `all-access`); `enrollments` unique đổi sang **(user, package)**. Migration tay: `web/drizzle/packages.sql` (chạy Supabase SQL editor — DB local bị chặn). Backfill enrollment cũ → `all-access` (grandfather khách 199k).
- ✅ `hasAccess(userId, slug?)` package-aware (auth.ts); learn route + trang `[slug]` truyền slug; `markOrderPaid` cấp quyền theo `order.product`; `/api/orders` nhận `product` (mặc định all-access).
- 🟡 **Pha 2 (sau):** trang `/pricing` 4 gói + bật `active` gói lẻ + nâng giá All-Access (349→599k); landing từng khóa (ghi tiên quyết); `FREE_SLUGS` mở rộng Phần A.
