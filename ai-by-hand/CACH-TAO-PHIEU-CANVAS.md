# Cách tạo một phiếu "AI by Hand" kiểu CANVAS TOÀN CẢNH

> Tài liệu **chính** cho phong cách **CANVAS** (A4 ngang) — house style hiện tại của bộ phiếu.
> Mổ xẻ xuyên suốt một bài mẫu sạch & đầy đủ: [`01-tich-vo-huong-canvas.html`](01-tich-vo-huong-canvas.html).
> Skill `/phieu-canvas` là bản tóm tắt thao tác; tài liệu này là bản đầy đủ có ví dụ.
> Phong cách còn lại (GIẢNG GIẢI, A4 dọc, `wb.css`) xem [`CACH-TAO-PHIEU.md`](CACH-TAO-PHIEU.md).

---

## 0. Triết lý & khi nào dùng canvas

**Canvas toàn cảnh (kiểu Tom Yeh):** học viên thấy **trọn cơ chế trên MỘT trang ngang** — sơ đồ kiến trúc
(trái) + toàn bộ luồng số (phải) — rồi **điền vào ô trắng**. Không "Bước 1/2/3" dọc dài như phiếu GIẢNG GIẢI.

| | CANVAS (`wb-canvas.css`) | GIẢNG GIẢI (`wb.css`) |
|---|---|---|
| Khổ | A4 **ngang** | A4 **dọc** |
| Bố cục | sơ đồ trái + bảng số phải, nhìn-trọn-hệ | các bước dọc, dạy kỹ từng bước |
| Hợp với | kiến trúc/khái niệm nhìn tổng thể (attention, matmul, transformer, vectơ) | bài cần dẫn dắt chi tiết cho người tự học |
| Skill | `/phieu-canvas` | `/phieu-giai-thich` |

**4 quy tắc bất biến (giữ từ dự án, áp cho mọi phiếu):**
1. **Tính được bằng tay với SỐ THẬT** — không công thức suông, không code chạy ra số.
2. Mỗi phiếu **≥ 2 trang** (gọi là `.sheet`): ĐỀ (ô trống) + ĐÁP ÁN (điền đủ). Phức tạp thì thêm sheet (`Trang X/N`).
3. **Số động qua 🎲** (`wb-random.js` / `window.WB`) — bấm 🎲 mà số không đổi là sai.
4. **Chỉ A4** — canvas mặc định **A4 ngang**. Không dùng A3.

---

## 1. Khung file

```html
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI by Hand · <Tên> — canvas toàn cảnh (A4 ngang)</title>
<link rel="stylesheet" href="wb-canvas.css">
<style>
  /* tinh chỉnh riêng cho bài này (KHÔNG đụng wb-canvas.css) */
  .schema{width:64mm;}                 /* đổi bề rộng cột sơ đồ          */
  .scal .cell{--cw:16mm;}              /* ô rộng hơn cho 1 con số dài    */
  /* .wk, .geo, .ublk… : class phụ riêng bài, xem mục 6 */
</style>
</head>
<body>

<div class="toolbar">
  <a href="index.html">← Mục lục</a>
  <button class="js-randomize">🎲 Đổi số</button>
  <button onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>

<!-- 2× <section class="sheet"> … xem mục 2–8 … -->

<script src="wb-random.js"></script>
<script>/* generate() + drawX(); WB.wire(generate); generate(); — xem mục 6–7 */</script>
</body>
</html>
```

> ⚠️ **Đường dẫn — canvas nằm FLAT trong `ai-by-hand/`** (vd `01-tich-vo-huong-canvas.html` ngay gốc),
> nên link **không có `../`**: `href="wb-canvas.css"`, `src="wb-random.js"`, `href="index.html"`.
> (Khác với phiếu GIẢNG GIẢI mới sinh bởi `tools/new.mjs` nằm trong `K1/…` → phải dùng `../`.)

> **Style nội bộ:** mọi tinh chỉnh đặt trong `<style>` của file (vd `.schema/.wk/.geo/.ublk` trong bài 01).
> `wb-canvas.css` là file dùng chung — chỉ thêm class **bổ sung**, không sửa class cũ.

