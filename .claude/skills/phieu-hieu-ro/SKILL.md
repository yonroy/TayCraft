---
name: phieu-hieu-ro
description: Dựng phiếu "Làm toán AI" bản HIỂU RÕ + spec v3 đi kèm — A4 dọc nhiều trang, mỗi THÀNH PHẦN của thuật toán có MỘT sơ đồ động "để-điền" NGAY TRÊN ĐỀ + chùm câu hỏi dẫn dắt gắn thẻ vai trò (Quan sát/Tính/Dự đoán/Vì sao); ĐÁP ÁN gọn (đáp số + 1 dòng cốt lõi). Mã màu nhất quán. Dùng khi muốn người LẦN ĐẦU tự KHÁM PHÁ cơ chế qua hình + câu hỏi (mạnh hơn /phieu-giai-thich gọn). Cũng dùng để nâng cấp phiếu cũ. Luôn xuất kèm spec v3 self-contained.
---

# Phiếu HIỂU RÕ (template "hình-trên-đề + chùm câu hỏi" + spec v3)

Mục tiêu: người học **tự khám phá** cách mỗi thành phần (Q, K, √dₖ, softmax, V…) hoạt động — qua **hình ngay trên ĐỀ** và **nhiều câu hỏi dẫn dắt**, KHÔNG phải đọc lời giải chi tiết sẵn.

> **⚠️ TEMPLATE MỚI (chốt 2026-06-30) — đảo triết lý so với bản hiểu-rõ H1–H3 đời đầu:**
> | | Bản cũ (đời đầu) | **Template mới (bắt buộc dùng)** |
> |---|---|---|
> | Hình | hầu hết đẩy sang ĐÁP ÁN | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** (kiểu "hình-để-điền": cho dữ liệu, giấu kết quả bằng ô "?") |
> | Trọng tâm ĐỀ | bước có ô trống + lời dẫn | **chùm câu hỏi gắn thẻ vai trò**: `Quan sát` · `Tính` · `Dự đoán` · `Vì sao` |
> | ĐÁP ÁN | bung trọn số học từng bước | **GỌN**: đáp số + 1 dòng cốt lõi mỗi câu (badge **icon** → check-de-key bỏ qua) |
> | Mục tiêu | đọc lời giải mẫu | **người học tự nghĩ** qua hình + câu hỏi |
>
> **Bản mẫu chuẩn: `K3/H4-multi-head-attention-hieu-ro.html` + `_specs/H4-multi-head-attention.v3.md`.** Đọc trước khi làm. (H1/H2/H3 đã dựng lại theo template này.)

Vẫn là **bản nâng của `/phieu-giai-thich`**: giữ tinh thần 5 lớp (intro · trực giác · câu hỏi · tự kiểm · rút ra) nhưng **câu hỏi là xương sống** thay cho lời giải. **Luôn xuất kèm spec v3 self-contained.**

## 0. Khi nào dùng
- **Dùng `/phieu-hieu-ro`**: bài khái niệm khó hình dung (attention, softmax, chuẩn hóa, gradient), người lần đầu gặp; hoặc **nâng cấp** một phiếu giải-thích cũ thành bản "thấy rõ".
- Đối lập: `/phieu-giai-thich` (gọn 2 trang, chữ là chính) · `/phieu-canvas` (tối giản, A4 ngang).
- Chung nền: `wb.css` + `wb-random.js` + `data-q`. Phiếu này **A4 dọc, nhiều trang** (thường 4–6), nhiều SVG nhỏ.

## 1. Nguyên tắc bất biến (kế thừa dự án)
- Tính tay với SỐ THẬT; số động qua 🎲 (`window.WB`), không hardcode worked-example.
- ≥2 trang ĐỀ/ĐÁP ÁN; giàu hình → **tách thêm trang A4** (footer `Trang X/N`), không nhồi, không A3/landscape.
- Class CSS mới chỉ **additive** trong `<style>` nội bộ — KHÔNG sửa class cũ `wb.css`.
- **Mọi hình động phụ thuộc số ⇒ vẽ lại trong `generate()`**; hình tĩnh gọi 1 lần. Luôn có lời gọi khởi tạo.

