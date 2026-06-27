# SPEC — D9 · Backprop qua Softmax + CE (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D9-backprop-softmax-ce` · English *Backprop softmax+CE* · ~12 phút.
> Tiền đề: 09 (softmax), 17 (cross-entropy), A20 (one-hot).

## 1. Định vị
Gradient của cross-entropy theo **logit** khi đi qua softmax rút gọn thành **`p − y`** — đẹp đến bất ngờ. Lý do cặp này luôn đi cùng nhau.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Riêng đạo hàm softmax rất rối (ma trận Jacobian K×K), riêng −ln cũng phiền; nhưng **ghép lại** thì mọi thứ
  triệt tiêu, còn `p − y`. Nhờ vậy lớp đầu ra phân loại có gradient tính tức thì, ổn định số.
- `.formula`:
  ```
  p = softmax(z)      L = −Σ yₖ ln pₖ  (y one-hot)      ∂L/∂zₖ = pₖ − yₖ
  ```

## 3. Trực giác (`.intuition`)
> "Trách nhiệm sai" của mỗi logit = **dự đoán trừ sự thật**: lớp đúng (y=1) bị kéo xuống `p−1` (âm → tăng logit đó), các lớp sai
> (y=0) bị đẩy `p` (dương → giảm logit). Mạng tự "nâng đúng, hạ sai".

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 lớp`: logit z = (2, 0, 1) → softmax p = (0.67, 0.09, 0.24); nhãn đúng = lớp 1 → one-hot y = (1, 0, 0). (`.cell.given`)
- **① Loss** — `L = −ln p₁ = −ln(0.67) = __` → 0.40. `.why`: chỉ lớp đúng đóng góp (các yₖ khác = 0).
- **② Gradient từng logit = p − y** — `∂L/∂z₁ = 0.67 − 1 = __ (−0.33) ; ∂L/∂z₂ = 0.09 − 0 = __ (0.09) ; ∂L/∂z₃ = 0.24 − 0 = __` → 0.24.
  `.hint`: chỉ cần lấy p rồi trừ one-hot — không Jacobian, không log đạo hàm.
- **③ Kiểm tổng = 0** — `−0.33 + 0.09 + 0.24 = __` → 0. `.why`: tổng gradient logit luôn 0 (softmax giữ tổng xác suất = 1) → một sanity check tốt.
- **④ Cập nhật** · pill `nâng đúng hạ sai` — `z ← z − η·(p−y)`: lớp 1 (grad âm) → logit **tăng**; lớp 2,3 → logit **giảm**. `.note`: đây là gradient
  vào tiếp tục backprop xuống các lớp trước (Bài D8). SVG: cột p, cột y, cột (p−y).

## 5. Tự kiểm tra (`.quiz`)
1. ∂(CE∘softmax)/∂logit bằng gì? → `.qa` **p − y (dự đoán trừ one-hot).**
2. Tổng các gradient logit bằng bao nhiêu? → `.qa` **0.**

## 6. Rút ra
> **Rút ra.** Softmax + CE → gradient `p − y` cực gọn, ổn định; nâng lớp đúng, hạ lớp sai. Bài tiếp (D10): dùng gradient để cập nhật
> — **SGD** trên một mini-batch.

## 7. `data-q` & số mẫu
- Tái dùng logit/softmax Bài 09; chọn nhãn đúng ngẫu nhiên; p−y tính trong generate().
- Khóa: `z1..z3, p1..p3`, `tidx`; `loss`; `g1..g3`; tổng kiểm.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| L | 0.40 |
| p − y | (−0.33, 0.09, 0.24) |
| Σ grad | 0 |
