# SPEC — C8 · Mạng sâu / rộng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `08-sau-rong` · English *Deep vs Wide* · ~12 phút.
> Tiền đề: 07 (MLP), C9 (đếm tham số).

## 1. Định vị
Đánh đổi **sâu** (nhiều lớp) vs **rộng** (nhiều nơ-ron mỗi lớp): cùng ngân sách tham số, kiến trúc nào học tốt hơn?

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Thiết kế mạng là chọn sâu hay rộng. Mạng **sâu** xây đặc trưng **phân cấp** (tái dùng), thường mạnh hơn
  mạng rộng cùng số tham số — nhưng khó huấn luyện hơn (vanishing gradient, cần residual/normalize).
- `.formula`:
  ```
  params(lớp) = in·out + out      Sâu: nhiều lớp nhỏ · Rộng: ít lớp nhưng to
  ```

## 3. Trực giác (`.intuition`)
> **Rộng** = một hội đồng khổng lồ trả lời trong một lượt. **Sâu** = nhiều lượt, mỗi lượt tinh chỉnh ý của lượt trước. Sâu tái sử
> dụng đặc trưng nên "tiết kiệm" hơn cho cùng độ phức tạp — nhưng tín hiệu phải đi qua nhiều tầng.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 thiết kế`: đầu vào 4, đầu ra 1. **A (rộng):** 4→16→1. **B (sâu):** 4→6→6→1. (`.cell.given`)
- **① Tham số mạng rộng A** — `(4·16+16) + (16·1+1) = 80 + 17 = __` → 97. `.why`: lớp rộng đơn tốn nhiều tham số ở chỗ in×out lớn.
- **② Tham số mạng sâu B** — `(4·6+6)+(6·6+6)+(6·1+1) = 30 + 42 + 7 = __` → 79. `.hint`: nhiều lớp nhỏ có thể **ít tham số hơn** mà sâu hơn.
- **③ So sánh** — B sâu hơn (3 lớp vs 2) **và** ít tham số hơn (79 < 97). `.why`: chiều sâu cho phép biểu diễn phân cấp; cùng "sức",
  mạng sâu thường cần ít nơ-ron hơn theo cấp số nhân.
- **④ Cái giá của sâu** · pill `khó train` — `.note`: tín hiệu/gradient qua nhiều lớp dễ **teo hoặc nổ** (Bài E2); cần khởi tạo tốt (E1),
  normalize (E6/20), **residual** (F9). SVG: hai sơ đồ A & B cạnh nhau.

## 5. Tự kiểm tra (`.quiz`)
1. Lợi thế chính của mạng sâu? → `.qa` **Biểu diễn đặc trưng phân cấp, tái dùng — hiệu quả tham số hơn.**
2. Khó khăn khi tăng độ sâu? → `.qa` **Vanishing/exploding gradient → cần normalize, residual, init tốt.**

## 6. Rút ra
> **Rút ra.** Sâu vs rộng là đánh đổi: sâu mạnh & tiết kiệm tham số nhưng khó train. Bài tiếp (09): biến đầu ra mạng thành **phân
> phối xác suất** bằng softmax.

## 7. `data-q` & số mẫu
- Sinh kích thước các lớp cho hai thiết kế; tính tổng params mỗi bên.
- Khóa: kích thước lớp; `paramsA`, `paramsB`, chênh lệch.

## Phụ lục — số mẫu
| | params |
|---|---|
| A rộng 4→16→1 | 97 |
| B sâu 4→6→6→1 | 79 |