## 2. Hai sản phẩm BẮT BUỘC mỗi lần chạy
1. **Phiếu** `K?/<slug>-hieu-ro.html` (đặt cạnh bản gốc, KHÔNG ghi đè bản canonical trừ khi được yêu cầu).
2. **Spec v3** `_specs/<slug>.v3.md` — self-contained, bám đúng HTML đã dựng (mẫu ở §7).

## 3. Lõi skill — "mỗi thành phần = 1 cụm: hình-để-điền + chùm câu hỏi"
Liệt kê các thành phần của thuật toán. **Mỗi thành phần → một CỤM `.step` (đánh số) trên ĐỀ** gồm:
1. **Sơ đồ ngay trên ĐỀ** theo kiểu **HÌNH-ĐỂ-ĐIỀN**: chỉ vẽ *dữ liệu cho-sẵn / cấu trúc / cơ chế*, **giấu kết quả** bằng ô "?". (Tuyệt đối không lộ đáp án ở ĐỀ.)
2. **`.figcap` 1–2 câu** mở bằng "**Nhìn hình:** …".
3. **Khối "✍️ TỰ TÍNH" `.calc2`** (BẮT BUỘC cho cụm có số học): **bày sẵn TRỌN chuỗi biểu thức**, thay số CHO-SẴN vào (q, v, eˣ-tra-bảng, Wₒ…) và để **một ô trống `.blk` sau MỖI dấu `=`** cho người học điền từng bước. Mục tiêu: *hiện rõ phép tính + cho tính toán nhiều* (vd softmax: `e^điểm₁ = ___, … Σ = ___ + ___ = ___, α₁ = ___ ÷ Σ = ___`). Giá trị suy ra ở cụm trước → để **blank "lấy từ Bước n"** (không in lại, tránh lộ).
4. **Chùm câu hỏi `.qset`** (2–4 câu) — phần CÒN LẠI sau khi tách số học ra `.calc2`: mỗi câu mở bằng một **thẻ vai trò** (cụm có `.calc2` thì qset tập trung Quan sát/Dự đoán/Vì sao):

| Thẻ | Lớp `.qtag` | Hỏi gì |
|---|---|---|
| 🟦 **Quan sát** | `qt-see` | đọc thẳng từ hình ("thanh nào dài hơn?", "góc bao nhiêu?") |
| 🟧 **Tính** | `qt-calc` | bung số tính tay (ô trống `.blk`) — đây là phần "làm toán" |
| 🟪 **Dự đoán** | `qt-pred` | what-if ("nếu điểm = (3,3) thì α ra sao?") |
| ⬛ **Vì sao** | `qt-why` | giải thích cơ chế bằng lời |

Mẫu sơ đồ tái dùng (encode đúng bản chất, **động theo số**):

| Loại thành phần | Mẫu sơ đồ |
|---|---|
| **Tương đồng / chiếu** (Q·K, cosine) | **Góc 2D**: vectơ + góc θ; cùng hướng ⇒ lớn, vuông góc ⇒ 0 |
| **Chuẩn hóa tỉ lệ** (√dₖ, nhiệt độ) | **2 thanh so sánh**: có/không áp → "bão hòa" vs "mềm" |
| **Phân phối / softmax** | **Thanh nhiều tầng**: raw → eˣ (giãn) → α (xếp chồng = 1, **ẩn số α**) |
| **Trộn / trung bình** (·V, concat, mean) | **Hình học điểm / ô nối**: O trên đoạn nguồn; hoặc ô đích **để trống** |
| **Ánh xạ / trộn ma trận** (Wₒ, linear) | **Đường nối**: ô vào → ô ra qua đường = trọng số; ô ra **để trống** |
| **Luồng kích thước** (matmul) | **Shape tracker** (HTML): `A[m×k]·B[k×n]=C[m×n]`, tag màu |
| **Tổng quan** | **Pipeline tĩnh**: các hộp nối mũi tên |

> Quy tắc vàng: sơ đồ **encode đúng bản chất** (độ dày/độ dài/vị trí/đường = đại lượng thật), **động theo số**, **giấu kết quả** (ô "?") để câu hỏi `Tính` còn việc làm.

## 4. Mã màu NHẤT QUÁN (bắt buộc)
Khai báo hằng JS, dùng xuyên suốt mọi hình + legend + shape tag:
```js
var CQ='#0e7490', CK='#b45309', CV='#7c5cff';   // vào/xuôi/Q · trọng số/ngược/K · thành-phần-3/V
```
Legend đặt cuối `.intro` trang 1: `Q (lam) · K (cam) · V (tím)`. Giữ đúng quy ước màu in được của dự án.

