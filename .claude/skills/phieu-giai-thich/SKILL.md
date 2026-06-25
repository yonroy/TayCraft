---
name: phieu-giai-thich
description: Dựng/đổi một phiếu "AI by Hand" theo phong cách GIẢNG GIẢI — A4 dọc, dạy kỹ từng bước cho người tự học. Mỗi bước có "Vì sao", mở bằng khối "Trực giác/ví von", đóng bằng "Tự kiểm tra" + "Rút ra". Dùng khi muốn phiếu giải thích NHIỀU cho người học (đối lập với /phieu-canvas tối giản). Bám CACH-TAO-PHIEU.md.
---

# Phiếu GIẢNG GIẢI ("AI by Hand" — dạy kỹ cho người tự học)

Mục tiêu: người **tự học không có thầy** vẫn hiểu *vì sao*, không chỉ *làm gì*. Mỗi phiếu là một bài giảng nhỏ: trực giác → công thức → tính tay từng bước (kèm lý do) → tự kiểm tra → rút ra. **Đối lập với `/phieu-canvas`** (tối giản Tom Yeh, chỉ điền ô). Nền tảng kỹ thuật giống nhau, chỉ khác **mật độ giải thích**.

## 0. Khi nào dùng skill này (vs /phieu-canvas)
- **Dùng `/phieu-giai-thich`** cho: bài nền tảng/khái niệm mới (Toán nền A, ML cổ điển B, nơ-ron C), người học lần đầu gặp ý tưởng, cần dẫn dắt.
- **Dùng `/phieu-canvas`** cho: bài kiến trúc nhìn-trọn-hệ (attention, transformer, backprop) khi người học đã vững, cần "bản đồ một canvas".
- Hai skill **chung** `wb.css` + `wb-random.js` + quy tắc `data-q`. Khác: skill này **A4 dọc**, nhiều khối chữ; canvas **A4 ngang**, ít chữ.

## 1. Quy tắc bất biến (giữ từ dự án)
- **Tính được bằng tay với SỐ THẬT** — không công thức suông, không code chạy ra số.
- Mỗi phiếu **≥2 trang**: ĐỀ (ô trống) + ĐÁP ÁN (điền đủ). Giàu giải thích → **dễ tràn** → cứ tách thêm trang A4 (footer `Trang X/N`), **đừng nhồi, đừng quay A3**.
- **Số động qua 🎲** (`window.WB`); bấm 🎲 mà số không đổi là sai. Worked-example ("Hàng 1: …") phải sinh bằng `data-q`, **không hardcode**.
- Khổ giấy: **A4 dọc** (mặc định wb.css). Không A3, không landscape (đó là việc của canvas).

## 2. Năm lớp giải thích (xương sống của skill này)
Xếp theo thứ tự trên trang ĐỀ. Lớp ➍ ➎ là cái khiến phiếu này "giải thích nhiều hơn" bản classic cũ.

➊ **intro — "Vì sao quan trọng"** (`.intro` + `.formula`): 2–3 câu nối khái niệm tới bức tranh AI lớn, rồi khung công thức gốc. (Đã có sẵn, bắt buộc.)

➋ **"Trực giác / ví von"** (`.intuition`) — *MỚI*: ngay sau intro, **trước khi vào số**. Một phép so sánh đời thường giúp "thấy" ý tưởng.
```html
<div class="intuition">
  <span class="lead">💡 Trực giác</span>
  Tích vô hướng giống <b>chấm điểm độ hợp nhau</b>: hai vectơ "cùng hướng" cho điểm dương lớn,
  "ngược hướng" cho điểm âm, "chẳng liên quan" (vuông góc) cho 0.
</div>
```

➌ **Bước 0 — dữ liệu cho sẵn** (`.step` + `.mtx/.cell.given`): ma trận/vectơ/logit đầu vào.

