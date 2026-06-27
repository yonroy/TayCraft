# SPEC — C4 · Hàm kích hoạt (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `04-ham-kich-hoat` · English *Activation* · ~12 phút.
> Tiền đề: 03 (lớp tuyến tính), C2/C3 (sigmoid/tanh).

## 1. Định vị
Phi tuyến đặt **sau** lớp tuyến tính để mạng học quan hệ "cong". ReLU là lựa chọn mặc định hiện đại.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Chồng nhiều lớp tuyến tính vẫn chỉ ra **một lớp tuyến tính**. Hàm kích hoạt phá tuyến tính → mạng mới
  xấp xỉ được hàm bất kỳ. Không có nó, mạng sâu vô nghĩa.
- `.formula`:
  ```
  ReLU(z) = max(0, z)      LeakyReLU(z) = z nếu z>0, αz nếu z≤0      ReLU'(z) = 1 (z>0), 0 (z<0)
  ```

## 3. Trực giác (`.intuition`)
> ReLU như một **van một chiều**: cho tín hiệu dương đi thẳng, chặn tín hiệu âm về 0. Đơn giản, đạo hàm 0/1 → gradient không
> teo (khác sigmoid), nên huấn luyện mạng sâu nhanh.

## 4. Các bước
- **⓪ Cho sẵn** · pill `vectơ z`: z = (3, −2, 0, 5, −1) (đầu ra một lớp tuyến tính). (`.cell.given`)
- **① ReLU từng phần tử** — `max(0,·)`: `(3, 0, 0, 5, 0)` (điền). `.why`: cắt mọi giá trị âm về 0 → tạo "tính thưa" (nhiều 0) và phi tuyến.
- **② Đạo hàm ReLU** — tại mỗi z: `z>0 → 1, z<0 → 0`: `(1, 0, ?, 1, 0)`. `.hint`: tại z=0 đạo hàm không xác định; thực hành lấy 0 (hoặc 1).
- **③ LeakyReLU (α=0.1)** — phần âm rò một chút: `z=−2 → 0.1·(−2) = __ (−0.2)`. `.why`: cho gradient nhỏ ở vùng âm → tránh "nơ-ron chết"
  (ReLU kẹt ở 0 mãi).
- **④ Vì sao cần phi tuyến** · pill `phá tuyến tính` — `.note`: hai lớp tuyến tính W₂(W₁x) = (W₂W₁)x vẫn tuyến tính; chèn ReLU ở giữa
  thì không gộp lại được → mạng "gấp khúc" được mặt quyết định. SVG: ReLU, LeakyReLU, sigmoid cạnh nhau.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao cần hàm kích hoạt? → `.qa` **Phá tuyến tính — nếu không, mạng sâu chỉ là một lớp tuyến tính.**
2. ReLU lợi gì so với sigmoid khi mạng sâu? → `.qa` **Đạo hàm 1 ở vùng dương → không bị vanishing gradient.**

## 6. Rút ra
> **Rút ra.** Kích hoạt = phi tuyến giúp mạng học hàm phức tạp; ReLU đơn giản & chống vanishing. Bài tiếp (05): ghép tuyến tính +
> kích hoạt thành **một nơ-ron** hoàn chỉnh.

## 7. `data-q` & số mẫu
- Sinh vectơ z nguyên nhỏ có cả âm/dương/0; α ∈ {0.1, 0.2}.
- Khóa: `z1..z5`; `r1..r5` (ReLU); `d1..d5` (đạo hàm); `leakyNeg`.

## Phụ lục — số mẫu
| z | (3,−2,0,5,−1) |
|---|---|
| ReLU | (3,0,0,5,0) |
| ReLU' | (1,0,·,1,0) |
| Leaky(−2) | −0.2 |
