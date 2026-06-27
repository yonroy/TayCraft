# SPEC phiếu — "Nhân ma trận & Biến đổi 2D" (GIẢNG GIẢI, A4 dọc)

> File đặc tả để **dựng phiếu sau này**. Không phải phiếu thật. Khi làm: theo skill `/phieu-giai-thich`
> + bám `wb.css` (chỉ thêm class additive) + engine `window.WB` trong `wb-random.js`.
> Mẫu tham chiếu gần nhất: `ai-by-hand/K1/01-tich-vo-huong.html` (classic chuẩn) và
> `ai-by-hand/K1/02-nhan-ma-tran.html` (đã có Bước 0–3; spec này **bổ sung Bước ④ hình học quay 90°**).

---

## 0. Mục tiêu & định vị

- **Chủ đề:** Phép nhân ma trận (Matrix Multiplication) → đỉnh điểm là **ma trận như một phép biến đổi 2D** (quay/co giãn).
- **Phong cách:** GIẢNG GIẢI (A4 dọc, nhiều chữ, dạy *vì sao*). KHÔNG phải canvas tối giản.
- **Đối tượng:** người tự học lần đầu hiểu "nhân ma trận = nhiều tích vô hướng" và "ma trận = hàm biến đổi vectơ".
- **Khác bản 02 hiện có:** thay Bước ④ "Vì sao AI cần nó" (chỉ chữ) bằng **Bước ④ hình học**: nhân vectơ với
  ma trận quay R = [[0,−1],[1,0]] → vectơ xoay 90°, vẽ SVG trước/sau, có ô điền.
- **Số liệu mẫu cố định trong spec** (khi dựng có thể cho 🎲 sinh ngẫu nhiên — xem §7):
  - A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]] (cùng 2×2 để C₁₁ minh họa gọn).
  - Ma trận–vectơ luyện thêm: M = [[1, 2], [0, 3]], v = [4, 1].
  - Biến đổi: R = [[0, −1], [1, 0]] (quay 90° ngược chiều kim đồng hồ), v_cũ = [2, 1].

---

## 1. Quy tắc bất biến (giữ từ dự án)

- ✅ Tính được **bằng tay với SỐ THẬT** — không công thức suông.
- ✅ **≥ 2 trang**: Trang 1 = ĐỀ (ô trống) · Trang 2 = ĐÁP ÁN (điền đủ). Dài → tách thêm trang A4, **không A3, không nhồi**.
- ✅ **Số động qua 🎲** (`data-q` + `WB.setAll`); bấm 🎲 mà số không đổi là sai. KHÔNG hardcode số vào worked-example.
- ✅ Màu in được: lam `--accent` (vào/xuôi/Q), cam `--accent2` (trọng số/đáp án/ngược/K), tím `#7c5cff` (thành phần 3/V).
- ✅ Số âm hiển thị dấu "−" (qua `WB.fmtInt`/`fmtTrim`), thừa số âm bọc `WB.wrap` để ra `(−3)`.

---

## 2. Khối Tiêu đề (intro + formula) — `.intro`

- **Tiêu đề lam:** *Vì sao quan trọng.*
- **Nội dung (2–3 câu):** Nhân ma trận là **động cơ tính toán của AI**: mọi lớp tuyến tính, mọi tầng CNN,
  mọi phép biến đổi hình học 3D đều quy về nó. Quan trọng hơn con số: **một ma trận chính là một "hàm" biến đổi
  không gian** — nhân vào một vectơ thì xoay / co giãn / phản chiếu nó.
- **`.formula` (font mono đẹp):**
  ```
  C = A · B    với    C_ij = Σ_k A_ik · B_kj
  ```
  (dùng `<sub>`/`<sup>` cho i,j,k; ký hiệu Σ to `font-size:18px`)

---

## 3. Trực giác / ví von — `.intuition` (viền tím, mở đầu `💡 Trực giác`)

