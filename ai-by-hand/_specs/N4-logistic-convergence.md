# SPEC — N4 · Logistic regression hội tụ (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `N4-logistic-convergence` · English *Logistic convergence* · ~15 phút.
> Tiền đề: B3 (logistic), 10/D10 (gradient/SGD). **Capstone.** Dùng bảng σ/ln.

## 1. Định vị
Chạy **nhiều bước gradient descent** cho hồi quy logistic và **quan sát loss giảm dần → hội tụ**. Thấy "huấn luyện" diễn ra qua thời gian.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một bước (B3) chỉ là lát cắt; **chuỗi bước** mới cho thấy mô hình **học**: loss đi xuống, xác suất đúng tăng, trọng
  số ổn định. Đây là bức tranh "đường cong huấn luyện" mà ai làm ML cũng nhìn mỗi ngày.
- `.formula`:
  ```
  z = wx + b,  p = σ(z),  L = −ln p (y=1)        w ← w − η·(p−y)·x   (lặp)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi bước nhích w theo gradient `(p−y)x` → p tiến về nhãn → loss `−ln p` giảm. Vẽ loss theo bước ra **đường cong đi xuống**, thoải dần khi
> gần đáy (gradient nhỏ lại). "Hội tụ" = loss gần như không giảm nữa.

## 4. Các bước
- **⓪ Cho sẵn + bảng σ** · pill `η=1, x=1, y=1`: w₀ = 0, b = 0. Bảng σ: σ(0)=0.5, σ(0.5)=0.62, σ(0.8)=0.69, σ(1)=0.73; ln: −ln0.5=0.69, −ln0.62=0.48, −ln0.69=0.37. (`.cell.given`)
- **① Bước 1** — `z=0 → p=σ(0)=0.5; L=−ln0.5=__ (0.69)`; grad `(p−y)x=(0.5−1)·1=−0.5 → w ← 0 − 1·(−0.5) = __` → 0.5. `.why`: p thấp (0.5) cho nhãn 1 → loss cao → bước kéo w lên.
- **② Bước 2** — `z=0.5 → p=0.62; L=−ln0.62=__ (0.48)`; `w ← 0.5 − (0.62−1) = 0.5+0.38 = __` → 0.88. `.hint`: loss đã giảm 0.69 → 0.48; w tăng tiếp.
- **③ Bước 3** — `z≈0.88 → p≈0.69; L=−ln0.69=__` → 0.37. `.why`: loss tiếp tục giảm nhưng **chậm dần** (gradient p−y nhỏ lại) → dấu hiệu sắp hội tụ.
- **④ Đường cong & hội tụ** · pill `loss ↓ thoải` — `.note`: vẽ L theo bước (0.69 → 0.48 → 0.37 → …) → đi xuống, thoải dần. η quá lớn → dao động; quá nhỏ → bò chậm. SVG: đường cong loss giảm dần.

## 5. Tự kiểm tra (`.quiz`)
1. "Hội tụ" thể hiện thế nào trên đường loss? → `.qa` **Loss giảm dần rồi gần như không đổi (phẳng).**
2. Vì sao bước càng về sau đổi w càng ít? → `.qa` **Gradient (p−y) nhỏ dần khi p tiến về nhãn.**

## 6. Rút ra
> **Rút ra.** Lặp gradient descent → loss giảm dần → hội tụ; đó là "huấn luyện". **Hết Phần N & khóa K4 — trọn bộ lộ trình.** Bạn đã đi từ
> tích vô hướng (Bài 01) tới một mô hình học hoàn chỉnh, tất cả bằng số thật trên giấy.

## 7. `data-q` & số mẫu
- Chọn x, y, η, w₀ sao cho z mỗi bước rơi mốc bảng σ; chạy 3 bước.
- Khóa: `w0`; `p1,L1,w1`, `p2,L2,w2`, `p3,L3`.

## Phụ lục — số mẫu (η=1, x=1, y=1)
| bước | p | L | w mới |
|---|---|---|---|
| 1 | 0.5 | 0.69 | 0.5 |
| 2 | 0.62 | 0.48 | 0.88 |
| 3 | 0.69 | 0.37 | — |
