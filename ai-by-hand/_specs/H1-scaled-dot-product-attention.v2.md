# SPEC v2 — H1 · Scaled Dot-Product Attention (GIẢNG GIẢI · A4 dọc)

> **Spec v2 = bản tự-chứa, bám đúng HTML đã dựng** (`K3/H1-scaled-dot-product-attention.html`).
> Đủ để một người/agent tái dựng phiếu **không cần đoán**: mọi số được tính trọn, mọi khóa `data-q` được
> liệt kê kèm vai trò, thuật toán `generate()` ghi rõ ràng buộc, sơ đồ tả chính xác.
> Quy tắc chung (5 lớp, màu, parity ĐỀ⊇ĐÁP-ÁN, checklist) vẫn ở `_specs/README.md` — v2 KHÔNG lặp lại,
> chỉ ghi phần **riêng** + những chi tiết v1 bỏ sót.

---

## 0. Thẻ định danh (metadata)

| Trường | Giá trị |
|---|---|
| Mã · slug | `H1` · `H1-scaled-dot-product-attention` |
| Tên VI · EN | Scaled Dot-Product Attention · *Scaled dot-product attention* |
| Khóa · Phần | K4 (lessons.ts) · Phần H (Attention/Transformer) — **mở đầu Phần H** |
| Thời lượng | ~14 phút |
| Mức | nâng cao |
| File CSS | `../wb.css` (+ `<style>` siết chiều cao additive, xem §8) |
| Số trang | 2 (ĐỀ + ĐÁP ÁN), không tách thêm |
| Tiền đề (bài trước) | A3 (tích vô hướng), C10 (softmax), A4 (cosine) |
| Bài kế (rút ra dẫn sang) | H2 — self-attention (Q,K,V cùng một chuỗi) |

---

## 1. Định vị (1 câu)
Cơ chế lõi của Transformer: mỗi truy vấn **Q** chấm điểm tương đồng với mọi khóa **K**, chuẩn hóa bằng
softmax thành **trọng số chú ý**, rồi **trộn các giá trị V** theo trọng số đó.

## 2. Vì sao quan trọng — khối `.intro` + `.formula`
**Văn bản `.intro` (nguyên văn trên phiếu):**
> **Vì sao quan trọng.** Đây là **phép tính lõi** của mọi Transformer. Mỗi truy vấn (Q) chấm điểm tương đồng
> với từng khóa (K), chuẩn hóa bằng softmax thành **trọng số chú ý**, rồi **trộn các giá trị (V)** theo trọng
> số đó — cho token lấy thông tin từ token liên quan ở bất kỳ khoảng cách nào.

**`.formula` (font mono):**
```
Attention(Q,K,V) = softmax( Q·Kᵀ / √dₖ ) · V    (ở đây dₖ = 4 → √dₖ = 2)
```
> Ghi rõ `dₖ=4 → √dₖ=2` ngay trong công thức: tránh người học hỏi "√dₖ ở đâu ra".

## 3. Trực giác — khối `.intuition` (viền tím, mở 💡)
> Như **tra cứu mềm**: câu hỏi Q so độ khớp với từng "nhãn" K (tích vô hướng) → softmax biến độ khớp thành
> **trọng số** (cộng = 1) → lấy **trung bình có trọng số** các nội dung V. Chia √dₖ để điểm không quá lớn
> làm softmax bão hòa.

**Misconception cần chặn:** học sinh tưởng attention "chọn 1 token" (argmax). Thực ra là **trung bình mềm**
có trọng số — nên đầu ra O là *hỗn hợp*, không phải một V đơn lẻ. (Nhấn ở `.note` bước 4.)

---

## 4. Các bước — đặc tả từng ô (ĐỀ ↔ ĐÁP ÁN)

> Ký hiệu: **[given]** = số cho sẵn (`.gv`, không phải `.cell` — số inline, KHÔNG tô nền ô) ·
> **[blank→k]** = ô trống ở ĐỀ, đáp án nằm ở khóa `data-q="k"` · **[show k]** = ĐỀ hiển thị giá trị khóa `k`
> (đã là kết quả bước trước, "mang xuống" làm dữ liệu cho bước này).

### ⓪ Cho sẵn — `.step` b=0 · tag `1 query · 2 key/value · dₖ=4`
- Dòng số (font 14px):
  `q = ( [given q1], [given q2] ) · k₁=(1,0), k₂=(0,1) · v₁=( [given v11],[given v12] ), v₂=( [given v21],[given v22] )`
- **k₁,k₂ cố định (1,0)/(0,1)** — KHÔNG random (giữ √dₖ và mốc bảng eˣ sạch). Chỉ q và v random.
- **Bảng eˣ** (`<table class="extbl">`): cột x = 0,1,2 ; hàng eˣ = 1.00, 2.72, 7.39.
  → mọi mũ cần dùng (0,1,2) đều có sẵn; học sinh không phải bấm máy.