## 5. Bộ helper SVG dùng lại (đặt đầu `<script>`)
```js
function el(id){return document.getElementById(id);}
function line(x1,y1,x2,y2,c,w){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+w+'"/>';}
function txt(x,y,t,c,fs){return '<text x="'+x+'" y="'+y+'" font-size="'+(fs||9)+'" fill="'+c+'">'+t+'</text>';}
function ctxt(x,y,t,c,fs,w){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+(fs||9)+'" font-weight="'+(w||400)+'" fill="'+c+'">'+t+'</text>';}
function rct(x,y,w,h,fill,stroke){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="1"':'')+'/>';}
function arrow(x1,y1,x2,y2,c,w){var a=Math.atan2(y2-y1,x2-x1),L=8;
  var ax=x2-L*Math.cos(a-0.42),ay=y2-L*Math.sin(a-0.42),bx=x2-L*Math.cos(a+0.42),by=y2-L*Math.sin(a+0.42);
  return line(x1,y1,x2,y2,c,w)+'<path d="M'+x2+' '+y2+' L'+ax+' '+ay+' L'+bx+' '+by+' z" fill="'+c+'"/>';}
```
Mỗi sơ đồ là 1 `drawXxx(id, …)` build chuỗi `s` rồi `el(id).innerHTML=s`. Gọi tất cả trong `generate()` (động) + `drawPipe()` (tĩnh) sau `WB.wire(generate); generate();`.

## 5b. Bộ pattern "BẢN ĐẸP" (chốt 2026-07-05 — áp cho phiếu mới)
Class có sẵn cuối `wb.css`, dùng thẳng (KHÔNG copy vào `<style>` nội bộ). Chi tiết + snippet:
`CACH-TAO-PHIEU.md §2` · mẫu chuẩn `K2/D7-backpropagation-dep.html`.
- **`.wcell`** ô điền to ≥17×10mm cho đáp án CHÍNH (trong `.calc2` vẫn dùng `.blk` cho chuỗi
  bước trung gian; kết quả CHỐT của cụm → `.wcell`).
- **Ô điền TRONG hình**: sơ đồ-để-điền vốn là lõi skill này — ô "?" nên vẽ thành **rect trắng
  to ~22×12mm có ✍ mờ** (không chỉ dấu "?") để người học viết thẳng vào hình in ra.
- **`.mission`** 🎯 mở trang ĐỀ 1 (2–3 dòng nhiệm vụ + phần thưởng) — đặt TRƯỚC/THAY `.intro`
  dày; thiết kế cụm cuối là **phần thưởng thấy được** khi khả thi.
- **`.scratch`** lấp khoảng trắng ≥15mm cuối MỖI trang ĐỀ (phiếu nhiều trang càng cần).
- **`.done-row`** cuối trang ĐỀ cuối cùng: ô tick mốc + câu thưởng 🎉.
- **Màu theo Phần**: `<body class="part pX">` + `.part-chip` (bảng: `CACH-TAO-PHIEU.md §2.6`);
  không đổi mã màu số học Q/K/V ở §4.

