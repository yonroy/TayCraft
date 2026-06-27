# SPEC — C10 · Softmax đầu ra (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `09-softmax` · English *Softmax* · ~13 phút.
> Tiền đề: A18 (exp), A17 (Categorical), A20 (one-hot). Dùng bảng tra eˣ.

## 1. Định vị
Biến vectơ **logit** thô thành **phân phối xác suất** (dương, tổng 1). Đầu ra chuẩn của mọi bộ phân loại đa lớp.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mạng cho ra điểm số thô (logit) có thể âm/lớn tùy ý. Softmax ép chúng về xác suất so sánh được — và ghép
  với cross-entropy cho gradient gọn `p − y` (Bài D9). Đây là "miệng nói" của mô hình.
- `.formula`:
  ```
  softmax(z)ₖ = e^zₖ / Σⱼ e^zⱼ      pₖ > 0,  Σ pₖ = 1
  ```

## 3. Trực giác (`.intuition`)
> Softmax = "**bình chọn theo hàm mũ**": logit cao hơn một chút thì xác suất **vọt** lên (vì e mũ). Nó khuếch đại kẻ dẫn đầu nhưng
> vẫn chia phần cho mọi lớp → một xúc xắc lệch (Categorical).

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `3 logit`: z = (2, 0, 1). Bảng: `e⁰=1, e¹=2.72, e²=7.39`. (`.cell.given`)
- **① Mũ hóa từng logit** — `e² = __ (7.39) ; e⁰ = __ (1) ; e¹ = __ (2.72)`. `.why`: eˣ luôn dương → bảo đảm xác suất ≥ 0; khuếch đại chênh lệch.
- **② Tổng mẫu số** — `Σ = 7.39 + 1 + 2.72 = __` → 11.11. `.hint`: mẫu số chung chuẩn hóa cho tổng = 1.
- **③ Chia → xác suất** — `p = (7.39/11.11, 1/11.11, 2.72/11.11) = (__, __, __)` → (0.67, 0.09, 0.24). Kiểm `Σ = 1`.
  `.why`: lớp logit 2 dẫn đầu chiếm 67% dù chỉ hơn 1–2 điểm — đó là tính "khuếch đại" của mũ.
- **④ Tính chất** · pill `bất biến cộng hằng` — `.note`: cộng cùng một số vào mọi logit **không đổi** softmax (tử & mẫu cùng nhân e^c) →
  thực hành **trừ max** trước khi mũ để tránh tràn số. argmax(p) = argmax(z). SVG: cột logit → cột xác suất.

## 5. Tự kiểm tra (`.quiz`)
1. Tổng các xác suất softmax bằng? → `.qa` **1.**
2. Cộng hằng số c vào mọi logit thì softmax đổi không? → `.qa` **Không — bất biến (nên trừ max cho ổn định số).**

## 6. Rút ra
> **Rút ra.** Softmax = mũ hóa rồi chuẩn hóa → phân phối lớp; khuếch đại kẻ dẫn đầu, tổng 1. Hết Phần nền K1. Sang K2 — Bài tiếp:
> đo sai số (MSE/MAE, cross-entropy) và **học** bằng gradient/backprop.

## 7. `data-q` & số mẫu
- Chọn logit là số nguyên nhỏ rơi đúng mốc bảng eˣ (0,1,2,3); tính p (làm tròn, bù tổng = 1).
- Khóa: `z1..z3`; `e1..e3`, `sumE`, `p1..p3`, `argmax`.

## Phụ lục — số mẫu
| z | (2, 0, 1) |
|---|---|
| eˣ | (7.39, 1, 2.72) |
| Σ | 11.11 |
| p | (0.67, 0.09, 0.24) |
