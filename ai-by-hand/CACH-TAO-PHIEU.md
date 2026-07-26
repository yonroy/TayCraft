# CÁCH TẠO PHIẾU — quy tắc chung + bộ pattern "BẢN ĐẸP" (thế hệ `wb.css`)

> ⚠️ **ĐỌC TRƯỚC — file này thuộc thế hệ nào.**
> **House style hiện hành cho phiếu MỚI là form DASHBOARD**, spec riêng ở
> **`_specs/FORM-DASHBOARD.md`** (`wb-dashboard.css`, chốt 2026-07-17). File này mô tả **thế hệ
> `wb.css`** (form GIẢNG GIẢI + bộ pattern "bản đẹp" chốt 2026-07-05).
>
> | Dùng file nào | Khi nào |
> |---|---|
> | **`_specs/FORM-DASHBOARD.md`** | dựng phiếu **MỚI** — house style (58 phiếu) |
> | **File này** | bảo trì **136 phiếu** đang chạy trên `wb.css`; ngoài ra **§1 và §3 vẫn áp cho MỌI phiếu, cả dashboard** |
>
> Đây **không phải tài liệu chết** — `wb.css` vẫn là đa số của bộ phiếu. Nhưng đừng lấy **§2** làm
> khuôn cho phiếu mới: §2 đã bị form dashboard thay một phần (`.wcell`→`.cellb`/`.slot`,
> `.done-row`→`.done`+`.win`, bỏ màu-theo-Phần). Bảng ánh xạ đầy đủ: skill `/phieu-giai-thich` §5b.

> Bản RÚT GỌN tái lập 2026-07-05 (bản dài cũ đã xóa ở `627262d`; chi tiết theo từng
> phong cách nằm trong skill: `/phieu-giai-thich` · `/phieu-hieu-ro` · `/phieu-canvas`).
> File này giữ: (1) quy tắc bất biến, (2) **bộ pattern "bản đẹp"**, (3) checklist nghiệm thu.

---

## 1. Quy tắc bất biến (mọi phiếu)

- **Tính tay với SỐ THẬT** — không công thức suông. Số nguyên nhỏ / mốc đẹp / bảng tra (eˣ, ln, σ).
- **≥2 trang** (KHÔNG có trần trên): ĐỀ (ô trống) + ĐÁP ÁN là mức tối thiểu; **số trang do NỘI DUNG quyết định, không bị giới hạn** — bài khó/nhiều công thức cứ 3–4+ trang. Footer đúng `Bài NN` + `Trang X/N · ĐỀ / ĐÁP ÁN`. Tràn hoặc chật → **tách trang**, không nhồi, **không nén** (bóp padding/SVG/ô điền), không cắt nội dung, không quay A3. Báo số trang cho user khi giao. Xem memory `never-cut-content-add-page`.
- **Số động qua 🎲**: mọi số biến thiên bọc `data-q`, `generate()` tính → `WB.setAll({...})`. Bấm 🎲 mà số không đổi là sai. Hình động phụ thuộc số → vẽ lại **trong** `generate()`.
- **Parity ĐỀ↔ĐÁP ÁN**: mọi bước/đáp số ở ĐÁP ÁN phải có ô trống/câu hỏi tương ứng ở ĐỀ. Bước đánh số `<div class="b">N</div>` ở KEY ⊆ ĐỀ (hình dùng badge icon → tool bỏ qua). **Form dashboard đánh số bằng vòng tròn `①②③` trong `<span class="t">`** — `tools/check-de-key.mjs` đọc được cả hai kiểu; đánh số kiểu khác thì cổng không thấy bước nào và **pass rỗng**.
- **Budget chiều cao TRƯỚC khi viết** (~260mm/trang A4 dọc) — ước số trang theo nội dung TỪ ĐẦU (bài dễ 2, bài khó 3–4+), đừng "chất đống rồi đo" và cũng đừng ép mọi bài vào 2 trang. Ô điền đáp chính ≥17×10mm — thà thêm trang còn hơn thu ô.
- CSS: chỉ **thêm additive**, không sửa class cũ `wb.css`. Số âm hiển thị "−" (`WB.fmtInt/fmtTrim`), thừa số âm bọc ngoặc (`WB.wrap`).

## 2. Bộ pattern "BẢN ĐẸP" (chốt 2026-07-05 — thế hệ `wb.css`)

> Phiếu **MỚI** không dùng mục này — xem `_specs/FORM-DASHBOARD.md`. Giữ để bảo trì 136 phiếu cũ.

Triết lý: **hình + ô điền to là nhân vật chính, chữ giảng là phụ.** Class đã có sẵn cuối
`wb.css` — dùng thẳng, không copy CSS vào file. **Mẫu chuẩn: `K2/D7-backpropagation-dep.html`.**

### 2.1 Ô điền to `.wcell`
Đáp án **chính** của mỗi bước viết vào ô ≥17×10mm (đủ "đất" cho bút chì). `.blk` gạch chân
chỉ còn dùng cho đáp phụ / quiz.
```html
<!-- ĐỀ -->     ... = <span class="wcell"></span>
<!-- ĐÁP ÁN --> ... = <span class="wcell ans" data-q="kq">6</span>
```
Dòng tính chứa `.wcell` nên dùng `.calc.big` (chữ 14.5px, giãn dòng 2.4).