> Một ma trận giống **một cỗ máy ép**: đưa một vectơ vào, nó nhả ra vectơ đã bị "nắn" theo một quy luật cố định.
> Mỗi **cột** của ma trận cho biết **trục x và trục y bị đưa đi đâu** sau khi biến đổi. Nhân ma trận với ma trận
> là **ghép hai cỗ máy nối tiếp** — làm phép này rồi tới phép kia.

---

## 4. Các bước (trang ĐỀ) — `.step`, mỗi bước có `.why`

### Bước ⓪ — Hai ma trận cho sẵn  · pill `2×2 · 2×2`
- Hai hộp ma trận `.mtx c2` với `.cell.given`:
  - A (2×2): `a11..a22` = 1,2,3,4
  - dấu `.op` ×
  - B (2×2): `b11..b22` = 5,6,7,8
- `.note`: Cột của A = 2 = hàng của B → **khớp**. Kết quả C = (hàng A)×(cột B) = **2×2**.

### Bước ① — Tính một ô: C₁₁ = hàng 1 (A) · cột 1 (B)  · pill `2 tích`
- `.calc` (ô trống):
  ```
  C₁₁ = (a11 × b11) + (a12 × b21) = ____ + ____ = ____
  ```
  với số: (1×5) + (2×7) = 5 + 14 = 19.
- `.why` (**Vì sao:**): mỗi ô của C là **một tích vô hướng** giữa một hàng của A và một cột của B — đúng phép
  ở Bài 01, chỉ lặp lại có tổ chức. Nắm một ô là nắm cả phép.
- `.hint` (**Mẹo — quy tắc "Hàng × Cột":**): luôn lấy **hàng của ma trận trái** nhân **cột của ma trận phải**;
  B phải có **số hàng = số cột của A** thì mới nhân được.

### Bước ② — Điền nốt & gom vào ma trận C  · pill `1 ma trận`
- `.calc` ô trống cho 3 ô còn lại (để người học tự làm sau khi đã xem mẫu C₁₁):
  ```
  C₁₂ = (a11×b12)+(a12×b22) = ____    (1×6 + 2×8 = 22)
  C₂₁ = (a21×b11)+(a22×b21) = ____    (3×5 + 4×7 = 43)
  C₂₂ = (a21×b12)+(a22×b22) = ____    (3×6 + 4×8 = 50)
  ```
- Hộp `.mtx c2` rỗng (4 `.cell.blank.tall`) để điền C = [[__,__],[__,__]].
- `.why`: thứ tự ô (i, j) = **hàng i, cột j**; đặt đúng chỗ thì C giữ đúng "hình dạng" phép biến đổi.

### Bước ③ — Luyện thêm: Ma trận × Vectơ  · pill `tự điền`
- `.calc` ô trống:
  ```
  [[1, 2],      [[4],      [[ ____ ],
   [0, 3]]  ·    [1]]   =   [ ____ ]]
  ```
  Kết quả: hàng 1 = 1·4 + 2·1 = 6; hàng 2 = 0·4 + 3·1 = 3 → [[6],[3]].
- `.note`: Nhân ma trận với **một vectơ** = **biến đổi vectơ đó**. Đây chính là một lớp tuyến tính `y = W·x`
  (Bài 03) khi chưa cộng bias.

### Bước ④ — Góc nhìn hình học: ma trận = biến đổi 2D  · pill `2D · quay 90°`
- **Bố cục `.figrow`**: trái = SVG lưới tọa độ; phải = `.calc` + `.why`/`.note`.
- **SVG (trái):** hệ trục 2D, vẽ:
  - vectơ **v_cũ = (2, 1)** màu lam (mũi tên).
  - vectơ **v_mới** sau khi nhân R, màu cam (mũi tên), kèm **cung quay 90°** nối hai mũi tên.
  - nhãn ngắn `v` (lam) / `v'` (cam), `style="font-size:9px"`.
- **`.calc` (phải, ô trống):**
  ```
  R = [[0, −1], [1, 0]]   (ma trận quay 90° ngược chiều kim đồng hồ)
  v_mới = R · v_cũ
  x' = 0·2 + (−1)·1 = ____        (= −1)
  y' = 1·2 +  0·1   = ____        (= 2)
  v_mới = ( ____ , ____ )          (= (−1, 2))
  ```
