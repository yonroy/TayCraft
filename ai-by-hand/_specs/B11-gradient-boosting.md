# SPEC — B11 · Gradient Boosting — ý tưởng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B11-gradient-boosting` · English *Gradient Boosting* · ~12 phút.
> Tiền đề: B1 (hồi quy), B8/B9 (cây), A12 (đạo hàm).

## 1. Định vị
Ghép **nhiều mô hình yếu nối tiếp**: mỗi mô hình mới học **phần dư** (sai số) của tổng trước. Tinh thần của XGBoost/LightGBM.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một cây nông dự đoán dở, nhưng **cộng dồn nhiều cây**, mỗi cây sửa lỗi còn lại của cây trước, thì rất
  mạnh. Đây là chiến thắng nhiều cuộc thi ML trên dữ liệu bảng. "Gradient" vì phần dư chính là gradient của loss MSE.
- `.formula`:
  ```
  F₀ = trung bình      rₘ = y − Fₘ₋₁ (phần dư)      Fₘ = Fₘ₋₁ + η·hₘ(x)   (hₘ khớp rₘ)
  ```

## 3. Trực giác (`.intuition`)
> Như **sửa bài nhiều lượt**: dự đoán thô trước, xem **còn sai bao nhiêu** (phần dư), rồi thêm một "miếng vá" nhỏ chuyên chữa
> phần sai đó. Lặp vài lượt, mỗi lượt vá thêm một ít (×η để khỏi vá quá tay).

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 mẫu`: y = (2, 4, 9); dự đoán khởi đầu F₀ = trung bình; η = 0.5. (`.cell.given`)
- **① F₀ & phần dư** — `F₀ = (2+4+9)/3 = __ (5)`; dư `r = y − 5 = (__, __, __)` → (−3, −1, 4). `.why`: với loss MSE, **phần dư chính là
  −gradient** → "boosting theo gradient".
- **② Mô hình yếu h₁ khớp dư** — giả sử cây đơn dự đoán `h₁ = (−3, −1, 4)` (khớp đúng dư ở ví dụ tối giản). `.hint`: thực tế h₁ chỉ
  **xấp xỉ** dư, không khớp hoàn hảo.
- **③ Cập nhật F₁** — `F₁ = F₀ + η·h₁ = 5 + 0.5·(−3,−1,4) = (__, __, __)` → (3.5, 4.5, 7). `.why`: chỉ bước **một phần** (η=0.5) về phía
  đúng → giảm sai từ từ, tránh khớp quá (overfit).
- **④ Dư mới & lặp** · pill `nhỏ dần` — `r₂ = y − F₁ = (__, __, __)` → (−1.5, −0.5, 2): nhỏ hơn r₁. `.note`: lặp tiếp với h₂ khớp r₂…
  tổng các cây hội tụ về y. SVG: cột sai số thu nhỏ qua các vòng.

## 5. Tự kiểm tra (`.quiz`)
1. Mỗi mô hình mới học cái gì? → `.qa` **Phần dư (sai số) của tổng các mô hình trước.**
2. Vì sao nhân học suất η < 1? → `.qa` **Bước từ từ để tránh khớp quá, tăng khái quát.**

## 6. Rút ra
> **Rút ra.** Boosting = cộng dồn mô hình yếu, mỗi cái chữa dư của tổng trước (= đi theo gradient của loss). Hết Phần B. Sang
> Phần C (nơ-ron) — Bài tiếp: lớp tuyến tính, hàm kích hoạt, một nơ-ron.

## 7. `data-q` & số mẫu
- Sinh y nguyên nhỏ; F₀ = trung bình; η ∈ {0.5, 1}. Dư & cập nhật tính trong generate().
- Khóa: `y1..y3`, `F0`, `r1..r3`, `F1_1..F1_3`, `r2_1..r2_3`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| F₀ | 5 |
| dư r₁ | (−3, −1, 4) |
| F₁ (η=0.5) | (3.5, 4.5, 7) |
| dư r₂ | (−1.5, −0.5, 2) |