---

## 2. Tiêu đề `.ttl`

Trang ĐỀ:
```html
<section class="sheet">
  <div class="ttl">
    <h1>Tích vô hướng</h1>
    <span class="vi">— Dot Product</span>
    <span class="tag">điền ô trắng · a·b = Σ aᵢbᵢ = |a||b|cos θ</span>
  </div>
  …
```
Trang ĐÁP ÁN — thêm `.badge` (CSS tự đổi badge sang **cam** qua selector `.key .ttl .badge`):
```html
<section class="sheet key">
  <div class="ttl"><h1>Tích vô hướng</h1><span class="vi">— lời giải & kiểm tra</span>
    <span class="badge">ĐÁP ÁN</span></div>
```
- `.tag` (góc phải) ghi **công thức ngắn / lời nhắc thao tác**, cỡ mono nhỏ.
- `.sheet.key` là cờ "trang đáp án" — JS dùng `closest('.key')` để biết đang vẽ trang nào (mục 7).

---

## 3. Giàn giáo tùy chọn `.scaf` (intro + công thức)

Bài 01 dùng `.scaf` để mở bài "Vì sao quan trọng" + `.fm` công thức gốc:
```html
<div class="scaf">
  <b>Vì sao quan trọng.</b> Tích vô hướng là phép tính nền tảng nhất của AI: mỗi nơ-ron, mỗi ô của
  phép nhân ma trận, mỗi điểm tương đồng trong attention đều là <b>một</b> tích vô hướng.
  <div class="fm">a · b = a₁b₁ + … + aₙbₙ = Σ aᵢbᵢ &nbsp;|&nbsp; a · b = |a|·|b|·cos θ</div>
</div>
```
Bỏ `.scaf` nếu muốn **thuần tối giản** (chỉ sơ đồ + bảng số + 1 dòng `.hint`) — hợp bài khái niệm đã rõ.

---

## 4. Bố cục `.canvas` = `.schema` (trái) + `.work` (phải)

```html
<div class="canvas">
  <div class="schema">
    <svg viewBox="0 0 178 150" aria-label="hai vectơ u và v, góc θ"></svg>
    <div class="hint"><b>Tích = 0 ⇒ vuông góc</b> (cos θ = 0): hai vectơ "không liên quan".</div>
  </div>

  <div class="work">
    <div class="bandh fw">ĐẠI SỐ · nhân từng cặp cùng vị trí rồi cộng</div>
    <div class="row">
      <div class="blk in"><div class="nm">a <s>1×3</s></div><div class="m c3" id="a"></div></div>
      <div class="op">·</div>
      <div class="blk in"><div class="nm">b <s>1×3</s></div><div class="m c3" id="b"></div></div>
    </div>
    <div class="row">
      <div class="blk hot"><div class="nm">aᵢ · bᵢ <s>từng cặp</s></div><div class="m c3" id="p"></div></div>
      <div class="op">→</div>
      <div class="blk out scal"><div class="nm">a · b <s>một con số</s></div><div class="m c1" id="d"></div></div>
    </div>
    <div class="wk" id="wk"></div>
  </div>
</div>
```
- **`.schema`** (`flex:none`, ~60mm — đổi bằng `<style>` nội bộ): sơ đồ **khối/hình** bằng `<svg viewBox>`,
  là "bản đồ" cho luồng số bên phải. `.hint` dưới sơ đồ ghi một câu chốt ý.
- **`.work`** (`flex:1`): chồng các **dải** theo thứ tự sơ đồ. Mỗi dải:
  - `.bandh` = nhãn dải (mono, gạch chân đứt). `.bandh.fw` xanh (xuôi) / `.bandh.bw` cam (ngược).
  - `.row` = một hàng các khối, **wrap** khi hẹp.
  - `.blk` = một khối: `.nm` (nhãn, `<s>` ghi cỡ ma trận màu xám) + `.m.cN` (ma trận N cột) + (tuỳ) `.fm`.
  - `.op` = toán tử lớn giữa hai ma trận (`·`, `×`, `→`, `+`).