- **`.why` (Vì sao):** mỗi **cột của R** nói "trục cũ đi về đâu": cột 1 (0,1) = trục x → đi lên; cột 2 (−1,0) =
  trục y → quay sang trái. Vì thế **toàn bộ mặt phẳng xoay 90°**. Ma trận không "chứa số", nó **chứa một phép biến đổi**.
- **`.hint` (Tự tay kiểm):** đo góc giữa hai mũi tên bằng thước đo độ → phải ≈ **90°**.

---

## 5. Tự kiểm tra — `.quiz` (cuối trang ĐỀ, ô trống; lộ đáp án trang ĐÁP ÁN qua `.qa`)

1. Nhân ma trận có **giao hoán** không? A·B có luôn bằng B·A? → ____ *(đáp án: KHÔNG — nói chung A·B ≠ B·A)*
2. Muốn nhân A (m×k) với B (p×n) thì điều kiện kích thước là gì? → ____ *(đáp án: k = p; kết quả m×n)*
3. Mỗi **cột** của ma trận biến đổi cho biết điều gì? → ____ *(đáp án: trục tọa độ tương ứng bị đưa tới đâu)*

---

## 6. Rút ra (cuối trang ĐÁP ÁN) — `.intro` viền cam

> **Rút ra.** Nhân ma trận làm **hai việc cùng lúc**: (1) cơ học — mỗi ô là một tích vô hướng (Bài 01), gom hàng
> loạt phép cộng-nhân lại nên GPU chạy cực nhanh; (2) ý nghĩa — **một ma trận là một phép biến đổi không gian**
> (quay, co giãn, phản chiếu). Hai góc nhìn này theo ta suốt deep learning. **Bài tiếp theo (03):** thêm trọng số
> W và bias b để biến phép nhân này thành **một lớp tuyến tính y = W·x + b** thực thụ.

---

## 7. Số động & khóa `data-q` (khi dựng HTML)

- **Bước 0–2 (A·B):** sinh A, B là 2×2 số nguyên nhỏ `WB.randInt(-3,4)` (hoặc `1..5` nếu muốn dương cho dễ).
  Khóa: `a11,a12,a21,a22`, `b11,b12,b21,b22`; tích từng ô `sum11,sum12,sum21,sum22` (qua `WB.sumExpr`);
  kết quả `C11,C12,C21,C22` (qua `WB.fmtInt`). Bản `…w` (WB.wrap) cho thừa số âm khi hiển thị phép nhân.
- **Bước 3 (M·v):** giữ M, v cố định hoặc sinh nhẹ; khóa `m11..m22`, `v1,v2`, kết quả `mv1,mv2`.
- **Bước 4 (R·v):** R cố định = [[0,−1],[1,0]] (đừng random R — phải đúng "quay 90°"); chỉ random **v_cũ**
  trong góc phần tư 1 (x,y ∈ 1..3) để mũi tên đẹp. Khóa `vx,vy`, kết quả `rx,ry` với rx = −vy, ry = vx.
  → Hình SVG vẽ lại trong `generate()` theo (vx,vy) và (rx,ry).
- **Quy tắc:** mọi số ở worked-example và đáp án đều qua `WB.setAll`; **không gõ tay**. ĐỀ dùng `.blk`/`.cell.blank`,
  ĐÁP ÁN dùng `.blk data-q=…` / `.cell.ans data-q=…`.

---

## 8. SVG biến đổi 2D (Bước 4) — ghi chú vẽ

- `viewBox` ~ `0 0 160 150`, gốc O ở góc dưới-trái, `unit ≈ 26px`. Vẽ lưới + 2 trục có mũi tên (như fig của bài 01).
- v_cũ: line lam từ O tới (vx,vy), `marker-end` mũi tên lam.
- v_mới: line cam từ O tới (rx,ry), `marker-end` mũi tên cam. Lưu ý rx có thể âm → trục x cần kéo dài về trái:
  cho lưới chạy cả x âm (vd −2..3) để chứa v_mới.
