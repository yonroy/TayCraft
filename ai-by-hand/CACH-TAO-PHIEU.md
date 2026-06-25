# Cách tạo một phiếu "AI by Hand" mới — How to make an example

Tài liệu này mô tả **công thức dựng một phiếu tính tay** (1 chủ đề = 1 file HTML, 2 trang A4: ĐỀ + ĐÁP ÁN) trong `d:\Math\ai-by-hand`. Copy một bài có sẵn (vd [01-tich-vo-huong.html](01-tich-vo-huong.html)) rồi sửa theo các mục dưới đây.

## 1. Triết lý
- Tinh thần **Prof. Tom Yeh — AI by Hand**: không code, người học **tự điền** ma trận, nhân–cộng từng ô, chạy softmax/backprop **bằng số thật**.
- **In A4, tính bằng bút chì.** Mỗi phiếu **ít nhất 2 trang**: ĐỀ (có ô trống) + ĐÁP ÁN. Bài phức tạp được phép **nhiều trang A4** (footer `Trang X/N`) — xem mục 7. KHÔNG dùng A3.
- **Học theo thứ tự**: mỗi bài dùng lại kết quả/khái niệm bài trước, và kết thúc bằng "Rút ra" nối sang bài kế.
- Người dùng **học qua hình** → mỗi phiếu nên có **ít nhất một sơ đồ trực quan** (xem mục 6).

## 2. File dùng chung (không sửa khi làm bài mới)
- [wb.css](wb.css) — toàn bộ style phiếu (chrome, `.step`, `.mtx/.cell`, `.calc/.blk`, `.fig`, in ấn `@page`). Chỉ thêm class **bổ sung** (additive) khi cần, không sửa class cũ.
- [wb-random.js](wb-random.js) — cơ chế **🎲 Đổi số** (`window.WB`). Các hàm hay dùng:
  - `WB.randInt(min,max)`, `WB.randIntNZ`, `WB.pick(arr)`, `WB.pickDistinct(arr,n)`
  - `WB.fmtInt(x)` (số nguyên, dấu trừ "−"), `WB.fmt2(x)` (2 chữ số thập phân), `WB.fmtTrim(x)` (bỏ số 0 dư)
  - `WB.wrap(s)` → bọc ngoặc số âm khi làm thừa số: `(−3)`
  - `WB.sumExpr([a,b,c])` → `"2 + 4 − 6"` ; `WB.opTerm(v)` → `" + 3"` / `" − 2"`
  - `WB.setAll({key: value, ...})` ghi giá trị vào **mọi** thẻ `data-q="key"`
  - `WB.wire(generate)` gắn nút 🎲 vào hàm `generate` của bài
- [index.html](index.html) — mục lục. **Nhớ bật thẻ bài** từ `todo` → `done` và sửa `href` khi ra bài mới.

## 3. Cơ chế "Đổi số" (`data-q`)
- Mọi con số biến thiên được bọc trong thẻ có thuộc tính **`data-q="<khóa>"`**, ví dụ `<span data-q="a1">2</span>`.
- Hàm `generate()` của bài tính số mới rồi gọi `WB.setAll({a1: ..., ...})`; **mọi** thẻ cùng khóa được cập nhật một lần.
- Ô để học sinh điền (ĐỀ) dùng `<span class="blk"></span>` (rỗng). Ô đáp án (trang 2) dùng `class="blk" data-q="..."` hoặc `class="cell ans" data-q="..."`.
- Thừa số có thể âm → dùng phiên bản **`...w`** đã `WB.wrap` (vd `a1w`) để hiện `(−3)` đúng chỗ nhân/lũy thừa.

