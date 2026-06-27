# SPEC — A5 · Phép chiếu vectơ (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A5-phep-chieu` · English *Projection* · ~12 phút.
> Tiền đề: A2 (chuẩn), tích vô hướng (Bài 01).

## 1. Định vị
"Bóng" của vectơ a đổ lên hướng b — tách a thành **phần dọc theo b** và **phần vuông góc**. Nền của PCA, least squares,
trộn Value trong attention.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nhiều thuật toán hỏi "**a đi theo hướng b bao nhiêu?**": PCA giữ phần chiếu lên trục chính,
  hồi quy bình phương nhỏ nhất chiếu y lên không gian cột. Phép chiếu trả lời bằng một vectơ nằm trên đường b.
- `.formula`:
  ```
  proj_b(a) = ( a·b / ‖b‖² ) · b       độ dài bóng = a·b / ‖b‖
  ```

## 3. Trực giác (`.intuition`)
> Chiếu **ánh nắng vuông góc** xuống đường thẳng theo b: **bóng** của mũi tên a in trên đường đó chính là phép chiếu.
> Nắng đứng bóng ⇒ phần vuông góc bị "ép phẳng", chỉ còn phần dọc theo b.

## 4. Các bước
- **⓪ Cho sẵn** · pill `a, b`: a = (3, 4), b = (2, 1). (`.cell.given`)
- **① Tích vô hướng a·b** — `3·2 + 4·1 = __` → 10.
  `.why`: a·b đo "mức a nghiêng về b"; chia tiếp cho độ dài b để ra hệ số chiếu công bằng.
- **② ‖b‖²** — `2² + 1² = __` → 5. `.hint`: dùng **‖b‖²** (không cần căn) nên số đẹp hơn.
- **③ Hệ số & vectơ chiếu** — `k = a·b/‖b‖² = 10/5 = __` → 2; `proj = k·b = 2·(2,1) = (__, __)` → (4, 2).
  `.why`: nhân k với chính b để bóng **nằm đúng trên đường b**; k cho biết bóng dài gấp mấy lần b.
- **④ Hình học** · pill `bóng vuông góc` — SVG: a (lam), b (cam), chân vuông góc + đoạn nét đứt từ đầu a xuống đường b,
  vectơ proj (tím) dọc b. `.calc`: độ dài bóng = a·b/‖b‖ = 10/√5 ≈ __ (≈ 4.47). `.note`: phần **vuông góc** = a − proj = (−1, 2).

## 5. Tự kiểm tra (`.quiz`)
1. Phép chiếu của a lên b là một **số** hay một **vectơ**? → `.qa` **Một vectơ (nằm trên đường b).**
2. Nếu a ⟂ b thì proj_b(a) bằng gì? → `.qa` **Vectơ 0 (a·b = 0).**

## 6. Rút ra
> **Rút ra.** Phép chiếu tách a = (phần dọc b) + (phần vuông góc b). Giữ phần chiếu = nén dữ liệu theo hướng quan trọng (PCA).
> Bài tiếp (A6): chuyển vị ma trận — lật hàng↔cột, thao tác đứng sau mọi tích vô hướng theo lô.

## 7. `data-q` & số động
- Chọn b sao cho ‖b‖² chia hết a·b để k nguyên (vd b=(2,1) với a cho k=2). Random a, b có kiểm `k` nguyên & a∦b.
- Khóa: `a1,a2,b1,b2`; `dot`, `nb2`, `k`, `px,py`, `blen` (fmt2).
- SVG động; vẽ khởi tạo.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| a·b | 10 |
| ‖b‖² | 5 |
| k | 2 |
| proj_b(a) | (4, 2) |
| độ dài bóng | 10/√5 ≈ 4.47 |