- Cung quay: `polyline` nội suy cung tròn bán kính ~22 từ góc của v_cũ tới góc của v_mới (90°), màu xám.
- Nhãn `v` (lam) cạnh mũi tên v_cũ, `v'` (cam) cạnh v_mới; `style="font-size:9px"` (kẻo bị `.fig text{}` đè).
- Hình **động** → vẽ trong `generate()`; **luôn gọi vẽ khởi tạo** một lần sau `WB.wire(generate)` kẻo SVG trống lúc tải.

---

## 9. Budget chiều cao (cân 2 trang TRƯỚC khi viết)

A4 dọc ≈ 260mm/trang. Ước lượng:
- intro ~22mm · intuition ~16mm · Bước 0 ~26mm · Bước 1 ~24mm · Bước 2 ~30mm (có hộp C) · quiz ~24mm
  → **Trang 1 (ĐỀ)** đặt: intro + trực giác + Bước 0 + Bước 1 + Bước 2 + quiz (câu hỏi). Vừa khít.
- **Trang 2 (ĐÁP ÁN)** đặt: lời giải Bước 1–2 + Bước 3 (M·v) + **Bước 4 hình học (SVG + R·v)** + quiz-đáp-án + Rút ra.
  → Dồn SVG sang trang ĐÁP ÁN để trang ĐỀ không tràn; nếu vẫn chật, **tách thêm trang A4** (footer `Trang X/3`).
- Đừng dồn hết lên ĐỀ để ĐÁP ÁN trống; cân hai trang.

---

## 10. Checklist trước khi giao (BẮT BUỘC)

- [ ] Dựng khung bằng tool: `node ai-by-hand/tools/new.mjs K1 02b-nhan-ma-tran-bien-doi "Nhân ma trận & Biến đổi 2D" "Matrix Multiplication" 15` (chỉnh tham số theo nhu cầu).
- [ ] Đủ **2 trang** ĐỀ/ĐÁP ÁN; footer đúng `Bài NN` + `Trang X/N · ĐỀ` / `ĐÁP ÁN`.
- [ ] Mọi số qua `data-q` + `WB.setAll`; **bấm 🎲 nhiều lần** → số ĐỀ + lời giải + SVG đổi **khớp**; R giữ nguyên [[0,−1],[1,0]].
- [ ] SVG Bước 4 hiện đúng: v_cũ lam, v_mới cam vuông góc, cung 90°, nhãn không bị cắt.
- [ ] `.qa` khớp khái niệm (3 câu quiz).
- [ ] **Đo tràn bằng số:** `node ai-by-hand/tools/check.mjs K1/02b-...html --runs 5 --shot` → tràn ≤ 2px mỗi trang. Còn tràn → cân/tách trang, đừng thu nhỏ/A3.
- [ ] Soát mắt ảnh `--shot`: SVG hiện, caption không cắt, quiz/intuition không chồng footer; kiểm vài phép trên ảnh ĐÁP ÁN.

## 11. Đăng ký (CHỈ khi quyết định ra bài thật)

- `ai-by-hand/index.html`: bật thẻ `todo`→`done`, sửa `href`, đổi `○`→`Mở →`.
- `web/lib/lessons.ts`: đặt `slug` + `available:true` (K1 mặc định free).
- KHÔNG sửa `web/content/` (artifact tự sync lúc build).

---

### Phụ lục — bảng số mẫu (để đối chiếu nhanh khi dựng)

| Phép | Đầu vào | Kết quả |
|---|---|---|
| C = A·B | A=[[1,2],[3,4]], B=[[5,6],[7,8]] | C=[[19,22],[43,50]] |
| C₁₁ | (1×5)+(2×7) | 5+14 = **19** |
| M·v | M=[[1,2],[0,3]], v=[4,1] | [[6],[3]] |
| R·v (quay 90°) | R=[[0,−1],[1,0]], v=[2,1] | v'=(−1, 2) |
