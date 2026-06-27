# _specs/ — Đặc tả dựng phiếu (GIẢNG GIẢI)

Thư mục chứa **spec để dựng phiếu sau này**, KHÔNG phải phiếu thật. Mỗi file mô tả nội dung một phiếu theo
phong cách **GIẢNG GIẢI** (A4 dọc, dạy *vì sao*) — dùng với skill `/phieu-giai-thich`.

> Mỗi spec topic-specific chỉ ghi phần **riêng** của phiếu (intro · trực giác · các bước + "Vì sao" · tự kiểm tra ·
> rút ra · khóa `data-q` · số mẫu). Mọi **quy tắc chung** nằm ở file này — đọc một lần, áp cho mọi spec.

---

## A. Quy tắc bất biến (mọi phiếu)

1. **Tính tay bằng SỐ THẬT** — không công thức suông, không code chạy ra số.
2. **≥ 2 trang**: Trang 1 = ĐỀ (ô trống) · Trang 2 = ĐÁP ÁN (điền đủ). Dài → **tách thêm trang A4** (`Trang X/N`),
   KHÔNG A3, KHÔNG nhồi, KHÔNG thu nhỏ.
3. **Số động qua 🎲**: số biến thiên bọc `<span data-q="khóa">`; `generate()` tính rồi `WB.setAll({khóa: value})`.
   Bấm 🎲 mà số không đổi là **sai**. KHÔNG hardcode số vào worked-example.
4. **A4 dọc** mặc định (`wb.css`). Không landscape (đó là việc của `/phieu-canvas`).
5. Số âm hiển thị dấu **"−"** (qua `WB.fmtInt`/`fmtTrim`); thừa số âm bọc `WB.wrap` → `(−3)`.
6. **ĐỀ ⊇ ĐÁP ÁN (chống lỗi B7).** Mọi bước/phép tính/hình ở trang ĐÁP ÁN **phải có câu hỏi tương ứng ở trang ĐỀ**.
   KHÔNG để đáp án "giải dư" bước mà đề không hỏi. Cụ thể:
   - **Bước tính** ở đáp án → đề có bước đó với **ô trống** (`.blk`/`.cell.blank`).
   - **Bước hình** ở đáp án → đề có **"hình-để-điền"**: vẽ sẵn **dữ liệu cho-sẵn** (điểm/vectơ/cây/số đếm) trong khung
     trống, **giấu kết quả** để học sinh tự vẽ (đường, tâm, trục, cột…). Dùng cặp hàm `drawX('figK')` + `drawXBlank('figQ')`.
   - **Số cho-sẵn ở Bước 0 phải được dùng** trong một bước nào đó của đề (đừng cho dữ liệu thừa).
   Đề có thêm bước ⇒ thường **tách trang** (quy tắc 2), KHÔNG nhồi.

## B. Năm lớp giải thích (xương sống — xếp theo thứ tự trên trang ĐỀ)

1. **`.intro` "Vì sao quan trọng"** + `.formula` (công thức gốc, font mono).
2. **`.intuition`** (viền tím, mở `💡 Trực giác`) — ví von đời thường.
3. **Bước ⓪** dữ liệu cho sẵn (`.step` + `.cell.given`).
4. **Các bước tính**, mỗi bước **≥1 dòng `.why`** ("Vì sao:" — *bản chất*), thêm `.hint` (mẹo thao tác) / `.note` (ứng dụng) khi cần.
5. **`.quiz`** (cuối ĐỀ, viền cam nét đứt) — 2–3 câu **khái niệm**, đáp án để trống; lộ ở ĐÁP ÁN qua `.qa`.
6. **"Rút ra"** cuối ĐÁP ÁN (`.intro` viền cam) — chốt + nối sang bài kế.

## C. Màu in được (giữ nhất quán)

| Vai trò | Biến / màu |
|---|---|
| vào / chiều xuôi / Q | lam `--accent` `#0e7490` |
| trọng số / đáp án / chiều ngược / K | cam `--accent2` `#b45309` |
| thành phần thứ ba / V | tím `#7c5cff` |
| ô given | nền `--given` · ô đáp án nền `#fff5e9` |