### ① Điểm tương đồng Q·Kᵀ — tag `tích vô hướng`
- ĐỀ: `q·k₁ = [blank→s1] ; q·k₂ = [blank→s2]`
- `.why` **Vì sao:** tích vô hướng đo "câu hỏi khớp khóa nào" — giống cosine khi chưa chuẩn hóa độ dài.
- ĐÁP ÁN (b=1): `q·k₁ = [show s1] ; q·k₂ = [show s2]`

### ② Chia √dₖ — tag `√4 = 2`
- ĐỀ: `điểm = ( [show s1]/2 , [show s2]/2 ) = ( [blank→sc1], [blank→sc2] )`
  → **s1,s2 lộ ở đây** (kết quả bước 1) làm tử số; học sinh chỉ chia 2.
- `.hint` Chia √dₖ giữ phương sai điểm ổn định khi dₖ lớn → softmax không bão hòa (gradient còn sống).
- ĐÁP ÁN (b=2): `điểm = ( [show sc1], [show sc2] )`

### ③ Softmax → trọng số chú ý α — tag `eˣ / Σeˣ`
- ĐỀ: `e^[show sc1] = [show e1] , e^[show sc2] = [show e2] , Σ = [show Z] → α = ( [blank→a1], [blank→a2] )`
  → sc1,sc2 lộ làm số mũ; e1,e2,Z lộ (tra bảng) để học sinh chỉ chia.
- `.why` **Vì sao:** token khớp hơn nhận chú ý nhiều hơn; tổng α = 1 (do softmax).
- ĐÁP ÁN (b=3): `α = ( [show a1], [show a2] )` + ghi chú inline `(2.72/3.72 = 0.73)`.

### ④ Trộn V → đầu ra — tag `O = α·V`
- ĐỀ: `O = [show a1]·([show v11],[show v12]) + [show a2]·([show v21],[show v22]) = ( [blank→o1], [blank→o2] )`
  → a1,a2 lộ (kết quả bước 3) + v lộ lại (given bước 0).
- `.note` Đầu ra là **hỗn hợp** thông tin các token, nghiêng về token liên quan nhất.
- ĐÁP ÁN (b=4): `O = ( [show o1], [show o2] )`

> **Bảng parity (cửa chặn lỗi B7):** mỗi `[blank]` ở ĐỀ có đúng một `[show]` tương ứng ở ĐÁP ÁN.
> Không bước nào ở ĐÁP ÁN mà ĐỀ thiếu câu hỏi. SVG (§6) ở ĐÁP ÁN là **diễn giải** α (không phải bước tính
> mới) → không cần ô trống ở ĐỀ; nhưng dữ liệu nó vẽ (α) đã được hỏi ở bước 3 ⇒ hợp lệ.

---

## 5. Tự kiểm tra — `.quiz` (ĐỀ: hỏi · ĐÁP ÁN: `.qa`)
1. Vì sao chia √dₖ trước softmax?
   → **Giữ điểm không quá lớn → softmax không bão hòa, gradient còn sống.**
2. Trọng số attention α tổng bằng bao nhiêu?
   → **1 (do softmax).**

## 6. Sơ đồ SVG — `#figA` (ĐÁP ÁN, viewBox `0 0 240 150`, 76mm×48mm)
- **Nội dung:** 1 nút Q (lam, trái, x≈34,y≈75) nối tới 2 nút "k₁v₁"/"k₂v₂" (cam, phải, y≈40/110).
- **Mã hóa trực quan:** độ **dày cạnh** = `1 + α·9` (α lớn → cạnh dày), màu cạnh tím, nhãn `α=0.73` cạnh mỗi cung.
- **Caption/note kèm:** "Cạnh càng dày = α càng lớn → token đó đóng góp nhiều vào đầu ra O."
- **Động:** vẽ lại trong `generate()` qua `drawAttn('figA', al1, al2)`. Có lời gọi khởi tạo (`generate()` cuối script) → không trống lúc tải.
- Màu: Q lam `#0e7490`, K/V cam `#b45309`, cạnh α tím `#7c5cff` (đúng quy ước §C README).

## 7. Rút ra — `.intro` viền cam (cuối ĐÁP ÁN)
> **Rút ra.** Attention = điểm Q·K (chia √dₖ) → softmax → trộn V; mỗi token lấy thông tin theo độ liên quan.
> Bài tiếp (H2): **self-attention** — Q, K, V cùng sinh từ một chuỗi.

---

## 8. Engine `generate()` — đặc tả thuật toán (số động qua 🎲)

**Bảng tra cứng trong script:** `EXP = {0:1, 1:2.72, 2:7.39}`.

**Biến random & ràng buộc (giữ tính-tay-được khi bấm 🎲):**
| Biến | Sinh | Ràng buộc / lý do |
|---|---|---|
| `a` | `pick([1,2])` | điểm trội **sau** khi /√dₖ phải rơi mốc bảng eˣ {1,2} |
| `dom` | `pick([0,1])` | q nghiêng về k₁ (dom=0) hay k₂ (dom=1) |
| `q` | `dom=0 ? [2a,0] : [0,2a]` | nhân 2 để sau chia √dₖ=2 ra đúng `a` |
| `k1,k2` | cố định `[1,0]`,`[0,1]` | KHÔNG random — giữ tích vô hướng & mốc eˣ sạch |
| `v1,v2` | mỗi tọa độ `randInt(0,3)` | số nhỏ để O = α·V tính tay gọn |