### 2.2 Sơ đồ-để-điền (hero figure)
Trang ĐỀ có **một hình chủ đạo chiếm ≥⅓ trang**, và **ô điền nằm NGAY TRONG hình**
(rect trắng viền đậm ~60×34 unit ≈ 22×12mm, góc có ✍ mờ). Một hàm `drawX(id, showAns)`
vẽ cả 2 phiên bản: `showAns=false` (ĐỀ, ô trắng) / `true` (ĐÁP ÁN, ô cam lộ số).
Trên mũi tên ghi sẵn **đạo hàm cục bộ / phép phải nhân** để người học lần theo.
Dữ liệu cho-sẵn vẽ kiểu chip given (nền `#eaf4f6` viền `#7fb4bf`).

### 2.3 Hộp nhiệm vụ `.mission`
Trang ĐỀ **mở bằng 2–3 dòng nhiệm vụ** 🎯 (câu chuyện cụ thể + việc phải làm + phần thưởng),
KHÔNG phải đoạn "Vì sao quan trọng" dày — phần giảng đầy đủ dời sang trang ĐÁP ÁN (`.why`, Rút ra).
```html
<div class="mission">🎯 <b>Nhiệm vụ.</b> Mạng đoán a = <span class="gv" data-q="a">6</span>
nhưng đáp án đúng là… Hãy <b>lan lỗi ngược</b> rồi <b>tự tay sửa w</b>…</div>
```
Nếu được, thiết kế bước cuối là **phần thưởng thấy được** (vd: sửa w xong chạy xuôi lại → loss lao dốc).

### 2.4 Ô nháp `.scratch`
Khoảng trắng chết ≥15mm cuối trang ĐỀ → lấp bằng ô nháp lưới chấm (mời gọi viết, trang nhìn "đầy").
```html
<div class="scratch" style="height:32mm"><span class="lb">✏️ Nháp — nhân tay ở đây</span></div>
```

### 2.5 Dòng hoàn thành `.done-row`
Cuối trang ĐỀ: 2–3 ô tick mốc + **câu thưởng cảm xúc** nói rõ người học vừa làm được gì.
```html
<div class="done-row">
  <span><span class="ck"></span>Điền đủ ①②③</span>
  <span><span class="ck"></span>Sửa xong w</span>
  <span class="win">🎉 Bạn vừa chạy backprop bằng tay!</span>
</div>
```

### 2.6 Màu theo PHẦN
`<body class="part pX">` → badge bài (chỉ trang ĐỀ) + `.part-chip` + `.mission` ăn màu phần.
Chip đặt cuối `.wb-title`: `<span class="part-chip" style="margin-left:auto">PHẦN D · HUẤN LUYỆN</span>`.
Quy ước màu **số học** giữ nguyên: lam vào/xuôi/Q · cam trọng số/ngược/K/đáp án · tím V/thành-phần-3.

| Phần | Màu | Tên chip gợi ý | | Phần | Màu | Tên chip gợi ý |
|---|---|---|---|---|---|---|
| A | `#0e7490` | TOÁN NỀN | | H | `#1d4ed8` | TRANSFORMER |
| B | `#15803d` | ML CỔ ĐIỂN | | I | `#a16207` | LLM THỰC CHIẾN |
| C | `#6d28d9` | MẠNG NƠ-RON | | J | `#86198f` | MÔ HÌNH SINH |
| D | `#be185d` | HUẤN LUYỆN | | K | `#4d7c0f` | HỌC TĂNG CƯỜNG |
| E | `#b91c1c` | ỔN ĐỊNH HÓA | | L | `#0369a1` | ĐÁNH GIÁ |
| F | `#c2410c` | CNN | | M | `#713f12` | NÂNG CAO |
| G | `#0f766e` | RNN · CHUỖI | | N | `#1f2937` | CAPSTONE |

## 3. Checklist nghiệm thu (BẮT BUỘC trước khi giao)

```bash
node ai-by-hand/tools/check.mjs <file> --runs 5        # tràn 0px mọi trang, ×5 lần 🎲
node ai-by-hand/tools/check-de-key.mjs <file>          # 0 lệch bước ĐỀ↔ĐÁP ÁN
# quét console JS (check.mjs try/catch nên KHÔNG bắt được lỗi generate):
#   msedge --headless=new --enable-logging=stderr --dump-dom <file> 2>log; grep -i error log
# chụp ảnh soát mắt: SVG hiện? chữ không chồng/cắt? ô "?" ở ĐỀ luôn TRỐNG?
```
- [ ] Bấm 🎲 nhiều lần: số + hình + lời giải đổi **khớp**; cấu trúc đúng mọi bộ số (guard combo xấu).
- [ ] Pattern bản đẹp: `.wcell` cho đáp chính · hero figure có ô điền trong hình · `.mission` mở bài ·
      `.scratch` lấp trống · `.done-row` chốt · `body class="part pX"`.
- [ ] Ra bài thật: bật thẻ trong `index.html` (`todo`→`done`, href, `○`→`Mở →`) + `web/lib/lessons.ts`.

## 4. Mẫu tham chiếu

- **`K2/D7-backpropagation-dep.html`** — mẫu chuẩn bộ pattern bản đẹp (giảng-giải).
- `K3/H4-multi-head-attention-hieu-ro.html` — mẫu template hiểu-rõ (hình-để-điền + qset).
- Nền: `wb.css` (pattern ở cuối file) · `wb-random.js` (engine `window.WB`) · `tools/new.mjs --help`.
