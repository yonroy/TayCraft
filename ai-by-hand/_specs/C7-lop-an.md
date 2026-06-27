# SPEC — C7 · Lớp ẩn — MLP nhỏ (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `07-lop-an` · English *Hidden layer (MLP)* · ~14 phút.
> Tiền đề: 06 (một lớp), 04 (kích hoạt).

## 1. Định vị
Chồng **hai lớp** với phi tuyến ở giữa: input → ẩn (ReLU) → output. Đây là **MLP** — mạng học được hàm phi tuyến đầu tiên.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Lớp ẩn cho mạng **biểu diễn trung gian**: lớp 1 trích đặc trưng thô, ReLU bẻ cong, lớp 2 kết hợp. Với đủ
  nơ-ron ẩn, MLP **xấp xỉ được hàm bất kỳ** (universal approximation).
- `.formula`:
  ```
  h = ReLU(W₁·x + b₁)      y = W₂·h + b₂      (forward pass 2 lớp)
  ```

## 3. Trực giác (`.intuition`)
> Lớp ẩn là **tầng khái niệm trung gian**: từ pixel thô → "cạnh", "góc" → "mặt", "chữ". Mỗi lớp xây trên đặc trưng lớp trước; phi
> tuyến ReLU cho phép "gấp" không gian để tách lớp không thẳng.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 → 2 → 1`: x=(1,2); W₁=[[1,1],[0,−1]], b₁=(0,1); W₂=[1, 2], b₂=−1; ReLU ở lớp ẩn. (`.cell.given`)
- **① Lớp ẩn (tuyến tính)** — `z₁ = 1·1+1·2+0 = __ (3) ; z₂ = 0·1+(−1)·2+1 = __` → −1. `.why`: hệt một lớp nơ-ron (Bài 06).
- **② ReLU lớp ẩn** — `h = (ReLU(3), ReLU(−1)) = (__, __)` → (3, 0). `.hint`: nơ-ron ẩn 2 tắt → đặc trưng trung gian thưa.
- **③ Lớp ra** — `y = W₂·h + b₂ = (1·3 + 2·0) + (−1) = __` → 2. `.why`: lớp 2 **kết hợp** các đặc trưng ẩn thành dự đoán cuối.
- **④ Vì sao cần ẩn** · pill `phi tuyến` — `.note`: bỏ ReLU thì y = W₂(W₁x+b₁)+b₂ rút lại **một** lớp tuyến tính (không học nổi XOR).
  Có ReLU mới gấp khúc được. SVG: x → h (ReLU) → y, đánh dấu nơ-ron tắt.

## 5. Tự kiểm tra (`.quiz`)
1. Vai trò của ReLU giữa hai lớp? → `.qa` **Phá tuyến tính để hai lớp không gộp thành một.**
2. "Universal approximation" nói gì? → `.qa` **MLP đủ rộng xấp xỉ được hàm liên tục bất kỳ.**

## 6. Rút ra
> **Rút ra.** MLP = lớp ẩn (ReLU) + lớp ra; phi tuyến ở giữa là chìa khóa. Bài tiếp (08): thêm lớp (sâu) hay thêm nơ-ron (rộng) —
> đánh đổi gì?

## 7. `data-q` & số mẫu
- Sinh W₁, b₁, W₂, b₂, x nguyên nhỏ; tính forward. Cho một nơ-ron ẩn tắt để minh họa.
- Khóa: `w1_11..`, `x1,x2`, `b1_1,b1_2`; `z1,z2`, `h1,h2`; `w2_1,w2_2,b2`, `y`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z (ẩn) | (3, −1) |
| h = ReLU | (3, 0) |
| y | 2 |