**Chuỗi tính (đúng thứ tự code):**
```
s1 = q·k1 ;  s2 = q·k2
sc1 = s1/2 ; sc2 = s2/2                 // chia √dₖ
e1 = EXP[sc1] ; e2 = EXP[sc2]
Z  = round2(e1 + e2)
al1 = round2(e1/(e1+e2)) ; al2 = round2(1 − al1)   // ép tổng α = 1
o1 = round2(al1·v1x + al2·v2x)
o2 = round2(al1·v1y + al2·v2y)
```
`round2(x) = Math.round(x*100)/100`. Hiển thị qua `WB.fmt2` (2 chữ số).

**Lưu ý số học:** `al2 = 1 − al1` (KHÔNG tính `e2/Z` riêng) để hai trọng số **cộng đúng = 1** sau làm tròn —
khớp đáp án quiz "tổng α = 1".

## 9. Bản đồ khóa `data-q` (đầy đủ)

| Khóa | Ý nghĩa | Định dạng | Xuất hiện ở |
|---|---|---|---|
| `q1,q2` | tọa độ q (given) | `String(int)` | ĐỀ ⓪ (.gv) |
| `v11,v12,v21,v22` | tọa độ v₁,v₂ (given) | `String(int)` | ĐỀ ⓪ & bước 4 (.gv, dùng lại) |
| `s1,s2` | điểm Q·Kᵀ | `String(int)` | ĐỀ b2 (tử số) · ĐÁP ÁN b1 |
| `sc1,sc2` | điểm sau /√dₖ | `String(int)` | ĐỀ b3 (số mũ) · ĐÁP ÁN b2 |
| `e1,e2` | eˣ tra bảng | `fmt2` | ĐỀ b3 |
| `Z` | Σeˣ | `fmt2` | ĐỀ b3 |
| `a1,a2` | trọng số α | `fmt2` | ĐỀ b4 (hệ số) · ĐÁP ÁN b3 |
| `o1,o2` | đầu ra O | `fmt2` | ĐÁP ÁN b4 |

> **Quy ước bền:** một khóa = một giá trị, mọi thẻ cùng khóa cập nhật một lần qua `WB.setAll`. Số "mang xuống"
> (s, sc, a, v) cố tình **lặp khóa** ở nhiều nơi → bấm 🎲 mọi chỗ đổi đồng bộ.

## 10. Ví dụ tính trọn (render mặc định: a=1, dom=0, v1=(1,0), v2=(0,1))

| Bước | Phép tính | Kết quả |
|---|---|---|
| ① Q·K | q·k₁=2·1+0·0=2 ; q·k₂=2·0+0·1=0 | s = (2, 0) |
| ② /√dₖ | 2/2 ; 0/2 | sc = (1, 0) |
| ③ softmax | e¹=2.72, e⁰=1, Σ=3.72 ; 2.72/3.72 ; 1−0.73 | α = (0.73, 0.27) |
| ④ O | 0.73·(1,0)+0.27·(0,1) | O = (0.73, 0.27) |

**Kiểm chéo a=2, dom=1, v1=(2,1), v2=(0,3):** s=(0,4)→sc=(0,2)→e=(1,7.39),Σ=8.39→α=(0.12,0.88)
→O=(0.12·2+0.88·0, 0.12·1+0.88·3)=(0.24, 2.76). ✓ vẫn tính tay được, mốc bảng đủ.

## 11. Checklist nghiệm thu (riêng phiếu này)
- [ ] `node tools/check.mjs K3/H1-*.html --runs 5` → tràn ≤ 2px (HTML có `<style>` siết chiều cao — xem §8 head).
- [ ] `node tools/check-de-key.mjs K3/H1-*.html` → 0 lệch.
- [ ] Bấm 🎲 nhiều lần: q,v đổi → s,sc,α,O đổi khớp; **cạnh SVG đổi độ dày** theo α.
- [ ] Mọi mũ eˣ luôn rơi {0,1,2} (không bao giờ cần e³⁺). Nếu thấy `undefined` → `a` lọt ngoài {1,2}.
- [ ] Tổng α luôn = 1.00 sau làm tròn (nhờ `al2 = 1 − al1`).

---

### Ghi chú v2 vs v1
v1 (`H1-scaled-dot-product-attention.md`) thiếu: bảng eˣ tới e²; ràng buộc `a∈{1,2}`/`k` cố định; cơ chế
"số mang xuống lộ ở bước sau"; phân biệt `.gv` vs `.cell`; thuật toán `al2=1−al1`; layout SVG (toạ độ, độ dày
`1+α·9`); ví dụ kiểm chéo. v2 bổ sung tất cả + bảng parity + bản đồ khóa đầy đủ.