- **Ma trận `.m.cN`**: `id` để JS đổ ô vào (mục 6). Bề rộng ô đổi qua biến `--cw` inline (vd `.scal .cell{--cw:16mm}`).
- Bố cục **bậc thang** cho phép nhân (matmul/attention): B trên · A trái · C ở giao điểm — xem mẫu `02-…-canvas`.

---

## 5. Mã màu canvas (KHÁC bảng màu của `wb.css`)

Gắn class màu lên `.blk` **cha** (hoặc trực tiếp `.m`). Bảng của `wb-canvas.css`:

| Class | Màu | Nghĩa |
|---|---|---|
| `.in` | kem `--in` | đầu vào / cho sẵn |
| `.w` | tím `--w` | trọng số / tham số |
| `.hot` | vàng `--hot` | nổi bật: attention / softmax / chuẩn hóa |
| `.out` / `.fw` | xanh `--out` | kết quả / chiều **xuôi** |
| `.bw` / `.up` | cam `--bw` | chiều **ngược** / gradient / cập nhật |
| `.cell.mark` | vàng | ô **làm mẫu** (đã điền sẵn 1 ô để chỉ cách) |
| `.cell.blank` | trắng nét đứt | ô **để học sinh điền** (đè mọi màu) |

> ⚠️ Đây **không** phải bảng `--accent`(lam)/`--accent2`(cam)/tím `#7c5cff` của `wb.css`. Phiếu canvas
> theo bảng riêng ở trên; đừng áp màu của tài liệu GIẢNG GIẢI vào đây. (Mũi tên SVG vẫn dùng lam=xuôi, cam=ngược.)

---

## 6. Hai cơ chế số động (bài 01 dùng CẢ HAI)

Canvas có **hai cách** bơm số ngẫu nhiên — chọn theo chỗ đặt số:

### (a) `fill(id, arr, blank)` — cho Ô MA TRẬN
Ghi thẳng `innerHTML` của `.m` theo `id`. `blank=true` → sinh `.cell.blank` (ô trống trang ĐỀ).
```js
function fill(id, arr, blank){
  var el=document.getElementById(id); if(!el) return; var s='';
  for(var i=0;i<arr.length;i++)
    s+='<div class="cell'+(blank?' blank':'')+'">'+(blank?'':WB.fmtInt(arr[i]))+'</div>';
  el.innerHTML=s;
}
// ĐỀ: cho-sẵn hiện số, phần phải tính để trống
fill('a',a,false); fill('b',b,false); fill('p',p,true); fill('d',[dot],true);
// ĐÁP ÁN (id khác — prefix k): điền đủ
fill('ka',a,false); fill('kb',b,false); fill('kp',p,false); fill('kd',[dot],false);
```

### (b) `data-q` + `WB.setAll` — cho SỐ RỜI trong câu chữ
Số nằm lẫn trong văn bản (vd dòng hình học `.geo`) thì bọc `data-q` và cập nhật hàng loạt:
```html
<span data-q="u1">3</span>·<span data-q="v1">1</span> + … = <span class="ublk"></span>   <!-- ĐỀ: ublk trống -->
… = <span class="ublk" data-q="udotv">5</span>                                        <!-- ĐÁP ÁN: ublk có data-q -->
```
```js
WB.setAll({ u1:String(u[0]), v1:String(v[0]), udotv:WB.fmtInt(udotv),
            nU:WB.fmt2(nU), cosU:WB.fmt2(cosU), degU:String(degU) });
```
`.ublk` là ô gạch-chân-đứt riêng bài (định nghĩa trong `<style>` nội bộ); trang `.key` tô cam.