Class khối: `.intro` (viền lam) · `.intuition` (viền tím) · `.why` (viền lam, "Vì sao:") · `.hint` (cam mono, mẹo) ·
`.note` (xám, ý nghĩa) · `.quiz`/`.qh`/`.qa` (tự kiểm tra) · `.step`/`.step-h`/`.b`/`.tag` · `.mtx`/`.cell`/`.calc`/`.blk`/`.fig`.
**Chỉ thêm class additive vào `wb.css`, không sửa class cũ.**

## D. Cơ chế `data-q` (engine `window.WB` trong `wb-random.js`)

- ĐỀ: ô trống `<span class="blk"></span>` / `<div class="cell blank">`. ĐÁP ÁN: `<span class="blk" data-q="k">` / `<div class="cell ans" data-q="k">`.
- Hàm hay dùng: `randInt(a,b)`, `randIntNZ(a,b)` (khác 0), `pick`, `pickDistinct`, `fmtInt`, `fmt2` (2 chữ số), `fmtTrim`,
  `wrap` (bọc ngoặc số âm), `sumExpr(arr,fmt)` (ra "2 + 4 + 6"), `opTerm`, `setAll(obj)`, `wire(generate)`.

## E. Mẹo chọn số TÍNH TAY ĐƯỢC

- Số nguyên nhỏ, tránh chia xấu. `√` → chọn số chính phương hoặc cho **≈** + bảng tra.
- Chuẩn hóa/z-score: chọn **d = 2** để x̂ ra **±1**; `√d`: chọn **d = 4 → 2**.
- `exp`, `ln`, `σ`, `tanh`: **cho bảng tra sẵn** trên phiếu (chọn số rơi đúng mốc trong bảng).
- Cosine "đẹp": cho mọi ‖·‖ = 5 (vd vectơ (3,4)) → mẫu số 25.
- Mỗi số đáp án **tính trong `generate()`**, không gõ tay.

## F. Hình SVG

- Mỗi phiếu nên có **≥1 sơ đồ** đúng bản chất (`<svg class="fig" viewBox="0 0 W H">`).
- Hình **động** (phụ thuộc số) → vẽ trong `generate()`. Hình **tĩnh** → gọi 1 lần sau `WB.wire`.
  **Luôn có lời gọi vẽ khởi tạo** kẻo SVG trống lúc tải.
- Caption SVG dễ cắt → chữ ngắn, `style="font-size:9px"` (đè `.fig text{}`).

## G. Budget chiều cao (cân 2 trang TRƯỚC khi viết)

A4 dọc ≈ **260mm/trang**. Ước lượng: intro ~22mm · intuition ~16mm · mỗi `.step` ~26mm · figure ~55mm · quiz ~22mm.
Mặc định: **sơ đồ + quiz-đáp-án sang trang ĐÁP ÁN**; trang ĐỀ = intro + trực giác + cho sẵn + các bước + quiz-câu-hỏi.
Vượt budget → tách thêm trang A4.

## H. Checklist trước khi giao (BẮT BUỘC)

1. Dựng khung: `node ai-by-hand/tools/new.mjs K1 <slug> "<Tên>" "<English>" <phút>`.
2. Đủ 2 trang ĐỀ/ĐÁP ÁN; footer đúng `Bài/Mã NN` + `Trang X/N · ĐỀ` / `ĐÁP ÁN`.
3. Mọi số qua `data-q` + `WB.setAll`; **bấm 🎲 nhiều lần** → ĐỀ + lời giải + SVG đổi **khớp**.
4. **Đo tràn:** `node ai-by-hand/tools/check.mjs <file> --runs 5 --shot` → tràn ≤ 2px/trang. Còn tràn → cân/tách trang.
5. **Soát lệch ĐỀ↔ĐÁP ÁN (quy tắc A.6):** `node ai-by-hand/tools/check-de-key.mjs <file>` → phải **0 phiếu LỆCH**
   (không bước nào ở ĐÁP ÁN mà ĐỀ thiếu). Đây là cửa chặn lỗi B7 — chạy mỗi lần dựng/sửa phiếu.