➍ **Các bước tính, mỗi bước kèm "Vì sao"** (`.step` → `.calc` có `.blk` → `.why`) — *trọng tâm MỚI*: mỗi bước tính gắn **một dòng `.why`** giải nghĩa *bản chất* (không chỉ thao tác).
```html
<div class="step">
  <div class="step-h"><div class="b">1</div><h2>Nhân từng cặp</h2><span class="tag">3 tích</span></div>
  <div class="calc">a₁·b₁ = <span data-q="a1w">2</span> × <span data-q="b1w">1</span> = <span class="blk"></span> …</div>
  <div class="why"><b>Vì sao:</b> mỗi tích đo "đóng góp cùng chiều" của một cặp thành phần;
    ta cộng chúng vì muốn <i>tổng</i> mức hợp nhau trên mọi chiều.</div>
  <div class="hint"><b>Mẹo:</b> giữ đúng thứ tự — phần tử i của a nhân phần tử i của b.</div>
</div>
```
> `.why` (lam, "vì sao bản chất") khác `.hint` (cam, "mẹo thao tác") khác `.note` (xám, "ý nghĩa/ứng dụng"). Mỗi bước **ít nhất một `.why`**; thêm `.hint`/`.note` khi hữu ích.

➎ **"Tự kiểm tra"** (`.quiz`) — *MỚI*: cuối trang ĐỀ, 1–2 câu hỏi **khái niệm** (không phải tính lại). Đáp án để trống trên ĐỀ, **lộ ở trang ĐÁP ÁN** bằng `.qa`.
```html
<!-- TRANG ĐỀ -->
<div class="quiz">
  <div class="qh">✎ Tự kiểm tra</div>
  <ol>
    <li>Tích vô hướng ra một <b>con số</b> hay một <b>vectơ</b>? → <span class="blk" style="min-width:90px"></span></li>
    <li>Nếu a·b = 0 thì góc giữa a và b bằng bao nhiêu? → <span class="blk" style="min-width:60px"></span></li>
  </ol>
</div>
<!-- TRANG ĐÁP ÁN (cùng câu, lộ đáp án) -->
<div class="quiz">
  <div class="qh">✎ Tự kiểm tra — đáp án</div>
  <ol>
    <li>… → <span class="qa">một con số (vô hướng)</span></li>
    <li>… → <span class="qa">90° (vuông góc)</span></li>
  </ol>
</div>
```

➏ **"Rút ra"** ở cuối trang ĐÁP ÁN (`.intro` viền cam): 2–3 câu chốt + **nối sang bài kế** (`style="border-left-color:var(--accent2)"`, `<b style="color:var(--accent2)">`).

## 3. Khung file (A4 dọc, classic chrome)
```html
<!DOCTYPE html><html lang="vi"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI by Hand · Bài NN — Tên (A4 in được)</title>
<link rel="stylesheet" href="wb.css">
</head><body>
<div class="toolbar">
  <a href="index.html">← Mục lục</a>
  <button class="js-randomize">🎲 Đổi số</button>
  <button onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>

<section class="page">                <!-- TRANG 1 — ĐỀ -->
  <div class="wb-head">…brand… / …meta…</div>
  <div class="wb-title"><span class="no">Bài NN</span><h1>Tên <small>— English</small></h1></div>
  <div class="namebar"><span>Họ tên: <u></u></span><span>Ngày: <u></u></span><span>Thời gian: ~X phút</span></div>
  <div class="intro"><b>Vì sao quan trọng.</b> … <div class="formula">…công thức…</div></div>
  <div class="intuition"><span class="lead">💡 Trực giác</span> …ví von…</div>
  <div class="step">…Bước 0: cho sẵn…</div>
  <div class="grid2">
    <div class="step">…Bước 1: .calc + .why…</div>
    <div class="step">…Bước 2: .calc + .why…</div>
  </div>
  …(thêm bước / hình SVG)…
  <div class="quiz">…Tự kiểm tra (ô trống)…</div>
  <div class="wb-foot"><span>AI by Hand ✍️ — Bài NN · Tên</span><span>Trang 1/2 · ĐỀ</span></div>
</section>

<section class="page key">           <!-- TRANG 2 — ĐÁP ÁN -->
  <div class="wb-head">…<span class="key-badge">ĐÁP ÁN</span></div>
  <div class="wb-title"><span class="no">Bài NN</span><h1>Tên <small>— lời giải</small></h1></div>
  …các bước lặp lại với .calc.ans / .cell.ans + data-q…
  <div class="quiz">…Tự kiểm tra — đáp án (.qa)…</div>
  <div class="intro" style="border-left-color:var(--accent2)"><b style="color:var(--accent2)">Rút ra.</b> …nối sang bài kế…</div>
  <div class="wb-foot"><span>…</span><span>Trang 2/2 · ĐÁP ÁN</span></div>
</section>

<script src="wb-random.js"></script>
<script>
function generate(){ /* tính số → WB.setAll({…}) → vẽ hình động nếu có */ }
WB.wire(generate);
/* + lời gọi vẽ hình khởi tạo nếu có figure */
</script>
</body></html>
```