### (c) Worked-example `.wk` — dòng nhân-cộng làm mẫu
Dựng chuỗi biểu thức bằng `WB.wrap` (bọc ngoặc số âm) + `WB.sumExpr` (nối "2 − 3 + 0", tránh "+ −"):
```js
var expr='a · b = '+WB.fmtInt(a[0])+'·'+WB.wrap(WB.fmtInt(b[0]))+' + …';
document.getElementById('wk').innerHTML  = expr+' = <b>______</b>';                       // ĐỀ
document.getElementById('kwk').innerHTML = expr+' = '+WB.sumExpr(p, WB.fmtInt)+' = <b>'+WB.fmtInt(dot)+'</b>'; // ĐÁP ÁN
```

**Hàm `WB` hay dùng:** `randInt/randIntNZ/pick`, `fmtInt` (dấu "−"), `fmt2` (2 chữ số), `fmtTrim`,
`wrap`, `sumExpr`, `setAll`, `wire`.

---

## 7. Vẽ sơ đồ SVG (`drawGeo` trong bài 01)

```js
function drawGeo(u, v){
  document.querySelectorAll('.schema svg').forEach(function(svg){
    var isKey = !!svg.closest('.key');     // phân biệt trang ĐỀ / ĐÁP ÁN
    var s='<defs>'
      + '<marker id="au" …><path … fill="#0e7490"/></marker>'   // mũi tên lam = xuôi
      + '<marker id="av" …><path … fill="#b45309"/></marker>'   // mũi tên cam = ngược/thứ 2
      + '</defs>';
    // … lưới, trục, vectơ, cung góc, nhãn …
    if(isKey){ s += '<text …>θ≈'+deg+'°</text>'; }   // chỉ trang đáp án mới lộ góc
    svg.innerHTML = s;
  });
}
```
- Mũi tên qua `<defs><marker>`; **xuôi = lam `#0e7490`**, **ngược / thành phần thứ 2 = cam `#b45309`**.
- **Hình phụ thuộc số** → gọi `drawGeo(...)` **bên trong** `generate()` (vẽ lại mỗi lần 🎲).
  **Hình tĩnh** (chỉ minh họa cơ chế) → gọi **một lần** sau `WB.wire`.
- `closest('.key')` cho phép một hàm vẽ phục vụ **cả hai** sheet, chỉ khác chi tiết lộ đáp án.
- **Bẫy caption:** chữ căn giữa rộng hơn `viewBox` bị **cắt hai đầu** → rút ngắn chữ, `font-size` nhỏ
  (ước lượng `số_ký_tự × ~4px < viewBox_width`).

Khởi tạo (BẮT BUỘC) — quên gọi `generate()` lúc tải thì SVG trống:
```js
WB.wire(generate);   // gắn nút 🎲
generate();          // gọi 1 lần lúc tải
```

---

## 8. Trang ĐÁP ÁN + "Rút ra"

Trang `.sheet.key` lặp lại **y hệt** canvas của trang ĐỀ nhưng:
- `id` ma trận đổi (prefix `k`: `ka/kb/kp/kd`) và `fill(..., false)` — điền đủ mọi ô.
- `.ublk` mang `data-q` để lộ số; SVG lộ thêm góc/đáp số.
- Đóng bằng `.rutra` ("Rút ra") nối sang bài kế:
```html
<div class="rutra">
  <b>Rút ra.</b> Tích vô hướng làm hai việc: (1) gộp đầu vào của một nơ-ron; (2) đo độ giống nhau qua cos θ.
  Bài sau: xếp nhiều tích vô hướng lại thành <b>nhân ma trận</b> (Bài 02).
</div>
```

---

## 9. Mẹo làm số TÍNH TAY ĐƯỢC

- Số nguyên nhỏ; tránh phép chia xấu. Tránh tích vô hướng = 0 vô tình (loại vectơ 0).
- **LayerNorm/RMSNorm:** chọn **d = 2** → x̂ luôn ra **±1** → cả khối ra số nguyên (mẫu 13).
- **√d:** chọn **d = 4 → √d = 2** (chia 2 sạch).
- **softmax/exp, ln, tanh, σ, √:** in kèm **bảng tra sẵn** trên canvas; sinh số rơi vào mốc tra được (bội 0.5).
- **Attention:** Q, K nhị phân {0,1} để điểm chia √d ra mốc đẹp.
- **Backprop ma trận** = 3 phép lặp: `∂W = δ·inᵀ` · `δ_trước = Wᵀ·δ ⊙ f′` · `W ← W − η·∂W`.

