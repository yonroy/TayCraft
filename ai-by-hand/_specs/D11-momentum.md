# SPEC — D11 · Momentum (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D11-momentum` · English *Momentum* · ~12 phút.
> Tiền đề: D10 (SGD).

## 1. Định vị
Thêm **quán tính**: cập nhật theo trung bình trượt của gradient. Tăng tốc theo hướng nhất quán, dập dao động.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** SGD thuần dao động mạnh ở "thung lũng hẹp" (dốc đứng một chiều, thoải chiều kia). Momentum **tích lũy**
  hướng đi → lăn nhanh dọc thung lũng, triệt tiêu dao động ngang → hội tụ nhanh và êm hơn.
- `.formula`:
  ```
  v ← β·v + g      w ← w − η·v      (β ≈ 0.9, v khởi tạo 0)
  ```

## 3. Trực giác (`.intuition`)
> Như **viên bi có khối lượng** lăn xuống dốc: nó không đổi hướng tức thì theo mỗi gradient mà **giữ đà** từ các bước trước. Hướng
> đi nhất quán được cộng dồn (nhanh dần); hướng đổi qua-lại bị **triệt tiêu**.

## 4. Các bước
- **⓪ Cho sẵn** · pill `β=0.9, η=0.1`: trọng số w₀ = 1.0; gradient các bước g₁ = 2, g₂ = 2, g₃ = 2; vận tốc v₀ = 0. (`.cell.given`)
- **① Bước 1** — `v₁ = 0.9·0 + 2 = __ (2) ; w₁ = 1.0 − 0.1·2 = __` → 0.8. `.why`: bước đầu giống SGD vì chưa có đà tích lũy.
- **② Bước 2** — `v₂ = 0.9·2 + 2 = __ (3.8) ; w₂ = 0.8 − 0.1·3.8 = __` → 0.42. `.hint`: v lớn dần khi gradient cùng dấu → **tăng tốc**.
- **③ Bước 3** — `v₃ = 0.9·3.8 + 2 = __ (5.42) ; w₃ = 0.42 − 0.1·5.42 = __` → −0.12. `.why`: cùng gradient 2 nhưng bước ngày càng dài — đó là quán tính.
- **④ Dập dao động** · pill `triệt tiêu ngang` — `.note`: nếu gradient đổi dấu liên tục (+2, −2, +2…), v gần như **triệt tiêu** → không dao động.
  Momentum vừa tăng tốc hướng ổn định vừa làm êm hướng nhiễu. SVG: quỹ đạo SGD răng cưa vs momentum mượt trong thung lũng.

## 5. Tự kiểm tra (`.quiz`)
1. Momentum tích lũy cái gì? → `.qa` **Trung bình trượt của gradient (vận tốc v).**
2. Khi gradient đổi dấu liên tục, v ra sao? → `.qa` **Bị triệt tiêu → dập dao động.**

## 6. Rút ra
> **Rút ra.** Momentum: v ← βv + g, w ← w − ηv; tăng tốc hướng nhất quán, dập dao động. Nhưng mọi tham số dùng chung η → Bài tiếp
> (D12): **RMSProp** chia tỉ lệ học theo từng tham số.

## 7. `data-q` & số mẫu
- Sinh w₀, β, η, và chuỗi gradient (cùng dấu để thấy tăng tốc); tính 3 bước.
- Khóa: `w0`, `beta`, `eta`, `g1,g2,g3`; `v1,v2,v3`, `w1,w2,w3`.

## Phụ lục — số mẫu
| bước | v | w |
|---|---|---|
| 1 | 2 | 0.8 |
| 2 | 3.8 | 0.42 |
| 3 | 5.42 | −0.12 |
