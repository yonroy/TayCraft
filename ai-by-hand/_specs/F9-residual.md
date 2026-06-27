# SPEC — F9 · Kết nối tắt (Residual / skip) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F9-residual` · English *Residual* · ~12 phút.
> Tiền đề: 08 (mạng sâu), E2 (vanishing), D8 (backprop).

## 1. Định vị
**y = F(x) + x**: cộng thẳng đầu vào vào đầu ra khối. Cho gradient một "đường cao tốc" → huấn luyện được mạng **rất sâu** (ResNet).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mạng càng sâu càng khó học (vanishing). Residual cho mỗi khối chỉ cần học **phần dư** F(x) = (cái cần thêm)
  thay vì cả ánh xạ; và đường +x giúp gradient chảy thẳng về lớp đầu **không bị nhân teo**. Nhờ nó mới có mạng 100+ lớp.
- `.formula`:
  ```
  y = F(x) + x      ∂y/∂x = ∂F/∂x + 1   (số hạng "+1" giữ gradient sống)
  ```

## 3. Trực giác (`.intuition`)
> Cho khối một **đường tắt**: nếu lớp đó "không cần làm gì", nó chỉ việc để F(x)=0 và **truyền nguyên x** (học hàm đồng nhất rất dễ).
> Khi backprop, "+1" bảo đảm gradient **luôn có một lối về** dù các lớp giữa làm teo.

## 4. Các bước
- **⓪ Cho sẵn** · pill `khối F`: đầu vào x = (2, −1); khối tính F(x) = (1, 3); mục tiêu xét backprop. (`.cell.given`)
- **① Đầu ra residual** — `y = F(x) + x = (1+2, 3+(−1)) = (__, __)` → (3, 2). `.why`: cộng thẳng x → khối chỉ cần học phần "thêm vào" so với x.
- **② Gradient qua khối** — `∂y/∂x = ∂F/∂x + 1`. Giả sử ∂F/∂x ≈ 0 (lớp giữa teo): `∂y/∂x ≈ __` → 1. `.hint`: số hạng "+1" từ đường tắt.
- **③ Vì sao chống vanishing** — qua L khối, gradient ≈ ∏(∂Fₗ + 1) ≈ **giữ ~1** dù mỗi ∂Fₗ nhỏ. `.why`: khác mạng thường (∏ số <1 → 0), đường tắt giữ tín hiệu.
- **④ Điều kiện cộng** · pill `khớp shape` — `.note`: x và F(x) phải **cùng kích thước**; nếu đổi kênh/space thì dùng 1×1 conv (F7) ở nhánh tắt. SVG: x → [F] →
  (+) ← x, mũi tên gradient theo đường tắt.

## 5. Tự kiểm tra (`.quiz`)
1. Số hạng "+1" trong ∂y/∂x đến từ đâu? → `.qa` **Đường tắt cộng x (identity).**
2. Vì sao residual giúp mạng rất sâu? → `.qa` **Gradient có lối về thẳng, không bị nhân teo → chống vanishing.**

## 6. Rút ra
> **Rút ra.** Residual y=F(x)+x cho gradient đường cao tốc & khối học phần dư → mạng cực sâu train được. Bài tiếp (F10): đếm tham
> số một lớp conv.

## 7. `data-q` & số mẫu
- Sinh x, F(x) nguyên nhỏ; cộng residual; minh họa ∂y/∂x = ∂F/∂x + 1.
- Khóa: `x1,x2`, `f1,f2`; `y1,y2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| y = F(x)+x | (3, 2) |
| ∂y/∂x (F teo) | ≈ 1 |
