# SPEC — A4 · Cosine similarity (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A4-cosine-similarity` · English *Cosine* · ~12 phút.
> Tiền đề: A1 (vectơ), A2 (chuẩn), tích vô hướng (Bài 01).

## 1. Định vị
Đo **độ giống nhau về HƯỚNG** giữa hai vectơ, **bỏ qua độ lớn**. Là điểm số trong attention, retrieval/RAG, so khớp embedding.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Hai câu dài–ngắn khác nhau nhưng cùng chủ đề nên được coi là "giống". Tích vô hướng thuần bị
  **độ lớn lấn át**; cosine **chuẩn hóa** để chỉ còn so **hướng** → đó là cách máy đo "ngữ nghĩa gần nhau".
- `.formula`:
  ```
  cos θ = (a · b) / (‖a‖ · ‖b‖)        −1 ≤ cos θ ≤ 1
  ```

## 3. Trực giác (`.intuition`)
> Hai **mũi tên** cùng hướng → cos = **1** (rất giống); vuông góc → **0** (không liên quan); ngược hướng → **−1**
> (đối nghịch). Cosine = "đo góc", không quan tâm mũi tên dài hay ngắn.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 vectơ 2D`: a = (3, 4), b = (4, 3). (`.cell.given`)
- **① Tích vô hướng a·b** — `3·4 + 4·3 = __ + __ = __` → 12 + 12 = 24.
  `.why`: tử số đo "mức cùng chiều" thô; chưa công bằng vì vectơ dài cho số lớn.
- **② Hai chuẩn** — `‖a‖ = √(3²+4²) = __ ; ‖b‖ = √(4²+3²) = __` → 5 và 5.
  `.hint`: dùng lại Pythagore 3-4-5 từ A2.
- **③ Chia → cos θ** — `cos θ = 24 / (5·5) = 24/__ = __` → 24/25 = 0.96 → θ ≈ 16°.
  `.why`: chia cho hai chuẩn **gỡ bỏ ảnh hưởng độ lớn**; còn lại thuần là cosin của góc giữa hai hướng.
- **④ Góc nhìn hình học** · pill `θ` — SVG: hai mũi tên a (lam), b (cam) + cung góc θ. `.calc`: đối chiếu bảng
  `cos 0°=1 · cos 60°=0.5 · cos 90°=0 · cos 180°=−1`. `.note`: cos gần 1 ⇒ góc nhỏ ⇒ "giống".

## 5. Tự kiểm tra (`.quiz`)
1. Cosine khác tích vô hướng ở chỗ nào? → `.qa` **Cosine đã chuẩn hóa độ lớn — chỉ còn so hướng.**
2. cos θ = 0 nghĩa là gì? → `.qa` **Hai vectơ vuông góc (không liên quan).**

## 6. Rút ra
> **Rút ra.** Cosine = tích vô hướng **đã chuẩn hóa** → thước đo "giống về hướng" trong [−1, 1]. Mọi truy hồi ngữ nghĩa
> và điểm attention đều dựa trên ý này. Bài tiếp (A5): tách phần "bóng" của a lên b — phép chiếu.

## 7. `data-q` & số động
- Chọn cặp sao cho ‖·‖ đẹp: `pick` các hoán vị/bộ Pythagore (vd (3,4)&(4,3), (6,8)&(8,6)…), tránh song song.
- Khóa: `a1,a2,b1,b2`; `dot`, `na,nb`, `denom`, `cos`, `deg`.
- SVG động theo a,b (góc phần tư 1 cho mũi tên đẹp).

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| a·b | 24 |
| ‖a‖, ‖b‖ | 5, 5 |
| cos θ | 24/25 = 0.96 |
| θ | ≈ 16° |