## 4. Khung một trang (bộ chrome chuẩn)
```html
<div class="toolbar">
  <a href="index.html">← Mục lục</a>
  <button class="js-randomize">🎲 Đổi số</button>
  <button onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>

<!-- TRANG 1 — ĐỀ -->
<section class="page">
  <div class="wb-head">…brand… / …meta…</div>
  <div class="wb-title"><span class="no">Bài NN</span><h1>Tên <small>— English</small></h1></div>
  <div class="namebar">Họ tên / Ngày / Thời gian ~X phút</div>

  <div class="intro"> <b>Vì sao quan trọng.</b> …  <div class="formula">…công thức…</div> </div>

  <div class="step">  <!-- Bước 0: dữ liệu cho sẵn -->
    <div class="step-h"><div class="b">0</div><h2>…</h2><span class="tag">…</span></div>
    …ma trận/vectơ .mtx .cell.given…
  </div>

  <div class="grid2">  <!-- 2–4 bước tính, xếp 2 cột -->
    <div class="step">…Bước 1 (.calc với .blk)…</div>
    <div class="step">…Bước 2…</div>
  </div>

  <!-- (tuỳ chọn) panel hình — xem mục 6 -->

  <div class="wb-foot"><span>…</span><span>Trang 1/2 · ĐỀ</span></div>
</section>

<!-- TRANG 2 — ĐÁP ÁN -->
<section class="page key">
  <div class="wb-head">…<span class="key-badge">ĐÁP ÁN</span></div>
  …các bước lặp lại với .calc.ans / .cell.ans + data-q…
  <div class="intro" style="border-left-color:var(--accent2)"><b>Rút ra.</b> …nối sang bài sau…</div>
  <div class="wb-foot"><span>…</span><span>Trang 2/2 · ĐÁP ÁN</span></div>
</section>

<script src="wb-random.js"></script>
<script>
function generate(){ /* tính số, rồi */ WB.setAll({ … }); /* + vẽ hình động nếu có */ }
WB.wire(generate);
/* + lời gọi vẽ hình ban đầu nếu có figure */
</script>
```

> **Lưu ý:** đa số bài `<link rel="stylesheet" href="wb.css">`. Riêng [11-self-attention.html](11-self-attention.html) nhúng `<style>` nội bộ → nếu dùng class của wb.css (vd `.fig`) thì phải tự thêm/định nghĩa, hoặc style trực tiếp trên phần tử.

## 5. Cấu trúc nội dung (bắt buộc)
1. **Một file = một ý tưởng.** Tên file `NN-ten-khong-dau.html`.
2. **intro**: "Vì sao quan trọng" + khung **.formula** (công thức gốc).
3. **Bước 0**: dữ liệu cho sẵn (ma trận/vectơ/logit…).
4. **Các bước tính**: mỗi bước một mẩu `.calc` có ô trống `.blk`; kèm `.hint` (mẹo) / `.note` (diễn giải).
5. **Phần ỨNG DỤNG / ý nghĩa thực tế** + **"Rút ra"** ở cuối trang đáp án, nối sang bài kế tiếp.
6. Phân biệt rạch ròi định lý / thực nghiệm / giả thuyết nếu có khẳng định.

> **Muốn phiếu GIẢNG GIẢI (dạy kỹ, giải thích nhiều cho người tự học)?** Dùng skill **`/phieu-giai-thich`**.
> Nó thêm 3 lớp dạy lên khung classic này, qua **class additive** ở cuối [wb.css](wb.css):
> - **`.intuition`** (tím) — khối "💡 Trực giác / ví von" đặt ngay sau `.intro`, trước khi vào số.
> - **`.why`** (lam) — dòng "Vì sao:" dưới mỗi bước `.calc`, giải *bản chất* (khác `.hint` cam = mẹo, `.note` xám = ý nghĩa).
> - **`.quiz`** (cam nét đứt) — "✎ Tự kiểm tra" cuối trang ĐỀ; đáp án `.qa` chỉ lộ ở trang ĐÁP ÁN.
> Ngược lại, bài kiến trúc nhìn-trọn-hệ (attention/transformer) dùng **`/phieu-canvas`** (tối giản, A4 ngang).

## 6. Thêm hình minh họa (SVG)
Mỗi phiếu nên có một sơ đồ đúng bản chất. Mẫu tham chiếu: [01-tich-vo-huong.html](01-tich-vo-huong.html) (hàm `drawFig`).

**Quy trình:**
1. Đặt khung rỗng trong HTML:
   ```html
   <div class="step">
     <div class="step-h"><div class="b" style="background:var(--accent)">▦</div><h2>Sơ đồ: …</h2><span class="tag">…</span></div>
     <svg id="figX" class="fig" viewBox="0 0 W H" width="…mm" height="…mm" aria-label="…"></svg>
   </div>
   ```