## 6. CSS additive cần có (trong `<style>` nội bộ)
```css
/* hình + chú thích cạnh nhau */
.figwrap{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
.figcap{flex:1;min-width:150px;font-size:12px;color:#475569;line-height:1.45;}
.figcap b{color:#0f172a;}
/* legend màu */
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin-top:4px;color:#475569;}
.legend b{padding:0 4px;border-radius:4px;color:#fff;} .cqq{background:#0e7490;}.ckk{background:#b45309;}.cvv{background:#7c5cff;}
/* shape tracker */
.shape{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-family:var(--mono);font-size:12.5px;margin-top:6px;}
.shape .sx{padding:3px 7px;border-radius:6px;color:#fff;font-weight:700;} .shape .op{color:#64748b;font-weight:700;}
.shape .res{padding:3px 7px;border-radius:6px;background:#eef3f8;border:1px solid #cdd8e6;color:#1e293b;font-weight:700;}
.tag-q{background:#0e7490;}.tag-k{background:#b45309;}.tag-v{background:#7c5cff;}
/* CHÙM CÂU HỎI — mỗi câu một thẻ vai trò (LÕI template mới) */
.qset{margin:7px 0 0;padding-left:0;list-style:none;}
.qset>li{position:relative;margin:6px 0;padding-left:70px;font-size:13px;line-height:1.55;color:#1e293b;}
.qtag{position:absolute;left:0;top:1px;width:58px;text-align:center;font-size:10px;font-weight:700;padding:2px 0;border-radius:5px;color:#fff;}
.qt-see{background:#0e7490;}.qt-calc{background:#b45309;}.qt-pred{background:#7c5cff;}.qt-why{background:#475569;}
.qset .blk{min-width:46px;} .qset .mono{font-family:var(--mono);}
/* KHỐI TỰ TÍNH — bày sẵn phép tính, ô trống gạch chân sau mỗi "=" */
.calc2{margin:7px 0 2px;padding:7px 11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;font-family:var(--mono);font-size:13px;line-height:2.05;color:#1e293b;}
.calc2 .ttl{font-weight:700;color:#b45309;font-size:11px;letter-spacing:.03em;}
.calc2 .blk{min-width:38px;border-bottom:1px solid #94a3b8;}
/* ĐÁP ÁN GỌN — danh sách đáp số 1 dòng */
.keylist{margin:4px 0 0;padding-left:0;list-style:none;}
.keylist>li{margin:5px 0;font-size:13px;line-height:1.5;color:#1e293b;}
.keylist .lab{display:inline-block;min-width:96px;font-weight:700;color:#0f172a;}
.keylist .mono{font-family:var(--mono);color:#b45309;font-weight:700;}
/* bảng tổng kết + siết chiều cao */
.recap{border-collapse:collapse;width:100%;font-size:13px;margin-top:6px;}
.recap th,.recap td{border:1px solid #d9dee6;padding:5px 9px;text-align:left;} .recap th{background:#eef3f8;font-weight:700;} .recap td.r{font-family:var(--mono);text-align:center;}
.sub{color:#5b6776;font-size:.86em;}
.page .step{margin-top:8px;} .page .note{margin-top:4px;}
```

## 7. Layout nhiều trang (template MỚI — mẫu H4: 3 ĐỀ + 1 ĐÁP ÁN)
**ĐỀ:** mỗi cụm `.step` đánh số = 1 thành phần = **sơ đồ-để-điền + figcap + (khối `.calc2` nếu có số) + `.qset`**. Thường 2–3 cụm/trang ĐỀ (chừa khoảng trắng để viết nháp bằng bút chì — đây là phiếu làm tay).

| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · Bước 0 cho sẵn (`.gv`) + note trung thực giả định · **Cụm 1** (sơ đồ + qset) |
| 2 | ĐỀ | **Cụm 2** · **Cụm 3** … (mỗi cụm: sơ đồ-để-điền + figcap + qset có ≥1 thẻ `Tính`) |
| 3 | ĐỀ | **Cụm 4** (thường nặng nhất) · **Cụm cuối** = toàn cảnh `figPipe` + câu tổng hợp `Dự đoán`/`Vì sao` |
| 4 | ĐÁP ÁN | **GỌN**: mỗi cụm 1 khối `.step` badge **icon ✓** + `.keylist` (mỗi câu: `.lab` nhãn + đáp số `.mono` + ≤1 dòng cốt lõi) · `.intro` viền cam **Rút ra** → bài kế |

Số cụm/trang tuỳ độ cao (đo trước — xem `[[phieu-budget-chieu-cao-truoc]]`). Bài đơn giản có thể 2 ĐỀ + 1 ĐÁP ÁN; bài nhiều thành phần → 3–4 ĐỀ.

**Câu `Tính` bung số:** `o₁ = z₁+z₂+z₄ = <h1a> + <h1b> + <h2b> =` `.blk` (dùng `data-q` given, kết quả để trống). Đáp số chỉ lộ ở ĐÁP ÁN (`data-q` ô đáp).
**Parity (cửa chặn B7):**
- Cụm ĐỀ đánh số `<div class="b">N</div>` (1,2,3…). **ĐÁP ÁN dùng badge ICON** (✓ hoặc 💡 Σ ⚖️…) → `check-de-key.mjs` bỏ qua → key{} ⊆ ĐỀ, **0 lệch**.
- Mọi đáp số ở ĐÁP ÁN phải có câu hỏi/ô trống tương ứng ở ĐỀ.

