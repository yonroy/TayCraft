# FORM DASHBOARD — spec dựng phiếu

> Phong cách phiếu thứ 3 của dự án (sau GIẢNG GIẢI `wb.css` và CANVAS `wb-canvas.css`).
> Chốt 2026-07-17 sau khi so 4 prototype. Bản mẫu tham chiếu: `K3/G1-embedding-vitri.html`.
> Style dùng chung: **`wb-dashboard.css`** (A4 dọc).

## 1. Vì sao chọn form này (đọc để không làm hỏng ý đồ)

Form dashboard được chọn vì nó **dạy thêm được một thứ mà form GIẢNG GIẢI không dạy: cảm giác về DẤU và ĐỘ LỚN của con số.**

Người học điền "−2.46" vào ô thì mới chỉ *viết đúng*. Khi họ phải **tự tô thanh giá trị** — chọn tô về bên trái vì số âm, tô dài bao nhiêu vì độ lớn 2.46/5 — họ mới *cảm* được con số đó là gì. Đây là lý do tồn tại của form. Mọi quyết định dưới đây phục vụ điều đó.

→ **Ràng buộc bất biến #1: thanh giá trị ở trang ĐỀ phải TRỐNG** (chỉ vạch 0 + mốc). Vẽ sẵn fill = lộ đáp án = giết chính điểm mạnh của form.

## 2. Khung file

```html
<link rel="stylesheet" href="../wb-dashboard.css">   <!-- KHÔNG link kèm wb.css -->
...
<div class="toolbar">…🎲 Đổi số… 🖨️ In / Lưu PDF…</div>
<section class="page">      <!-- ĐỀ -->
<section class="page key">  <!-- ĐÁP ÁN — bắt buộc class `key` -->
<script src="../wb-random.js"></script>
```

⚠️ **KHÔNG link `wb.css` kèm** — `.page` / `.why` / `.cell` trùng tên nhưng khác nghĩa → đè nhau, vỡ layout.
⚠️ **Trang ĐÁP ÁN phải có class `key`** — `tools/check-de-key.mjs` dò trang đáp án bằng `.page.key`. Thiếu → báo "không có trang đáp án". (G1 và prototype form-4 đều đã dính lỗi này một lần.)

## 3. Xương một trang ĐỀ

| Thứ tự | Khối | Class | Ghi chú |
|---|---|---|---|
| 1 | Đầu trang | `.top` > `.no` + `h1` + `.chip` | chip = "PHẦN H · ATTENTION" |
| 2 | Thanh phụ | `.subbar` | họ tên / ngày / thời lượng + chú giải màu `.sw` |
| 3 | Nhiệm vụ | `.mission` | 🎯 nói rõ **cuối phiếu tự chứng minh được gì** |
| 4 | Dữ liệu cho sẵn | `.panel` > `.split` | ma trận `.mx` với ô `.gv` (lam) |
| 5 | Sơ đồ luồng | `.panel` > `svg` | hình **để-điền** (giấu kết quả) |
| 6 | ①②③… các bước | `.panel` | mỗi bước 1 panel, đánh số ①②③ |
| 7 | Tự kiểm | `.panel` | **bước lõi** — xem §5 |
| 8 | Nháp | `.scratch` | chừa chỗ tính tay thật |
| 9 | Checklist | `.done` + `.win` | 3 mốc + 1 câu ăn mừng |
| 10 | Chân trang | `.foot` | `Trang 1/2 · ĐỀ` |

Trang ĐÁP ÁN: cùng xương, `.chip.key-chip` ghi "ĐÁP ÁN", các ô thành `.ansc` / `.cellb.ans` / `.slot.ans`, cộng `.why` giảng "vì sao", panel "Sai lầm thường gặp" (4 bẫy), và `.why.t` "Rút ra" nối sang bài sau.

## 4. Bảng màu (in được, nhất quán toàn bộ)