6. Soát mắt ảnh `--shot`: SVG hiện, caption không cắt, quiz/intuition không chồng footer; `.qa` khớp khái niệm; bấm 🎲 thấy số + hình đổi khớp.

## I. Đăng ký (CHỈ khi ra bài thật)

- `ai-by-hand/index.html`: bật thẻ `todo`→`done`, sửa `href`, đổi `○`→`Mở →`.
- `web/lib/lessons.ts`: `available:true` (+ `isFree` nếu cho xem thử). **KHÔNG sửa `web/content/`** (tự sync lúc build).

---

## Danh mục spec A-series (Toán nền — khóa K1)

| Mã | Spec | Chủ đề |
|---|---|---|
| A1 | `A1-vecto-cong-tru.md` | Vectơ: cộng, trừ, nhân vô hướng |
| A2 | `A2-do-dai-chuan.md` | Độ dài & chuẩn (L1, L2) |
| A4 | `A4-cosine-similarity.md` | Cosine similarity |
| A5 | `A5-phep-chieu.md` | Phép chiếu vectơ |
| A6 | `A6-ma-tran-chuyen-vi.md` | Ma trận chuyển vị |
| A8 | `A8-ma-tran-nhan-vecto.md` | Ma trận × vectơ |
| A9 | `A9-dinh-thuc-nghich-dao.md` | Định thức & nghịch đảo 2×2 |
| A10 | `A10-he-phuong-trinh.md` | Hệ phương trình tuyến tính 2×2 |
| A11 | `A11-tri-rieng.md` | Trị riêng / vectơ riêng 2×2 |
| A12 | `A12-dao-ham-mot-bien.md` | Đạo hàm một biến |
| A13 | `A13-quy-tac-chuoi.md` | Quy tắc chuỗi |
| A14 | `A14-gradient-nhieu-bien.md` | Gradient hàm nhiều biến |
| A15 | `A15-jacobian.md` | Ma trận Jacobian |
| A16 | `A16-xac-suat-ky-vong.md` | Xác suất, kỳ vọng, phương sai |
| A17 | `A17-bernoulli-categorical.md` | Bernoulli / Categorical |
| A18 | `A18-exp-log.md` | exp & log (bảng tra) |
| A19 | `A19-chuan-hoa-du-lieu.md` | Chuẩn hóa: min-max & z-score |
| A20 | `A20-one-hot.md` | One-hot encoding |

> A3, A7 không tồn tại trong lộ trình (số bị bỏ trống). Ngoài ra đã có spec riêng: `nhan-ma-tran-bien-doi-2d.md`.

## Danh mục spec K1 — ML cổ điển (Phần B) & Nơ-ron (Phần C) + numbered

| Mã | Spec | Chủ đề |
|---|---|---|
| A3 | `A3-tich-vo-huong.md` | Tích vô hướng (numbered, đã có phiếu) |
| A7 | `A7-nhan-ma-tran-bien-doi-2d.md` | Nhân ma trận & biến đổi 2D |
| C1 | `C1-lop-tuyen-tinh.md` | Lớp tuyến tính y = Wx + b |
| C4 | `C4-ham-kich-hoat.md` | Hàm kích hoạt (ReLU, …) |
| C5 | `C5-mot-no-ron.md` | Một nơ-ron |
| C6 | `C6-mot-lop-no-ron.md` | Một lớp nơ-ron |
| C7 | `C7-lop-an.md` | Lớp ẩn — MLP nhỏ |
| C8 | `C8-sau-rong.md` | Mạng sâu / rộng |
| C10 | `C10-softmax.md` | Softmax đầu ra |
| B1 | `B1-hoi-quy-tuyen-tinh.md` | Hồi quy tuyến tính 1 biến |
| B2 | `B2-hoi-quy-da-bien.md` | Hồi quy tuyến tính nhiều biến |
| B3 | `B3-hoi-quy-logistic.md` | Hồi quy logistic 1 bước |
| B4 | `B4-knn.md` | k-NN |
| B5 | `B5-kmeans.md` | k-means 1 vòng |
| B6 | `B6-pca.md` | PCA 2D |
| B7 | `B7-naive-bayes.md` | Naive Bayes |
| B8 | `B8-cay-quyet-dinh-entropy.md` | Cây quyết định: Entropy & IG |
| B9 | `B9-cay-quyet-dinh-gini.md` | Cây quyết định: Gini |
| B10 | `B10-svm-margin.md` | SVM: lề hình học |
| B11 | `B11-gradient-boosting.md` | Gradient Boosting (ý tưởng) |
| C2 | `C2-sigmoid.md` | Sigmoid + đạo hàm |
| C3 | `C3-tanh.md` | Tanh + đạo hàm |
| C9 | `C9-dem-tham-so.md` | Đếm tham số mạng |