## 8. Spec v3 (template self-contained — luôn xuất)
Cấu trúc `_specs/<slug>.v3.md`:
1. Header: "v3 = v(n−1) + lớp trực quan", trỏ đúng file HTML, ghi "engine số giữ nguyên".
2. Bảng **khác biệt v3 vs bản trước** (số trang, số hình, mã màu…).
3. **Layout N trang** (bảng như §7).
4. **Mã màu** hằng số + quy ước.
5. **Ghi chú trung thực** các giả định đơn giản hóa (vd "vectơ 2D nhưng √dₖ=2 là hằng số tỉ lệ") — biến mâu thuẫn thành điểm dạy.
6. **Đặc tả từng sơ đồ**: viewBox, kích thước mm, toạ độ gốc/đơn vị, ĐỘNG/TĨNH, "dạy gì", **bất biến** (điều luôn đúng khi 🎲).
7. Khối chữ mới (legend, figcap "Nhìn hình:", **`.qset` thẻ vai trò**, `.keylist` đáp án gọn).
8. CSS thêm (liệt kê class — gồm `.qset/.qtag/.keylist`).
9. **Checklist nghiệm thu riêng** (xem §9).

## 9. Nghiệm thu trước khi giao (BẮT BUỘC)
```bash
node ai-by-hand/tools/check.mjs K?/<slug>-hieu-ro.html --runs 5      # tràn 0px MỌI trang
node ai-by-hand/tools/check-de-key.mjs K?/<slug>-hieu-ro.html        # 0 lệch ĐỀ↔ĐÁP ÁN
# + chụp ảnh Edge headless soát mắt: mọi SVG hiện? figcap không cắt? chữ không chồng?
```
- [ ] Bấm 🎲 nhiều lần: **mọi hình động** đổi khớp số; **ô "?" ở ĐỀ luôn TRỐNG** (không lộ đáp án).
- [ ] Mỗi cụm ĐỀ có: sơ đồ + figcap "Nhìn hình:" + `.qset` ≥2 câu; **cụm có số học PHẢI có khối `.calc2`** bày trọn phép tính, ô trống sau mỗi `=` (hiện phép tính + cho tính nhiều).
- [ ] Sơ đồ KHÔNG in sẵn giá trị mà `.calc2` bắt người học tính (vd eˣ, α) — để "?" trên hình.
- [ ] Mã màu đồng nhất ở legend + mọi hình + thẻ; ĐÁP ÁN gọn (đáp số + ≤1 dòng/câu), badge icon.
- [ ] Spec v3 mô tả đúng từng hình (đối chiếu viewBox/toạ độ với HTML thật).
- [ ] Pattern bản đẹp (§5b): ô "?" trong hình là rect trắng to viết được · `.wcell` cho đáp chốt · `.mission` mở bài · `.scratch` lấp trống · `.done-row` chốt · `body class="part pX"`.

## 10. Đăng ký (khi ra bài thật — chỉ khi được yêu cầu)
- `ai-by-hand/index.html`: bật thẻ `todo`→`done`, sửa `href`, `○`→`Mở →`. (Bản hiểu-rõ thường là **biến thể** của bài đã có → hỏi người dùng: thay bản gốc / song song / để nháp.)
- `web/lib/lessons.ts`: `slug` + `available:true` nếu thành bài chính thức.

## 11. Mẫu tham chiếu (đọc trước khi làm)
- **Phiếu mẫu chuẩn (template mới): `ai-by-hand/K3/H4-multi-head-attention-hieu-ro.html`** (4 trang · 5 sơ đồ TRÊN ĐỀ: split, heads, concat, mix-Wₒ, pipeline · chùm câu hỏi thẻ vai trò · ĐÁP ÁN gọn).
- Spec mẫu: `ai-by-hand/_specs/H4-multi-head-attention.v3.md`.
- H1/H2/H3 cũng đã dựng lại theo template này (tham chiếu thêm).
- **Pattern bản đẹp: `ai-by-hand/K2/D7-backpropagation-dep.html`** (hero ô-điền-trong-hình, `.wcell`, `.mission`, `.scratch`, `.done-row`, màu Phần).
- Nền: `ai-by-hand/wb.css` · `ai-by-hand/wb-random.js` · `ai-by-hand/CACH-TAO-PHIEU.md` · skill `phieu-giai-thich`.
