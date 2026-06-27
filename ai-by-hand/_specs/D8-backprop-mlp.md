# SPEC — D8 · Backprop qua MLP nhiều lớp (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D8-backprop-mlp` · English *Backprop MLP* · ~15 phút.
> Tiền đề: 07 (MLP forward), A13 (chuỗi), 12 (backprop). Có thể cần 2–3 trang (dài).

## 1. Định vị
Lan gradient **ngược** từ loss qua từng lớp MLP để cập nhật mọi W, b. Áp quy tắc chuỗi một cách có tổ chức.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Forward cho dự đoán; **backward cho hướng sửa**. Backprop = quy tắc chuỗi chạy ngược, tái dùng kết quả
  trung gian → tính gradient cho cả triệu tham số một lượt. Đây là trái tim huấn luyện.
- `.formula`:
  ```
  δ_ra = ∂L/∂y      ∂L/∂W = δ ⊗ (đầu vào lớp)      δ_trước = (Wᵀδ) ⊙ f'(z)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi lớp nhận **"trách nhiệm sai"** δ từ lớp sau, dùng nó để (1) tính gradient trọng số của mình, (2) chuyển bớt trách nhiệm về
> lớp trước qua Wᵀ, nhân với đạo hàm kích hoạt cục bộ. Cứ thế chảy ngược tới đầu.

## 4. Các bước
- **⓪ Cho sẵn (forward đã có)** · pill `2→2→1`: x=(1,2); ẩn z=(3,−1)→h=ReLU=(3,0); ra y=2; mục tiêu t=1, loss `L=½(y−t)²`. (`.cell.given`)
- **① δ lớp ra** — `δ = ∂L/∂y = y − t = 2 − 1 = __` → 1. `.why`: với MSE, đạo hàm loss theo đầu ra = sai số.
- **② Gradient lớp 2** — `∂L/∂W₂ = δ·h = (1·3, 1·0) = (__, __) (3,0) ; ∂L/∂b₂ = δ = __` → 1. `.hint`: gradient W = δ nhân **đầu vào lớp đó** (ở đây là h).
- **③ Lan về lớp ẩn** — `δ_ẩn = (W₂ᵀδ) ⊙ ReLU'(z) = (1·1, 2·1) ⊙ (1, 0) = (__, __)` → (1, 0). `.why`: nhân Wᵀ chuyển trách nhiệm ngược; ⊙ReLU' **chặn**
  qua nơ-ron đã tắt (z₂<0 → 0).
- **④ Gradient lớp 1** — `∂L/∂W₁ = δ_ẩn ⊗ x = [[1·1, 1·2], [0·1, 0·2]] = [[__,__],[__,__]]` → [[1,2],[0,0]]. `.note`: hàng ứng nơ-ron tắt = 0
  → không cập nhật. Cập nhật mọi tham số: `W ← W − η·∂L/∂W`.

## 5. Tự kiểm tra (`.quiz`)
1. δ truyền ngược qua trọng số bằng phép gì? → `.qa` **Nhân Wᵀ (chuyển vị) rồi ⊙ đạo hàm kích hoạt.**
2. Vì sao hàng gradient của nơ-ron ReLU tắt = 0? → `.qa` **ReLU'(z<0)=0 chặn gradient qua nơ-ron đó.**

## 6. Rút ra
> **Rút ra.** Backprop = δ chảy ngược: gradient W = δ⊗đầu-vào, δ trước = Wᵀδ ⊙ f'. Tái dùng forward → rẻ. Bài tiếp (D9): trường hợp
> đặc biệt cực gọn — backprop qua **softmax + cross-entropy**.

## 7. `data-q` & số mẫu
- Tái dùng forward (Bài 07); sinh W, x, t nguyên nhỏ; tính δ và mọi gradient trong generate().
- Khóa: forward (`z1,z2,h1,h2,y`); `delta`, `gW2_1,gW2_2,gb2`; `dh1,dh2`; `gW1_11..gW1_22`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| δ_ra | 1 |
| ∂L/∂W₂ | (3, 0) |
| δ_ẩn | (1, 0) |
| ∂L/∂W₁ | [[1,2],[0,0]] |