2. Viết hàm `drawX()` trong `<script>` dựng chuỗi SVG rồi `svg.innerHTML = s;`. Dùng `<defs><marker>` cho mũi tên.
3. **Hình động** (phụ thuộc số ngẫu nhiên): gọi `drawX(...)` **bên trong** `generate()` → vẽ lại mỗi lần 🎲 (vd biểu đồ softmax [09](09-softmax.html)).
   **Hình tĩnh** (chỉ minh họa cơ chế): gọi `drawX()` **một lần** sau `WB.wire(generate)` (vd sơ đồ matmul [02](02-nhan-ma-tran.html), đồ thị lớp [03](03-lop-tuyen-tinh.html), backprop [12](12-backpropagation.html), heatmap attention [11](11-self-attention.html)).
4. **Bẫy thường gặp**: dòng **caption** căn giữa dễ **bị cắt hai đầu** nếu rộng hơn `viewBox`. → rút ngắn chữ + giảm `font-size` (8px), ước lượng `số_ký_tự × ~4px < viewBox_width`. `font-size` đặt bằng **`style="font-size:9px"`** (thuộc tính presentation bị `.fig text{}` của CSS ghi đè).

### Quy ước màu (in được, nhất quán)
- **Lam `--accent` `#0e7490`** = đầu vào / cho sẵn / chiều **xuôi** / nhánh Q.
- **Cam `--accent2` `#b45309`** = trọng số / đáp án / chiều **ngược** / nhánh K.
- **Tím `#7c5cff`** = thành phần thứ ba (vd lớp/giá trị V, lớp softmax).
- Ô "given" nền lam nhạt `--given #eaf4f6`; ô đáp án nền cam nhạt `#fff5e9`.

## 7. Khổ giấy — CHỈ DÙNG A4 (đồng bộ, in được ở mọi máy)
**Quy tắc cứng (từ 2026-06-24):** mọi phiếu dùng **A4** — KHÔNG dùng A3 nữa. Lý do: máy in nhà/văn phòng gần như chỉ A4; bài A3 buộc người mua thu nhỏ → chữ tí xíu, không viết tay nổi. Với sản phẩm bán để in, "in 100% ở nhà" là tiêu chí sống còn.

Kích thước giấy đã **tham số hóa** trong [wb.css](wb.css) (`--paper-w/-h`, `--pad-*`). Có 2 hướng:

1. **A4 dọc (mặc định):** không cần làm gì, đây là `@page{size:A4 portrait}` của wb.css.
2. **A4 ngang (landscape)** — khi "nhân vật chính" của phiếu nằm **ngang** (ma trận lớn QKᵀ, pipeline nhiều khối, sơ đồ kiến trúc dài):
   ```html
   <body class="landscape">
   <!-- và trong <head> của file đó (CSS không cho ghi đè @page bằng class): -->
   <style>@page{ size:A4 landscape; }</style>
   ```
   Class `.landscape` (trong wb.css) chỉ **xoay** giấy: rộng hơn (≈271mm) nhưng thấp hơn (≈182mm).

> ⚠️ **A4 ngang KHÔNG cho nhiều diện tích hơn A4 dọc** — chỉ đổi chiều. Theo ISO, A3 = đúng 2× A4. Vì vậy khi nội dung không đủ chỗ:

3. **Cần thêm dung lượng → TĂNG SỐ TRANG A4** (cho phép >2 trang), KHÔNG quay lại A3.
   - Footer đổi sang **`Trang X/N`** (vd `Trang 1/4 · ĐỀ`, `Trang 4/4 · ĐÁP ÁN`). Bài 13 vốn đã đa trang là tiền lệ.
   - SVG vẽ bằng `viewBox` nên **tự co giãn** — cho landscape rộng hơn thì sơ đồ tự "thở" ra, không cần vẽ lại tọa độ.
   - Một phiếu chỉ **một orientation** (đừng trộn dọc/ngang trong cùng file → in mới gọn).

- **Lưu ý** [11-self-attention.html](11-self-attention.html) nhúng `<style>` riêng (không dùng biến của wb.css) → muốn landscape/đa trang phải tự sửa `.page`/`@page` trong style nội bộ, hoặc chuyển sang dùng `wb.css`.
- (Mẹo: hình "thuộc về kết quả" có thể để sang trang đáp án — như heatmap Bài 11.)

