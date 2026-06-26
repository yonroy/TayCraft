---
name: phieu-canvas
description: Dựng/đổi một phiếu "Làm toán AI" theo phong cách CANVAS TOÀN CẢNH (Tom Yeh) — A4 ngang, sơ đồ kiến trúc bên trái + bảng số bên phải, điền ô trắng, có nút 🎲 và trang đáp án. Dùng khi tạo phiếu kiến trúc/khái niệm mới, hoặc chuyển phiếu cũ sang phong cách canvas. Đây là HOUSE STYLE đã chốt cho bộ phiếu.
---

# Phiếu CANVAS TOÀN CẢNH ("Làm toán AI" — kiểu Tom Yeh)

> 📖 **Chi tiết đầy đủ + ví dụ mổ xẻ xuyên suốt:** [`ai-by-hand/CACH-TAO-PHIEU-CANVAS.md`](../../../ai-by-hand/CACH-TAO-PHIEU-CANVAS.md)
> (bám bài mẫu `01-tich-vo-huong-canvas.html`). Skill này là bản tóm tắt thao tác — khi cần đào sâu, đọc file đó.

Mục tiêu: học viên thấy **trọn cơ chế trên MỘT canvas ngang** — sơ đồ kiến trúc (trái) + toàn bộ luồng số (phải) — rồi **điền vào ô trắng**. Không "Bước 1/2/3" dọc dài như phiếu cũ.

## 0. Quy tắc bất biến (giữ từ dự án)
- **Tính được bằng tay với SỐ THẬT** — không công thức suông, không code chạy ra số.
- Mỗi phiếu **≥2 sheet**: trang ĐỀ (ô trống) + trang ĐÁP ÁN (điền đủ). Phức tạp thì thêm sheet (footer `Trang X/N`).
- **Số động qua 🎲** (`wb-random.js` / `window.WB`); bấm 🎲 mà số không đổi là sai.
- Khổ giấy: **A4 (chỉ A4)** — canvas mặc định **A4 ngang** (landscape). Không dùng A3.

## 1. Khung file
```html
<!DOCTYPE html><html lang="vi"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Làm toán AI · <Tên> — canvas (A4 ngang)</title>
<link rel="stylesheet" href="wb-canvas.css">  <!-- canvas nằm FLAT trong ai-by-hand/ → KHÔNG dùng "../" -->
<style>/* (tuỳ chọn) tinh chỉnh riêng: --cw/--ch của .m, .schema width, chiều cao .canvas */</style>
</head><body>
<div class="toolbar">
  <a href="index.html">← Mục lục</a>
  <button class="js-randomize">🎲 Đổi số</button>
  <button onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>

<section class="sheet">            <!-- TRANG ĐỀ -->
  <div class="ttl"><h1>Tên bài</h1><span class="vi">— English</span><span class="tag">điền ô trắng · …</span></div>
  <!-- (tuỳ) giàn giáo: <div class="scaf"> intro + <div class="fm">công thức</div> </div> -->
  <div class="canvas">
    <div class="schema"><svg viewBox="0 0 W H" width="100%" height="100%" aria-label="…"></svg></div>
    <div class="work"><!-- các .row chứa .blk (nhãn + .m ma trận + .fm công thức) --></div>
  </div>
  <div class="foot"><span>Làm toán AI ✍️ · Tên</span><span>Trang 1/2 · ĐỀ</span></div>
</section>

<section class="sheet key">       <!-- TRANG ĐÁP ÁN -->
  <div class="ttl"><h1>Tên bài</h1><span class="vi">— lời giải</span><span class="badge">ĐÁP ÁN</span></div>
  …canvas y hệt nhưng điền đủ + (tuỳ) <div class="rutra"> "Rút ra" </div>…
  <div class="foot"><span>…</span><span>Trang 2/2 · ĐÁP ÁN</span></div>
</section>

<script src="wb-random.js"></script>
<script>/* generate(): tính số → render ma trận (blank trên ĐỀ, đủ trên ĐÁP ÁN) → drawSchema(); WB.wire(generate); generate(); */</script>
</body></html>
```

## 2. Bố cục canvas
- **Trái `.schema`** (~54–74mm): sơ đồ KHỐI kiến trúc bằng `<svg>` (hộp + mũi tên), là "bản đồ" cho luồng số bên phải. Mũi tên **xuôi = lam** (`--accent`), **ngược/gradient = cam** (`--accent2`).
- **Phải `.work`**: các `.row` (xếp ngang, wrap) gồm `.blk` = nhãn + ma trận `.m` + công thức `.fm` ngay dưới. Luồng số bám đúng thứ tự sơ đồ.
- Ma trận: `.m.cN` (N cột) + các `.cell`. Cỡ ô chỉnh qua biến `--cw` (rộng) / `--ch` (cao) inline.
- Bố cục **bậc thang** cho phép nhân (matmul/attention): B trên · A trái · C ở giao điểm (xem mẫu 02).

## 3. Mã màu (gắn class lên `.blk` cha)
- `.in` kem = đầu vào / cho sẵn · `.w` tím = trọng số/tham số · `.hot` vàng = nổi bật (attention/softmax/chuẩn hóa) · `.out` xanh = kết quả.
- Backprop/2 chiều: `.fw` xanh (xuôi) · `.bw` cam (ngược) · `.up` cam (cập nhật).
- **Ô để học sinh điền: class `blank`** (trắng nét đứt; đè mọi màu). Ô làm mẫu: `.cell.mark` (vàng).

