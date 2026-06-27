# SPEC — D7 · Backpropagation (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `12-backpropagation` · English *Backpropagation* · ~14 phút.
> Tiền đề: 10 (một bước), A13 (chuỗi), 05/07 (nơ-ron/MLP). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Lan gradient **ngược** qua một đồ thị tính toán (forward → backward) bằng quy tắc chuỗi, **tái dùng** kết quả forward. Động cơ huấn luyện.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Tính đạo hàm loss theo **từng** tham số riêng lẻ thì vô vọng. Backprop làm **một lượt ngược** cho mọi tham số
  bằng cách chuyền "trách nhiệm sai" δ về sau. Không có nó, deep learning không khả thi.
- `.formula`:
  ```
  Forward: z = w·x → a = f(z) → L = ½(a − y)²
  Backward: ∂L/∂a = a−y → ∂L/∂z = ∂L/∂a·f'(z) → ∂L/∂w = ∂L/∂z·x
  ```

## 3. Trực giác (`.intuition`)
> Tín hiệu đi **xuôi** cho dự đoán; "lỗi" đi **ngược** chia trách nhiệm. Tại mỗi nút, nhân đạo hàm cục bộ với gradient nhận từ phía
> sau (quy tắc chuỗi) → biết nút đó nên đổi thế nào.

## 4. Các bước
- **⓪ Cho sẵn (forward)** · pill `w·x → ReLU → loss`: x = 3, w = 2 → z = 6 → a = ReLU(6) = 6; nhãn y = 4; L = ½(a−y)². (`.cell.given`)
- **① Gradient tại đầu ra** — `∂L/∂a = a − y = 6 − 4 = __` → 2. `.why`: bắt đầu từ loss, đạo hàm theo đầu ra trước.
- **② Qua hàm kích hoạt** — `∂L/∂z = ∂L/∂a · ReLU'(z) = 2·1 = __` → 2. `.hint`: ReLU'(z>0)=1 nên cho gradient đi thẳng; nếu z<0 thì ×0 (chặn).
- **③ Tới trọng số** — `∂L/∂w = ∂L/∂z · x = 2·3 = __` → 6. `.why`: ∂z/∂w = x → gradient w = δ nhân **đầu vào** của nút đó.
- **④ Cập nhật & quy mô** · pill `chuỗi nhân ngược` — `w ← w − η·6`. `.note`: mạng nhiều lớp chỉ là lặp 3 bước này (δ trước = Wᵀδ ⊙ f' — Bài D8). Forward lưu lại a, z để
  backward tái dùng → rẻ. SVG: đồ thị x→z→a→L, mũi tên gradient ngược.

## 5. Tự kiểm tra (`.quiz`)
1. Backprop dựa trên quy tắc toán nào? → `.qa` **Quy tắc chuỗi (nhân đạo hàm dọc đồ thị, chạy ngược).**
2. Gradient của trọng số = ? → `.qa` **δ (gradient tại nút) nhân đầu vào của nút đó.**

## 6. Rút ra
> **Rút ra.** Backprop = forward lưu trung gian + backward nhân chuỗi ngược → gradient mọi tham số rẻ. Bài tiếp (16): chuyển sang CNN —
> một bộ lọc tích chập.

## 7. `data-q` & số mẫu
- Sinh w, x, y nguyên nhỏ (z>0 để ReLU đi thẳng, hoặc đôi khi z<0 minh họa chặn); tính forward & backward.
- Khóa: `w, x, y`; `z, a`, `dLda`, `dLdz`, `dLdw`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ∂L/∂a | 2 |
| ∂L/∂z | 2 |
| ∂L/∂w | 6 |