## 8. Kiểm tra trước khi giao (checklist)
- [ ] Bấm **🎲 Đổi số** vài lần: số ĐỀ, lời giải ĐÁP ÁN và **hình động** đều cập nhật khớp nhau.
- [ ] **Chụp soát tràn lề** bằng Edge headless:
  ```bash
  EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  "$EDGE" --headless=new --disable-gpu --window-size=860,1230 \
    --screenshot=out.png "file:///d:/Math/ai-by-hand/NN-ten.html"
  ```
  (cửa sổ cao ~2470 để thấy cả 2 trang). Soát: tràn chân trang, panel chồng nhau, caption SVG bị cắt.
- [ ] **Kiểm tràn BẰNG SỐ, không bằng mắt** (bắt buộc — `.page` có `overflow:hidden` nên phần tràn bị **cắt âm thầm**, nhìn thumbnail tưởng "ổn"; footer `position:absolute` thì đè lên nội dung). Tạo bản sao `_measure.html` chèn script đo rồi chụp:
  ```js
  window.addEventListener('load',()=>setTimeout(()=>{document.querySelectorAll('.page').forEach((p,i)=>{
    var over=p.scrollHeight-p.clientHeight;            // >2px là TRÀN
    console.log('Trang '+(i+1)+': '+over+'px '+(over>2?'TRÀN ✗':'ok'));
  })},400));
  ```
  Chụp bằng `--virtual-time-budget=3000` để chờ `load`. (⚠️ iframe **không** đo được file:// — mỗi file là opaque origin, `contentDocument` bị chặn → phải chèn thẳng vào bản sao.)
- [ ] **Ngân sách chiều cao trước khi xếp (A4):** A4 dọc khả dụng ≈ 260mm (297 − lề − footer); A4 ngang ≈ 165mm (thấp hơn nhưng rộng ≈271mm). Vượt thì **tách thêm trang A4** (footer `Trang X/N`), đừng nhồi/thu nhỏ, đừng quay lại A3. Mẹo hạ chiều cao: `<style>` nội bộ siết `.page .step{margin-top}`, `.calc{line-height}`, `.page .mtx .cell{height}` (additive, không đụng wb.css); `.cell` cao cố định 9mm nên `--cell` chỉ đổi bề rộng.
- [ ] **Đo lại ≥3 lần** (số ngẫu nhiên rộng làm dòng `.calc` xuống dòng → tràn dao động). Script đo nên gọi `generate()` trước khi đo; nhưng vẫn phải **chụp ảnh lúc mới tải** để bắt lỗi hình trống (thiếu lời gọi `drawX()` khởi tạo).
- [ ] Không lệ thuộc số: hình/caption cấu trúc vẫn đúng với mọi bộ số. **Worked-example ("Hàng 1: …") phải sinh bằng `data-q`**, đừng hardcode số — bấm 🎲 là sai ngay.
- [ ] **Cập nhật [index.html](index.html)**: chuyển thẻ bài từ `class="card todo"` sang `card done` (hoặc `card adv done`), sửa `href`, đổi `○` thành `Mở →`.
- [ ] Footer ghi đúng `Bài NN` và `Trang X/N · ĐỀ` / `N/N · ĐÁP ÁN` (đa trang thì đánh số liên tục).

## 9. Trạng thái hiện tại (cập nhật 2026-06-24)
- **Đã có đủ 26/26 phiếu** (01–26). Lộ trình mở rộng ~140 phiếu: xem [MUC-LUC-DAY-DU.md](MUC-LUC-DAY-DU.md).
- **Khổ giấy:** chuẩn hóa **A4-only** (bỏ A3) — A4 dọc mặc định, A4 ngang (`.landscape`) cho layout ngang, thêm trang A4 khi cần. Các bài từng A3 (11,13,14,15,16,18,22) đã/đang migrate về A4.
- *(Path cũ `d:\Math\ai-by-hand` trong tài liệu này là tồn dư — dự án thật ở `d:\MakeSomeThing\TayCraft AI\ai-by-hand`.)*
