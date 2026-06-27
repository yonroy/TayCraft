# Trạng thái dựng phiếu HTML theo spec

> Theo dõi các **phiếu HTML** đã được dựng/chỉnh sửa để bám theo spec trong `_specs/`.
> Spec = đặc tả (`.md`); phiếu = file `.html` thật. Toàn bộ spec K1–K4 đã có (138/138); phần dưới chỉ liệt kê **phiếu HTML đã thực thi**.
> Cập nhật cuối: 2026-06-27 (#6) — **K2 Phần E HOÀN TẤT (giảng-giải, 10/10):** thêm E2, E4, E5, E6, E8, E9, E10, E11 (E1, E3 đã có). Đo tràn 0px ×5, de-key sạch, soát ảnh ✅, ghi đè canvas cùng slug. **→ K2 đã giảng-giải trọn Phần D + E (20 phiếu).** NEXT: F (9 CNN), G (6 RNN/Seq).
> 2026-06-27 (#4) — **chuyển trọn loạt A còn lại + C2/C3/C9 từ canvas → GIẢNG GIẢI** (16 phiếu): A6, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19 + C2, C3, C9. Tất cả đo tràn 0px ×5, de-key sạch, soát ảnh ✅. **→ Trọn K1 (A+B+C) nay là GIẢNG GIẢI** (trừ numbered 01–09 vốn đã dọc).

---

## Đã dựng theo spec (12 phiếu — đều ở `ai-by-hand/K1/`)

| Phiếu | Spec | Kiểu thay đổi | Đo tràn | Soát ảnh |
|---|---|---|---|---|
| `A20-one-hot-giaithich.html` | `A20-one-hot.md` | 🆕 file mới (bản GIẢNG GIẢI song song bản canvas cũ) | ✅ 0px ×5 runs | ✅ |
| `A5-phep-chieu.html` | `A5-phep-chieu.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 4 vẽ bóng — hình trống) | ✅ 0px ×5 runs | ✅ |
| `B1-hoi-quy-tuyen-tinh.html` | `B1-hoi-quy-tuyen-tinh.md` | ✏️ thay bản CANVAS | ✅ 0px ×5 runs | ✅ |
| `B2-hoi-quy-da-bien.html` | `B2-hoi-quy-da-bien.md` | ✏️ thay bản CANVAS | ✅ 0px ×5 runs | ⏳ |
| `B3-hoi-quy-logistic.html` | `B3-hoi-quy-logistic.md` | ✏️ thay bản CANVAS | ✅ 0px ×5 runs | ⏳ |
| `B4-knn.html` | `B4-knn.md` | ✏️ thay bản CANVAS | ✅ 0px ×5 runs | ⏳ |
| `B5-kmeans.html` | `B5-kmeans.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 3 hội tụ + bước 4 hình trống) | ✅ 0px ×5 runs | ✅ |
| `B6-pca.html` | `B6-pca.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 4 hình trục chính trống) | ✅ 0px ×5 runs | ⏳ |
| `B7-naive-bayes.html` | `B7-naive-bayes.md` | ✏️ thay bản CANVAS · **3 trang** (đề tách 2 trang: thêm bước 4–5) | ✅ 0px ×5 runs | ✅ |
| `B8-cay-quyet-dinh-entropy.html` | `B8-cay-quyet-dinh-entropy.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 4 cây trống) | ✅ 0px ×5 runs | ✅ |
| `B9-cay-quyet-dinh-gini.html` | `B9-cay-quyet-dinh-gini.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 4 cây trống) | ✅ 0px ×5 runs | ⏳ |
| `B10-svm-margin.html` | `B10-svm-margin.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 5 hình đường+lề trống) | ✅ 0px ×5 runs | ✅ |
| `B11-gradient-boosting.html` | `B11-gradient-boosting.md` | ✏️ thay bản CANVAS · **3 trang** (đề thêm bước 4 r₂ + bước 5 hình trống) | ✅ 0px ×5 runs | ⏳ |

### Đợt 4 (2026-06-27 #4) — chuyển A còn lại + C2/C3/C9 (16 phiếu, đều `ai-by-hand/K1/`)