---

## 10. Checklist trước khi giao

- [ ] **Ngân sách chiều cao TRƯỚC KHI VIẾT:** A4 ngang khả dụng ≈ **165mm cao × 271mm rộng** mỗi `.sheet`.
      Vượt → **tách thêm sheet** (footer `Trang X/N`), đừng nhồi/thu nhỏ, đừng quay A3.
- [ ] Bấm **🎲** vài lần: số ĐỀ + lời giải ĐÁP ÁN + **hình** đổi khớp nhau.
- [ ] **Đo tràn BẰNG SỐ** (mỗi `.sheet` có `overflow:hidden` → tràn bị **cắt âm thầm**, nhìn thumbnail tưởng ổn):
      ```sh
      node tools/check.mjs 01-tich-vo-huong-canvas.html --runs 5 --shot
      # check.mjs đo cả .page lẫn .sheet; --runs 5 chạy 5 bộ số (bắt wrap xấu nhất); --shot kèm ảnh
      ```
      Tràn > 2px = ✗ → siết chiều cao bằng `<style>` nội bộ (giảm `.canvas` gap, `--ch` ô, cỡ chữ) rồi chạy lại.
- [ ] **Soát ảnh lúc mới tải:** SVG có hiện không? caption không bị cắt? màu ô đúng nghĩa?
- [ ] **Kiểm vài phép tính trên ảnh đáp án** — đúng số.
- [ ] Không lệ thuộc số: worked-example (`.wk`) phải sinh bằng JS, **đừng hardcode** — bấm 🎲 là lộ sai ngay.
- [ ] Footer mỗi sheet đúng: `Trang 1/2 · ĐỀ` / `Trang 2/2 · ĐÁP ÁN` (đa trang đánh số liên tục).

---

## 11. Đăng ký bài thật (KHI thay bản nháp `*-canvas.html` vào bộ chính)

> Hiện các file `NN-…-canvas.html` để **flat** là **bản nháp**; `index.html` vẫn trỏ bản cũ
> (vd thẻ Bài 01 trỏ `K1/01-tich-vo-huong.html`). Khi chốt bản canvas làm bản chính:

- `ai-by-hand/index.html`: bật thẻ `card todo` → `card done` (hoặc `card adv done`), **sửa `href`** sang
  file canvas, đổi `○` → `Mở →`.
- `web/lib/lessons.ts`: đặt `slug` đúng + `available:true` (+ `isFree` nếu cho xem thử). Web tự sync nội dung
  qua `web/scripts/sync-content.mjs` lúc build — **không** sửa `web/content/` (artifact, gitignored).

---

## 12. Mẫu tham chiếu (đọc trước khi làm)

- [`01-tich-vo-huong-canvas.html`](01-tich-vo-huong-canvas.html) — **lai: đại số + hình học 2D**, dùng **cả 2 cơ chế số động**, `drawGeo`. *(tài liệu này bám bài đó)*
- [`02-nhan-ma-tran-canvas.html`](02-nhan-ma-tran-canvas.html) — **bậc thang matmul** (nền tảng).
- [`11-self-attention-canvas.html`](11-self-attention-canvas.html) — **thuần tối giản**, softmax + bảng eˣ.
- [`12-backpropagation-canvas.html`](12-backpropagation-canvas.html) — **lai + ma trận** (xuôi lam / ngược cam, tích ngoài).
- [`13-transformer-canvas.html`](13-transformer-canvas.html) — **toàn hệ** (residual + 2×LayerNorm + FFN, d=2 ra số nguyên).
- Style chung: [`wb-canvas.css`](wb-canvas.css) · engine: [`wb-random.js`](wb-random.js) · quy tắc nền chung: [`CACH-TAO-PHIEU.md`](CACH-TAO-PHIEU.md).