## 4. Cơ chế "Đổi số" (`data-q`) — như CACH-TAO-PHIEU §3
- Số biến thiên bọc `<span data-q="khóa">`; `generate()` tính rồi `WB.setAll({khóa: value})` cập nhật MỌI thẻ cùng khóa.
- ĐỀ: ô trống `<span class="blk"></span>`. ĐÁP ÁN: `<span class="blk" data-q="…">` hoặc `<span class="cell ans" data-q="…">`.
- Thừa số âm → dùng bản `…w` (đã `WB.wrap`) để hiện `(−3)` đúng chỗ nhân.
- Hàm `WB`: `randInt/randIntNZ/pick/pickDistinct`, `fmtInt/fmt2/fmtTrim` (dấu "−"), `wrap`, `sumExpr/opTerm`, `setAll`, `wire`.

## 5. Class & màu (in được)
| Khối | Class | Màu / vai trò |
|---|---|---|
| Vì sao quan trọng | `.intro` | viền **lam** trái, nền nhạt |
| Trực giác / ví von | **`.intuition`** | viền **tím** `#7c5cff` (thành phần thứ ba) + `.lead` "💡 Trực giác" |
| Vì sao (mỗi bước) | **`.why`** | viền **lam** trái, `<b>Vì sao:</b>` — *bản chất* |
| Mẹo thao tác | `.hint` | **cam** mono — *làm sao cho đúng* |
| Ý nghĩa / ứng dụng | `.note` | **xám** — *liên hệ thực tế* |
| Tự kiểm tra | **`.quiz`** | viền **cam nét đứt**; `.qh` tiêu đề; `.qa` lộ đáp án ở trang ĐÁP ÁN |
| Rút ra | `.intro` + viền cam inline | chốt + nối bài sau |

Quy ước màu số học giữ nguyên: lam `--accent` (vào/xuôi/Q), cam `--accent2` (trọng số/đáp án/ngược/K), tím `#7c5cff` (V/thành phần 3). Ô given nền `--given`; ô đáp án nền `#fff5e9`.
> `.intuition`, `.why`, `.quiz` là **class additive** đã thêm cuối `wb.css` — không sửa class cũ.

## 6. Làm số TÍNH TAY ĐƯỢC
- Số nguyên nhỏ; tránh chia xấu. Số âm cho qua `wrap`.
- `√`, `exp`, `ln`, `tanh`, `σ`: chọn số rơi vào mốc đẹp, hoặc **cho bảng tra sẵn** trên phiếu.
- Chuẩn hóa (z-score/LayerNorm): chọn **d=2** để x̂ ra **±1**. `√d`: chọn **d=4 → 2**.
- Mỗi bước phải **kiểm được**: đáp án `data-q` tính trong `generate()`, không gõ tay.