## Danh mục spec K2 — Loss & Tối ưu (D) · Regularization (E) · CNN (F) · RNN/Seq (G) + numbered

| Mã | Spec | Chủ đề |
|---|---|---|
| D5 | `D5-gradient.md` | Gradient — một bước học |
| D7 | `D7-backpropagation.md` | Backpropagation |
| F1 | `F1-cnn-tich-chap.md` | CNN — một bộ lọc |
| D3 | `D3-cross-entropy.md` | Cross-Entropy |
| E7 | `E7-layernorm.md` | LayerNorm / RMSNorm |
| G2 | `G2-rnn-mot-buoc.md` | RNN — một bước |
| G4 | `G4-lstm-mot-o-nho.md` | LSTM — một ô nhớ |
| D13 | `D13-adam-mot-buoc.md` | Adam — một bước |
| D1 | `D1-mse-mae.md` | MSE / MAE |
| D2 | `D2-binary-cross-entropy.md` | Binary Cross-Entropy |
| D4 | `D4-kl-divergence.md` | KL Divergence |
| D6 | `D6-gradient-descent-2-bien.md` | Gradient descent 2 biến |
| D8 | `D8-backprop-mlp.md` | Backprop qua MLP |
| D9 | `D9-backprop-softmax-ce.md` | Backprop qua Softmax + CE |
| D10 | `D10-sgd.md` | SGD vanilla |
| D11 | `D11-momentum.md` | Momentum |
| D12 | `D12-rmsprop.md` | RMSProp |
| D14 | `D14-adamw.md` | AdamW |
| E1 | `E1-khoi-tao-trong-so.md` | Khởi tạo trọng số (Xavier/He) |
| E2 | `E2-vanishing-exploding.md` | Vanishing / Exploding gradient |
| E3 | `E3-l2-regularization.md` | L2 / weight decay |
| E4 | `E4-l1-regularization.md` | L1 regularization |
| E5 | `E5-dropout.md` | Dropout |
| E6 | `E6-batchnorm.md` | BatchNorm |
| E8 | `E8-learning-rate-schedule.md` | LR schedule (step/cosine) |
| E9 | `E9-gradient-clipping.md` | Gradient clipping |
| E10 | `E10-mini-batch.md` | Mini-batch vs full-batch |
| E11 | `E11-early-stopping.md` | Early stopping |
| F2 | `F2-kich-thuoc-dau-ra.md` | Kích thước đầu ra conv |
| F3 | `F3-conv-nhieu-kenh.md` | Conv nhiều kênh (RGB) |
| F4 | `F4-nhieu-bo-loc.md` | Nhiều bộ lọc |
| F5 | `F5-pooling.md` | Max / Average Pooling |
| F6 | `F6-receptive-field.md` | Receptive field |
| F7 | `F7-conv-1x1.md` | Conv 1×1 |
| F8 | `F8-transposed-conv.md` | Transposed conv |
| F9 | `F9-residual.md` | Residual / skip |
| F10 | `F10-dem-tham-so-conv.md` | Đếm tham số conv |
| G3 | `G3-bptt.md` | BPTT |
| G5 | `G5-gru.md` | GRU |
| G6 | `G6-birnn.md` | Bi-directional RNN |
| G7 | `G7-seq2seq.md` | Seq2seq |
| G8 | `G8-greedy-beam.md` | Greedy vs Beam |
| G9 | `G9-teacher-forcing.md` | Teacher forcing |

## Danh mục spec K3 — Attention/Transformer (H) · LLM (I) · Sinh (J) + numbered