| Phiếu | Spec | Kiểu thay đổi | Đo tràn | Soát ảnh |
|---|---|---|---|---|
| `A6-ma-tran-chuyen-vi.html` | `A6-…` | ✏️ thay CANVAS · SVG hàng→cột | ✅ 0px ×5 | ✅ |
| `A8-ma-tran-nhan-vecto.html` | `A8-…` | ✏️ thay CANVAS · SVG matvec màu theo hàng | ✅ 0px ×5 | ✅ |
| `A9-dinh-thuc-nghich-dao.html` | `A9-…` | ✏️ thay CANVAS · SVG hình bình hành = det | ✅ 0px ×5 | ✅ |
| `A10-he-phuong-trinh.html` | `A10-…` | ✏️ thay CANVAS · SVG giao 2 đường | ✅ 0px ×5 | ✅ |
| `A11-tri-rieng.html` | `A11-…` | ✏️ thay CANVAS · SVG v & A·v cùng đường | ✅ 0px ×5 | ✅ |
| `A12-dao-ham-mot-bien.html` | `A12-…` | ✏️ thay CANVAS · SVG parabol + tiếp tuyến | ✅ 0px ×5 | ✅ |
| `A13-quy-tac-chuoi.html` | `A13-…` | ✏️ thay CANVAS · SVG dây chuyền bánh răng | ✅ 0px ×5 | ✅ |
| `A14-gradient-nhieu-bien.html` | `A14-…` | ✏️ thay CANVAS · SVG đường đồng mức + −∇ | ✅ 0px ×5 | ✅ |
| `A15-jacobian.html` | `A15-…` | ✏️ thay CANVAS · SVG J: vuông→bình hành | ✅ 0px ×5 | ✅ |
| `A16-xac-suat-ky-vong.html` | `A16-…` | ✏️ thay CANVAS · SVG cột p + vạch μ | ✅ 0px ×5 | ✅ |
| `A17-bernoulli-categorical.html` | `A17-…` | ✏️ thay CANVAS · SVG dự đoán vs one-hot | ✅ 0px ×5 | ✅ |
| `A18-exp-log.html` | `A18-…` | ✏️ thay CANVAS · bảng tra cố định + SVG eˣ/ln | ✅ 0px ×5 | ✅ |
| `A19-chuan-hoa-du-lieu.html` | `A19-…` | ✏️ thay CANVAS · SVG 3 thước (gốc/min-max/z) | ✅ 0px ×5 | ✅ |
| `C2-sigmoid.html` | `C2-…` | ✏️ thay CANVAS · bảng σ + SVG chữ S + tiếp tuyến | ✅ 0px ×5 | ✅ |
| `C3-tanh.html` | `C3-…` | ✏️ thay CANVAS · bảng tanh + SVG tanh vs σ | ✅ 0px ×5 | ✅ |
| `C9-dem-tham-so.html` | `C9-…` | ✏️ thay CANVAS · SVG sơ đồ mạng 3 lớp | ✅ 0px ×5 | ✅ |

### Đợt 5 (2026-06-27 #5) — K2 Phần D HOÀN TẤT (loss & tối ưu, 10/10 phiếu)

| Phiếu | Spec | SVG đặc trưng | Đo tràn | Soát ảnh |
|---|---|---|---|---|
| `K2/D1-mse-mae.html` | `D1-…` | (sai số)² vs |sai số| | ✅ 0px | ✅ |
| `K2/D2-binary-cross-entropy.html` | `D2-…` | bảng ln + −ln p | ✅ 0px | ✅ |
| `K2/D4-kl-divergence.html` | `D4-…` | bảng ln-tỉ-số + cột P vs Q | ✅ 0px | ✅ |
| `K2/D6-gradient-descent-2-bien.html` | `D6-…` | đường đồng mức + quỹ đạo về đáy | ✅ 0px | ✅ |
| `K2/D8-backprop-mlp.html` | `D8-…` | sơ đồ 2→2→1, δ chảy ngược (nơ-ron tắt) | ✅ 0px | ✅ |
| `K2/D9-backprop-softmax-ce.html` | `D9-…` | cột p / y / p−y (bar âm) | ✅ 0px | ✅ |
| `K2/D10-sgd.html` | `D10-…` | quỹ đạo SGD răng cưa vs full-batch | ✅ 0px | ✅ |
| `K2/D11-momentum.html` | `D11-…` | thung lũng: SGD vs momentum | ✅ 0px | ✅ |
| `K2/D12-rmsprop.html` | `D12-…` | bước co dần khi √s tăng | ✅ 0px | ✅ |
| `K2/D14-adamw.html` | `D14-…` | sơ đồ m,v → Δ + nhánh decay riêng | ✅ 0px | ✅ |