| Màu | Biến | Nghĩa |
|---|---|---|
| Lam `#0e7490` | `--blue` | dữ liệu **vào** / cho sẵn / Q / xuôi |
| Cam `#b45309` | `--orange` | **trọng số / đáp án** / ngược / K |
| Tím `#6d28d9` | `--purple` | thành phần **thứ ba** / V |
| Teal `#0f766e` | `--teal` | nhiệm vụ / rút ra / thắng lợi |

Ô trong `.mx`: `.gv` cho-sẵn · `.pe` tham số · `.pv` thành phần 3 · `.hot` đang chọn · `.blank` để điền · `.ansc` đáp án.

## 5. Bước "Tự kiểm" — linh hồn của phiếu

Mỗi phiếu phải có **đúng một** bước tự kiểm dạy **một tính chất lõi**, và **kỹ thuật phải KHÁC mọi phiếu đã có**. Đây là thứ phân biệt phiếu "làm cho xong" với phiếu đáng tiền.

Tiêu chuẩn một self-check tốt:
- Chứng minh được **bằng tay, tại chỗ**, không cần tin lời giảng.
- Kết quả **nói lên bản chất** thuật toán (vì sao nó được thiết kế như vậy).
- Lý tưởng: **bấm 🎲 mà đáp án đứng yên** → chính sự đứng yên là bằng chứng (mẫu G1: "E triệt tiêu").

Kỹ thuật đã dùng (**KHÔNG lặp lại**): triệt tiêu/bất biến (G1) · khôi phục identity (E6) · bất biến affine (E7) · chuỗi hữu hạn (E8) · clip giữ hướng (E9) · nhiễu ∝1/√B (E10) · tương đương dịch chuyển (F1) · same-padding (F2) · cộng dồn kênh (F3) · max-pool bất biến cục bộ (F5) · 2×3×3=5×5 (F6) · skip gradient=1 (F9) · chia sẻ trọng số (G2) · Σ các bước (G3) · nội suy lồi (G5) · beam≥greedy (G8) · softmax bất biến dịch (C10) · bất biến tỉ lệ (B10) · sai phân trung tâm (D5) · trực giao dốc nhất (D6) · p−y (D2/D9) · bias-correction (D13) · decoupling (D14).

## 6. Số động — bắt buộc

Mọi số biến thiên sinh qua `data-q` + `WB.setAll`. **Không hardcode số trung gian**, kể cả số "trông như hằng" (η, w₀ — đã dính lỗi ở D11/D12).

```js
function generate(){
  const a = WB.randIntNZ(-3,3);
  WB.setAll({ a: WB.fmtInt(a), … });   // fmtInt/fmt2 → dấu trừ "−" (U+2212), không phải "-"
  drawFig('figQ', false);              // ĐỀ: giấu kết quả
  drawFig('figA', true);               // ĐÁP ÁN: lộ
}
WB.wire(generate);
generate();   // ⚠️ BẮT BUỘC — thiếu dòng này thì lần tải đầu hiện số hardcode (bug bản cũ G1)
```

**Guard**: nếu một bộ số làm hỏng ý dạy (vd hai token trùng nhau khi bài cần chúng khác nhau) → loop lại cho tới khi hợp lệ.

## 7. Thanh giá trị `.track`

```js
// fill=false → chỉ vạch 0 + mốc, chừa TRỐNG cho người học tô bút chì (trang ĐỀ)
function drawBar(id, v, max, fill){
  const el=document.getElementById(id); if(!el) return;
  let h='<div class="zero"></div><div class="tick" style="left:25%"></div><div class="tick" style="left:75%"></div>';
  if(fill && v!==0){
    const pct = Math.min(Math.abs(v)/max, 1) * 50;
    h += v>0 ? '<div class="fill pos" style="left:50%;width:'+pct+'%"></div>'
             : '<div class="fill neg" style="right:50%;width:'+pct+'%"></div>';
  }
  el.innerHTML=h;
}
```
Luôn ghi **thang** ra caption ("Thang thanh: −5 … 0 … +5") — không có thang thì tô vô nghĩa.
Đại lượng chỉ dương (xác suất, chuẩn) → dùng `.track.uni` (gốc trái, thang 0…max).