## 4. Hai mức "giàn giáo" (đã chốt — chọn theo bài)
- **Thuần tối giản** (Tom Yeh): chỉ sơ đồ + bảng số + 1 dòng `.hint`. Hợp bài khái niệm rõ (vd self-attention, matmul, transformer toàn hệ).
- **Lai (canvas + giàn giáo)**: thêm `.scaf` (intro + công thức), `.bandh` đặt tên từng dải bước, `.fm` ghi công thức dưới mỗi khối, `.hint`, và `.rutra` ("Rút ra") ở đáp án. Hợp bài cần dẫn dắt (vd backpropagation).

## 5. Làm cho số TÍNH TAY ĐƯỢC (mẹo đã dùng)
- Số nguyên nhỏ; tránh phép chia xấu.
- **LayerNorm/RMSNorm:** chọn **d=2** → x̂ luôn ra **±1** → cả khối ra số nguyên (xem mẫu 13).
- **√d:** chọn **d=4 → √d=2** (chia 2 sạch).
- **softmax/exp, ln, tanh, σ, √:** cho **bảng tra sẵn** (như bảng eˣ) hiển thị trên canvas; sinh số để giá trị rơi vào mốc tra được (vd bội 0.5).
- **Attention:** Q,K nhị phân {0,1} để điểm chia √d ra mốc đẹp.
- Backprop ma trận = 3 phép lặp: `∂W = δ·inᵀ` (tích ngoài) · `δ_trước = Wᵀ·δ ⊙ f′` · `W ← W − η·∂W`.

## 6. Randomize + render (mẫu JS)
```js
function fill(id, M, blank){            // M: mảng 2D; blank=true → ô trống
  var el=document.getElementById(id); if(!el) return; var s='';
  for(var i=0;i<M.length;i++) for(var j=0;j<M[i].length;j++)
    s+='<div class="cell'+(blank?' blank':'')+'">'+(blank?'':WB.fmtInt(M[i][j]))+'</div>';
  el.innerHTML=s;
}
function generate(){
  /* sinh số bằng WB.randInt/randIntNZ/pick; tính kết quả */
  /* ĐỀ: cho-sẵn fill(...,false), phần tính fill(...,true) */
  /* ĐÁP ÁN (id khác, vd k-prefix): fill(...,false) hết */
  drawSchema();
}
WB.wire(generate); generate();          // BẮT BUỘC gọi generate()/drawX() 1 lần lúc tải (kẻo hình trống)
```
- Dùng `WB.fmtInt` (số nguyên, dấu "−"), `WB.fmt2` (2 chữ số), `WB.fmtTrim`, `WB.wrap` (bọc ngoặc số âm), `WB.sumExpr` (nối "2 − 3 + 0", tránh "+ −").
- Hình **phụ thuộc số** → vẽ trong `generate()`; hình tĩnh → vẽ 1 lần. **Luôn có lời gọi vẽ khởi tạo** (bug đã gặp: quên → SVG trống lúc tải).

## 7. Kiểm tra trước khi giao (BẮT BUỘC)
1. Bấm 🎲 vài lần: số ĐỀ + ĐÁP ÁN + hình đổi khớp nhau.
2. **Đo tràn BẰNG SỐ** (mỗi `.sheet` `overflow:hidden` → tràn bị cắt âm thầm) — dùng `tools/check.mjs` (đo cả `.page` lẫn `.sheet`, thay cho tạo `_m.html` thủ công):
   ```sh
   node tools/check.mjs 01-tich-vo-huong-canvas.html --runs 5 --shot
   # tràn > 2px = ✗ · --runs 5 chạy 5 bộ số (bắt wrap xấu nhất) · --shot kèm ảnh soát
   ```
   A4 ngang: chiều cao nội dung ≤ **~165mm/sheet**; vượt thì **tách thêm sheet** (footer `X/N`), đừng nhồi.
3. **Chụp ảnh lúc mới tải** để soát mắt (hình SVG có hiện? caption không bị cắt? màu đúng?).
4. **Kiểm phép tính trên ảnh đáp án** (vài ô) — đúng số.

## 8. Đăng ký bài (khi thay/ra bài thật, không phải bản nháp `*-canvas.html`)
- `ai-by-hand/index.html`: bật thẻ `todo`→`done`/`adv done`, sửa `href`, đổi `○`→`Mở →`.
- `web/lib/lessons.ts`: đặt `slug` + `available:true` (+ `isFree` nếu cho xem thử). Web tự sync qua `web/scripts/sync-content.mjs` lúc build.
- Đồng bộ thẻ trong `web/content/ai-by-hand/index.html` chỉ là artifact (gitignored) — sửa bản gốc `ai-by-hand/` là đủ.

## 9. Mẫu tham chiếu (đọc trước khi làm)
- `ai-by-hand/01-tich-vo-huong-canvas.html` — **lai: đại số + hình học 2D**, dùng **cả 2 cơ chế số động** (`fill(id)` + `data-q`/`setAll`). *(bài mẫu của `CACH-TAO-PHIEU-CANVAS.md`)*
- `ai-by-hand/02-nhan-ma-tran-canvas.html` — bậc thang matmul (nền tảng).
- `ai-by-hand/11-self-attention-canvas.html` — thuần tối giản, softmax + bảng eˣ.
- `ai-by-hand/12-backpropagation-canvas.html` — **lai + ma trận** (xuôi lam / ngược cam, tích ngoài).
- `ai-by-hand/13-transformer-canvas.html` — **toàn hệ** (residual + 2×LayerNorm + FFN, d=2 ra số nguyên).
- Style chung: `ai-by-hand/wb-canvas.css` · engine: `ai-by-hand/wb-random.js` · quy tắc nền: `ai-by-hand/CACH-TAO-PHIEU.md`.