### Đợt 6 (2026-06-27 #6) — K2 Phần E HOÀN TẤT (10/10 phiếu giảng-giải)

| Phiếu | SVG đặc trưng | Đo tràn | Soát ảnh |
|---|---|---|---|
| `K2/E1-khoi-tao-trong-so.html` | phương sai theo độ sâu (ổn định/teo/nổ) | ✅ 0px | ✅ |
| `K2/E2-vanishing-exploding.html` | rᴸ theo độ sâu: teo/ổn định/nổ (3 đường) | ✅ 0px ×5 | ✅ |
| `K2/E3-l2-regularization.html` | cột w trước/sau (co về 0) | ✅ 0px | ✅ |
| `K2/E4-l1-regularization.html` | vùng phạt L1 (thoi) vs L2 (tròn) → w=0 | ✅ 0px ×5 | ✅ |
| `K2/E5-dropout.html` | mạng train (tắt nơ-ron) vs suy luận (đầy đủ) | ✅ 0px ×5 | ✅ |
| `K2/E6-batchnorm.html` | 3 phân phối: gốc lệch → x̂ quanh 0 → co/dịch | ✅ 0px ×5 | ✅ |
| `K2/E8-learning-rate-schedule.html` | η(t): step bậc thang vs cosine trượt êm | ✅ 0px ×5 | ✅ |
| `K2/E9-gradient-clipping.html` | vectơ g cắt về vòng tròn bán kính c (giữ hướng) | ✅ 0px ×5 | ✅ |
| `K2/E10-mini-batch.html` | 3 quỹ đạo về đáy: mượt → răng cưa | ✅ 0px ×5 | ✅ |
| `K2/E11-early-stopping.html` | train ↓ mãi & val chữ U + điểm dừng | ✅ 0px ×5 | ✅ |

> Ghi đè bản canvas cùng slug → KHÔNG đụng `lessons.ts`/`index.html`. E10 có guard random để full ≠ mini ≠ single (giữ thông điệp "nhiễu").
> **→ KHÓA K2 đã GIẢNG-GIẢI trọn Phần D (10) + E (10).** 🟡 NEXT: F (9 CNN), G (6 RNN/Seq).
**Lưu ý số học:** loss/optimizer có log/√ → dùng **2–3 chữ số thập phân**, cộng/trừ từ số ĐÃ làm tròn (D4/D10) & **bọc ngoặc số âm** (WB.wrap) để hiển thị khớp.