## 8. Bẫy đã dính — đọc kỹ, 4/5 lỗi này mọi tool tự động đều MÙ

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| **Font Georgia** | Thiếu Latin Extended Additional → "tắt" in ra "tă´t" | Chỉ dùng font trong `wb-dashboard.css` (Segoe UI/Consolas). Serif an toàn: Cambria. |
| **SVG nuốt dấu trừ** | Ô 16px không chứa nổi "−2.16" → **in ra đọc thành số dương** | Ô SVG chứa số âm: rộng ≥21px, font ≤6.8px. |
| **`.rowlab span` là flex** | Nuốt khoảng trắng giữa flex item → "hàng3" | Dùng `&nbsp;`: `<span>e₀ ← hàng&nbsp;<span data-q="id0">0</span></span> |
| **Thiếu class `.key`** | check-de-key báo "không có trang đáp án" | `<section class="page key">` |
| **Thiếu `generate()` cuối script** | Tải đầu hiện số hardcode | Gọi `generate()` sau `WB.wire(generate)` |

## 9. Ngân sách trang

**KHÔNG có trần trên — số trang do NỘI DUNG quyết định** (chốt 2026-07-17, user nhắc lại). Bài dễ 2 trang, bài khó 3–4+ trang đều được. **Đừng ép mọi phiếu vào 2 trang.** 2 trang (1 ĐỀ + 1 ĐÁP ÁN) chỉ là mức tối thiểu, không phải đích.

**Hai lỗi ĐỐI XỨNG, tránh cả hai:**
- ❌ **Rải mỏng** — nội dung ~2.5 trang mà tách 4 trang, mỗi trang 25–60% giấy trắng. (Đo bằng `tools/check-fill.mjs`.)
- ❌ **Nén cho vừa** — bóp padding < 1.9mm, line-height < 1.3, SVG < 33mm, ô điền < 12×6.2mm, nháp < 12mm để nhồi 2.6 trang vào 2 trang. **Fill 97% mà nén là vẫn hỏng** — kín đáo hơn cắt nội dung nhưng cùng bản chất. Tràn 0px KHÔNG có nghĩa vừa vặn tốt.

**Cách đúng:** giữ giãn cách CHUẨN (padding ~1.9mm, --ch 6.4mm, nháp ~14–32mm, ô đáp chính ≥17×10mm), rồi cấp **đúng số trang nội dung cần**. Nếu một trang < 80% thì **phân bố lại** cho đều (không phải nén), hoặc để trang cuối thoáng hơn một chút — đừng shrink write-space để đẩy fill lên.

**Tính chiều cao TRƯỚC khi viết**, ước số trang theo nội dung. Trang A4 dọc: 297mm − padding 18mm ≈ **279mm dùng được**. **Báo số trang cho user khi giao.**

## 10. Cổng giao hàng — chạy đủ, không tin cảm giác

```bash
node tools/check.mjs <file> --runs 5        # tràn: phải 0px MỌI trang
node tools/check-de-key.mjs <file>          # lệch ĐỀ↔ĐÁP ÁN: phải 0 phiếu LỆCH
```
Rồi **soát mắt bằng ảnh** (bắt buộc — 4/5 lỗi ở §8 tool mù):
```bash
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless=new --disable-gpu --window-size=860,2600 --screenshot=out.png "file:///<đường dẫn tuyệt đối>"
```
Soát: dấu tiếng Việt có vỡ? · số âm trong SVG có đọc được dấu trừ? · thanh ở ĐỀ có TRỐNG? · SVG có hiện? · caption có bị cắt? · **tự tính tay lại toán** xem khớp không.

⚠️ **Không được tự kết luận "lỗi của Edge headless, in thật không sao"** — đã có tiền lệ kết luận sai như vậy và bỏ lọt lỗi font Georgia thật.