## 7. Hình minh họa (SVG) — như CACH-TAO-PHIEU §6
- Mỗi phiếu nên có **≥1 sơ đồ** đúng bản chất (`<svg class="fig" viewBox="0 0 W H">`).
- Hình **động** (phụ thuộc số) → vẽ trong `generate()`. Hình **tĩnh** → gọi 1 lần sau `WB.wire`. **Luôn có lời gọi vẽ khởi tạo** (kẻo SVG trống lúc tải).
- Caption SVG dễ bị cắt → chữ ngắn, `style="font-size:9px"` (presentation bị `.fig text{}` ghi đè).

## 8. Kiểm tra trước khi giao (BẮT BUỘC — phiếu này dài nên dễ tràn)

**➊ Budget chiều cao TRƯỚC khi viết** (ngăn tràn từ gốc, đừng "chất đống rồi đo"):
- A4 dọc khả dụng ≈ **260mm/trang**. Cộng nhẩm: intro ~22mm · intuition ~16mm · mỗi `.step` ~26mm · figure ~55mm · quiz ~22mm.
- **Cân hai trang** — đừng dồn hết lên ĐỀ để ĐÁP ÁN trống. Mặc định: **sơ đồ + (quiz-đáp-án) sang trang ĐÁP ÁN**; trang ĐỀ = intro + trực giác + cho sẵn + các bước + quiz-câu-hỏi.
- Vượt budget → **tách thêm trang A4** (footer `Trang X/N`), KHÔNG nhồi/thu nhỏ/quay A3.
- Khung từ `tools/new.mjs` đã cân sẵn theo các quy tắc này.

**➋ Tạo khung bằng tool** (đỡ gõ tay chrome, đã cân 2 trang):
```bash
node ai-by-hand/tools/new.mjs A2 A2-do-dai-chuan "Độ dài & chuẩn" "Norm (L1, L2)" 12
```

**➌ Đo tràn bằng tool** (lưới an toàn cuối — `.page` có `overflow:hidden` nên tràn bị cắt âm thầm):
```bash
node ai-by-hand/tools/check.mjs A2-do-dai-chuan.html --runs 5 --shot
```
Tool tự chèn script đo, chạy Edge headless ×N (mỗi lần `generate()` số random khác → bắt wrap xấu nhất), in tràn từng trang, thoát code 1 nếu >2px. Còn tràn → quay lại ➊ (cân/tách trang), hoặc siết `<style>` nội bộ (`.step{margin-top}`, `.calc{line-height}`). Xem `ai-by-hand/tools/README.md`.

**➍ Soát mắt + đúng số:** mở ảnh `--shot` — SVG hiện? caption không cắt? `.quiz`/`.intuition` không chồng footer? Kiểm vài phép trên ảnh ĐÁP ÁN; `.qa` khớp khái niệm.

**➎ Không lệ thuộc số:** bấm 🎲 vài lần — số ĐỀ + lời giải + hình đổi **khớp**; cấu trúc đúng với mọi bộ số.

## 9. Đăng ký bài (khi ra bài thật)
- `ai-by-hand/index.html`: bật thẻ `todo`→`done` (hoặc `adv done`), sửa `href`, đổi `○`→`Mở →`. Footer ghi đúng `Bài NN` + `Trang X/N`.
- `web/lib/lessons.ts`: đặt `slug` + `available:true` (+ `isFree` nếu cho xem thử). Bài K1 mặc định free (FREE_COURSES). Web tự sync qua `web/scripts/sync-content.mjs` lúc build — **không sửa `web/content/`**.

## 10. Mẫu tham chiếu (đọc trước khi làm)
- `ai-by-hand/01-tich-vo-huong.html` — classic chuẩn (intro, step, .calc/.blk, .hint/.note, hình vectơ, Rút ra). **Bản nâng cấp giải-thích = bài này + ➋ `.intuition` + ➍ `.why`/bước + ➎ `.quiz`.**
- Style chung: `ai-by-hand/wb.css` (class mới ở cuối file) · engine: `ai-by-hand/wb-random.js` · quy tắc nền: `ai-by-hand/CACH-TAO-PHIEU.md`.
