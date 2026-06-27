# SPEC — A2 · Độ dài & chuẩn (L1, L2) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A2-do-dai-chuan` · English *Norm (L1, L2)* · ~12 phút.

## 1. Định vị
Đo **độ lớn** của một vectơ — một con số. L2 (Euclid) xuất hiện ở loss, chuẩn hóa, weight decay; L1 (Manhattan) gắn với
*sparsity*/regularization. Cần cho A4 (cosine) và A19 (chuẩn hóa).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nhiều thuật toán hỏi "vectơ này **lớn** cỡ nào?": độ lớn gradient để biết bước học, độ dài
  embedding để chuẩn hóa, khoảng cách giữa hai điểm để phân cụm. **Chuẩn** trả lời câu đó bằng một số ≥ 0.
- `.formula`:
  ```
  ‖x‖₂ = √(x₁² + x₂² + … + xₙ²)        ‖x‖₁ = |x₁| + |x₂| + … + |xₙ|
  ```

## 3. Trực giác (`.intuition`)
> **L2** = đường **chim bay** (đo thẳng, định lý Pythagore). **L1** = đi theo **ô bàn cờ** (chỉ ngang/dọc, như taxi ở
> Manhattan). Cùng một vectơ, L1 ≥ L2 vì đường gấp khúc luôn dài hơn đường thẳng.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 vectơ`: x = (3, 4) cho hình 2D; thêm y = (2, −3, 6) cho phần nhiều chiều. (`.cell.given`)
- **① Bình phương từng ô (L2)** · pill `chuẩn bị` — `3² = __ ; 4² = __` → 9, 16.
  `.why`: bình phương **bỏ dấu** và phạt mạnh thành phần lớn — nên L2 nhạy với giá trị ngoại lệ.
- **② Cộng & lấy căn → ‖x‖₂** — `√(9 + 16) = √__ = __` → √25 = 5.
  `.hint`: chọn số là bộ ba Pythagore (3-4-5) để căn ra số đẹp.
- **③ L1 = tổng trị tuyệt đối** — `|3| + |4| = __` → 7; với y: `|2|+|−3|+|6| = __` → 11.
  `.why`: L1 cộng "quãng đường tuyệt đối"; vì không bình phương nên **ít phạt ngoại lệ**, hay dùng để ép trọng số về 0.
- **④ Pythagore (hình)** · pill `tam giác vuông` — SVG: vectơ x=(3,4) trên lưới, hình chiếu 3 (ngang) + 4 (dọc),
  cạnh huyền = ‖x‖₂. `.calc`: cạnh huyền = √(3²+4²) = __. `.note`: chuẩn L2 **chính là** chiều dài cạnh huyền.

## 5. Tự kiểm tra (`.quiz`)
1. Chuẩn của một vectơ có thể âm không? → `.qa` **Không — luôn ≥ 0 (= 0 chỉ khi vectơ 0).**
2. "Vectơ đơn vị" là vectơ có chuẩn bằng bao nhiêu? → `.qa` **Bằng 1.**

## 6. Rút ra
> **Rút ra.** Chuẩn biến một vectơ thành **một số đo độ lớn**. Chia vectơ cho chuẩn của nó → **vectơ đơn vị** (chỉ còn hướng).
> Bài tiếp (A4): dùng chuẩn để đo **độ giống nhau về hướng** giữa hai vectơ (cosine).

## 7. `data-q` & số động
- Để số đẹp: random từ tập bộ Pythagore `pick([[3,4],[6,8],[5,12],[8,15]])` cho x (2D); y = 3 số nguyên nhỏ.
- Khóa: `x1,x2` + `y1..y3`; `sq1,sq2`, `sum2, L2`; `L1x, L1y`.
- SVG động theo (x1,x2); vẽ khởi tạo 1 lần.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| x = (3,4): ‖x‖₂ | √25 = 5 |
| x: ‖x‖₁ | 7 |
| y = (2,−3,6): ‖y‖₁ | 11 |
| y: ‖y‖₂ | √49 = 7 |