**Tóm tắt:** trọn **loạt B (B1–B11)** + A20 đã dựng GIẢNG GIẢI & đo tràn 0px. **B5–B11 (trừ B1–B4) nay 3 trang**: trang đề tách 2 để chứa bước hình/kết luận trước chỉ có ở đáp án (xem nhật ký 2026-06-27 #2). Soát ảnh đủ B5,B7,B8,B10; còn B2,B3,B4,B6,B9,B11 nên liếc ảnh `--shot` khi tiện.
**Lưu ý kỹ thuật:** số cho-sẵn vô hướng inline dùng class `.gv` (mới thêm vào `wb.css`), KHÔNG dùng `.cell given` inline (xem MISTAKES.md 2026-06-27).

---

## Quy ước & lưu ý

- **Phong cách:** tất cả dựng theo **GIẢNG GIẢI** (A4 dọc, `../wb.css`) — `wb-canvas.css` (A4 ngang) là bản cũ bị thay (trừ A20 giữ song song).
- **B1–B4 ghi đè bản canvas:** cùng tên file → **slug giữ nguyên**, KHÔNG sửa `lessons.ts`/`index.html`/web. Bản canvas cũ vẫn khôi phục được qua git.
- **A20:** đặt tên `-giaithich` để không ghi đè `A20-one-hot.html` (canvas) hiện có → hai bản song song.
- **Kiểm bắt buộc trước khi giao:** `node ai-by-hand/tools/check.mjs K1/<file>.html --runs 5 --shot` → tràn ≤ 2px mỗi trang.

---

## Còn lại (mới có spec, CHƯA dựng HTML)

- **Loạt B còn lại:** B5–B11 (k-means, PCA, Naive Bayes, cây entropy/Gini, SVM, gradient boosting).
- **Các series khác:** A (đã có phiếu sẵn), C, D, E, F, G (K2), H/I/J (K3), K/L/M/N (K4) — tất cả **mới có spec**, phiếu HTML hiện tại đa số là **bản CANVAS** (cần dựng lại theo GIẢNG GIẢI nếu muốn đồng bộ).

### Việc tiếp theo gợi ý
1. Đo tràn 3 phiếu B2–B4 → chốt lại (đang dở).
2. Dựng tiếp B5–B11 theo spec (từng loạt nhỏ, đo tràn mỗi phiếu).
3. Quyết định có chuyển các series khác từ canvas → giảng-giải hay không.

---

## Nhật ký
- **2026-06-26:** dựng A20 (mới) + B1–B4 (thay canvas) theo spec; A20, B1 đo tràn 0px. B2–B4 chưa đo (đổi hướng sang viết spec K3/K4).
- **2026-06-27:** sửa lệch ĐỀ↔ĐÁP ÁN ở **B7** — đề thiếu bước 4–5 (đã cho data "bạn" ở bước 0 nhưng không hỏi). Thêm bước 4 (ô trống) + bước 5 (trục trống tự vẽ) vào ĐỀ → tách thành 3 trang (2 ĐỀ + 1 ĐÁP ÁN). Đo tràn 0px ×5, soát ảnh ✅.
- **2026-06-27 #3:** chốt cứng chống lỗi B7 — (1) thêm **quy tắc A.6 "ĐỀ ⊇ ĐÁP ÁN"** + **bước checklist H.5** vào `_specs/README.md`; (2) biến script thành **tool cố định `tools/check-de-key.mjs`** (`node tools/check-de-key.mjs [file]`, exit 1 nếu lệch). Tool **bắt ngay A5 vừa dựng cũng dính lỗi** (bước 4 hình chỉ ở đáp án) → đã sửa: thêm bước 4 "vẽ bóng" (hình trống `drawProjBlank`) vào đề, A5 thành 3 trang, đo tràn 0px, de-key sạch.
- **2026-06-27 #2:** audit toàn loạt B (viết `scratchpad/check-de-key` so bước ĐỀ vs ĐÁP ÁN). Phát hiện **6 phiếu** cùng kiểu lệch: ĐÁP ÁN có bước mà ĐỀ không hỏi → **B5** (b3 hội tụ + b4 hình), **B6** (b4 hình), **B8/B9** (b4 cây), **B10** (b5 hình), **B11** (b4 r₂ + b5 hình). Đồng bộ trọn vẹn như B7: đưa các bước đó vào ĐỀ — bước tính → ô trống; bước hình → **hình-để-điền/trục-trống** (vẽ dữ liệu cho-sẵn, học sinh tự vẽ phần đáp án) qua các hàm `draw*Blank('figQ')`. Tất cả tách thành **3 trang**, đo tràn 0px ×5/file, soát ảnh B5+B10. Sau sửa, `check-de-key` không còn cảnh báo "bước thừa" (chỉ còn false-positive "số cho-sẵn dùng-1-lần" = bảng dữ liệu đọc trực tiếp). **Lưu ý:** chưa cập nhật từng spec `.md` của 6 phiếu (HTML mới là chuẩn).