| Mã | Spec | Chủ đề |
|---|---|---|
| H2 | `H2-self-attention.md` | Self-Attention |
| H6 | `H6-khoi-transformer.md` | Khối Transformer |
| H3 | `H3-khoi-gpt-mask.md` | Khối GPT — Masked Attention |
| H5 | `H5-cross-attention.md` | Cross-Attention |
| H4 | `H4-multi-head-attention.md` | Multi-Head Attention |
| G1 | `G1-embedding-vitri.md` | Embedding & Positional |
| J1 | `J1-autoencoder-vae.md` | Autoencoder / VAE |
| J5 | `J5-diffusion-khu-nhieu.md` | Diffusion — khử nhiễu |
| I4 | `I4-mixture-of-experts.md` | Mixture of Experts |
| H1 | `H1-scaled-dot-product-attention.md` | Scaled dot-product attention |
| H7 | `H7-positional-encoding.md` | Positional Encoding sin/cos |
| H8 | `H8-rope-rotary.md` | RoPE — Rotary embedding |
| H9 | `H9-padding-mask.md` | Padding mask |
| H10 | `H10-kv-cache.md` | KV cache |
| H11 | `H11-ffn.md` | FFN trong Transformer |
| I1 | `I1-bpe-tokenization.md` | Tokenization / BPE |
| I2 | `I2-sampling.md` | Logits → softmax → sampling |
| I3 | `I3-perplexity.md` | Perplexity |
| I5 | `I5-lora.md` | LoRA |
| I6 | `I6-quantization.md` | Quantization int8 |
| I7 | `I7-rag-retrieval.md` | RAG retrieval |
| I8 | `I8-greedy-decode.md` | Greedy decode |
| I9 | `I9-repetition-penalty.md` | Repetition penalty |
| I10 | `I10-chat-template.md` | Chat template |
| J2 | `J2-vae-reparam-kl.md` | VAE — reparam + KL |
| J3 | `J3-gan.md` | GAN |
| J4 | `J4-diffusion-forward.md` | Diffusion forward |
| J6 | `J6-noise-schedule.md` | Noise schedule |
| J7 | `J7-ddpm-ddim.md` | DDPM vs DDIM |

## Danh mục spec K4 — RL (K) · Đánh giá (L) · Nâng cao (M) · Capstone (N)

| Mã | Spec | Chủ đề |
|---|---|---|
| K1 | `K1-return-discount.md` | Phần thưởng & chiết khấu |
| K2 | `K2-bellman.md` | Phương trình Bellman |
| K3 | `K3-q-learning.md` | Q-learning |
| K4 | `K4-sarsa.md` | SARSA |
| K5 | `K5-epsilon-greedy.md` | ε-greedy |
| K6 | `K6-policy-gradient.md` | Policy Gradient (REINFORCE) |
| K7 | `K7-advantage.md` | Advantage / baseline |
| K8 | `K8-ppo-clip.md` | PPO — clip |
| L1 | `L1-confusion-matrix.md` | Confusion matrix → Acc/P/R/F1 |
| L2 | `L2-roc-auc.md` | ROC & AUC |
| L3 | `L3-cosine-eval.md` | Cosine eval embedding |
| L4 | `L4-bleu.md` | BLEU n-gram |
| L5 | `L5-topk-accuracy.md` | Top-k accuracy |
| L6 | `L6-calibration.md` | Calibration / ECE |
| L7 | `L7-flops.md` | FLOPs |
| L8 | `L8-latency-throughput.md` | Độ trễ & thông lượng |
| M1 | `M1-gnn-message-passing.md` | GNN message passing |
| M2 | `M2-contrastive-infonce.md` | Contrastive (InfoNCE) |
| M3 | `M3-triplet-loss.md` | Triplet loss |
| M4 | `M4-clip.md` | CLIP (multi-modal) |
| M5 | `M5-knowledge-distillation.md` | Knowledge distillation |
| N1 | `N1-mlp-capstone.md` | MLP capstone 2→2→1 |
| N2 | `N2-mini-cnn.md` | Mini-CNN |
| N3 | `N3-mini-gpt.md` | Mini-GPT |
| N4 | `N4-logistic-convergence.md` | Logistic regression hội tụ |
