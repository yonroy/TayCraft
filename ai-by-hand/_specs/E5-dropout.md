# SPEC — E5 · Dropout (mask + scale) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E5-dropout` · English *Dropout* · ~11 phút.
> Tiền đề: 06 (lớp nơ-ron), A16 (kỳ vọng).

## 1. Định vị
Khi huấn luyện, **tắt ngẫu nhiên** một phần nơ-ron mỗi bước (rồi scale phần còn lại) để mạng không phụ thuộc một vài nơ-ron — chống overfit.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mạng dễ "ỷ lại" vài nơ-ron mạnh (đồng thích nghi). Dropout buộc mỗi nơ-ron **tự lực** vì bạn của nó có thể
  biến mất bất cứ lúc nào → đặc trưng dư thừa, mạnh mẽ hơn, như huấn luyện một **tập hợp** mạng con.
- `.formula`:
  ```
  Huấn luyện:  h' = (mask · h) / (1 − p)      mask ∈ {0,1}, P(0) = p
  Suy luận:    dùng h nguyên (không tắt, không scale)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi bước như **điểm danh ngẫu nhiên**: p phần nơ-ron "nghỉ" (×0), số còn lại làm bù bằng cách **phóng to 1/(1−p)** để tổng kỳ vọng
> giữ nguyên. Mạng học cách hoạt động dù thiếu người → bền hơn.

## 4. Các bước
- **⓪ Cho sẵn** · pill `p=0.5`: kích hoạt h = (2, 4, 6, 8); mặt nạ rớt mẫu mask = (1, 0, 1, 0). (`.cell.given`)
- **① Áp mặt nạ** — `mask · h = (2, 0, 6, 0)` (điền). `.why`: nơ-ron bị tắt đóng góp 0 cho bước này → mạng buộc dùng nơ-ron khác.
- **② Scale 1/(1−p)** — hệ số `1/(1−0.5) = __ (2)`; `h' = 2·(2,0,6,0) = (__, 0, __, 0)` → (4, 0, 12, 0). `.hint`: phóng to để **kỳ vọng** đầu ra
  không đổi giữa train và test.
- **③ Kiểm kỳ vọng** — E[h'ᵢ] = (1−p)·(hᵢ/(1−p)) + p·0 = `hᵢ` → giữ nguyên trung bình. `.why`: nhờ scale, không cần chỉnh gì lúc suy luận.
- **④ Train vs test** · pill `chỉ train mới tắt` — `.note`: lúc **suy luận** dùng cả mạng (không tắt, không scale) → ổn định, tất định. Dropout chỉ
  là "nhiễu huấn luyện". SVG: mạng với vài nơ-ron mờ (tắt) ở train, đầy đủ ở test.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao phải scale 1/(1−p)? → `.qa` **Giữ kỳ vọng đầu ra bằng nhau giữa train và test.**
2. Lúc suy luận có tắt nơ-ron không? → `.qa` **Không — dùng cả mạng.**

## 6. Rút ra
> **Rút ra.** Dropout = tắt ngẫu nhiên + scale lúc train; như huấn luyện tập hợp mạng con → chống overfit. Bài tiếp (E6): chuẩn hóa
> kích hoạt theo batch — BatchNorm.

## 7. `data-q` & số mẫu
- Sinh h nguyên nhỏ + mask ngẫu nhiên (đúng tỉ lệ p); scale 1/(1−p).
- Khóa: `h1..h4`, `p`; `mask1..4`, `scale`, `o1..o4`.

## Phụ lục — số mẫu (p=0.5)
| | KQ |
|---|---|
| mask·h | (2, 0, 6, 0) |
| scale | 2 |
| h' | (4, 0, 12, 0) |
