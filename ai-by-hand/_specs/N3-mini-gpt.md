# SPEC — N3 · Mini-GPT: 2 token, sinh 1 token (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `N3-mini-gpt` · English *Mini-GPT* · ~16 phút.
> Tiền đề: 19 (embedding), 11/14 (self-attention + mask), H11 (FFN), 09 (softmax). **Capstone — có thể 3 trang.** Dùng bảng eˣ.

## 1. Định vị
Chạy **trọn forward một GPT tí hon**: 2 token vào → embedding → self-attention (causal) → FFN → logits → softmax → **sinh token kế**. Ráp Phần H.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là LLM thu nhỏ làm tay được từ id token tới token sinh ra. Thấy rõ cách mọi mảnh attention ghép thành "máy
  đoán chữ kế". Hiểu nó là nắm xương sống của ChatGPT.
- `.formula`:
  ```
  token → Embed+PE → [Self-Attn (causal) → FFN] → logits → softmax → argmax = token kế
  ```

## 3. Trực giác (`.intuition`)
> Hai token đã có → mô hình **trộn ngữ cảnh** (token cuối nhìn lại các token trước qua attention), **xử lý** (FFN), rồi **chấm điểm** mọi
> token từ điển → chọn token điểm cao nhất làm chữ kế. Lặp = viết câu.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `2 token, từ điển 3`: embedding+PE cho token cuối ra vectơ q; (rút gọn) điểm attention token cuối với [t₁, t₂] đã chia √d = (0, 1); V cho sẵn; logits cuối z=(2,0,1). Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Self-attention (causal)** — softmax điểm (0,1): `e⁰=1,e¹=2.72,Σ=3.72 → α=(__, __)` → (0.27, 0.73); trộn V → vectơ ngữ cảnh. `.why`: token cuối chú ý token trước + chính nó (mask cho thấy quá khứ).
- **② FFN** — vectơ ngữ cảnh qua giãn-ReLU-nén (Bài H11) → biểu diễn token cuối. `.hint`: xử lý phi tuyến trên từng vị trí.
- **③ Logits → softmax** — `z=(2,0,1) → softmax = (__, __, __)` → (0.67, 0.09, 0.24). `.why`: điểm cho từng token từ điển = "khả năng là chữ kế".
- **④ Sinh token** · pill `argmax` — `argmax = token __` → token 1; nối vào chuỗi → lặp (với KV cache, H10). `.note`: greedy (I8) hoặc sampling (I2) để chọn; đây là một bước của vòng sinh. SVG: token1,token2 → khối → logits → token3.

## 5. Tự kiểm tra (`.quiz`)
1. Mini-GPT chọn token kế bằng gì? → `.qa` **Softmax logits rồi argmax (hoặc lấy mẫu).**
2. Mask causal đảm bảo điều gì? → `.qa` **Token chỉ nhìn quá khứ — không thấy token tương lai.**

## 6. Rút ra
> **Rút ra.** Mini-GPT = Embed+PE → (attention causal → FFN) → logits → chọn token kế; lặp để sinh. Bài tiếp (N4): theo dõi hội tụ của logistic regression.

## 7. `data-q` & số mẫu
- Chọn điểm attention & logits rơi mốc bảng eˣ; 2 token, từ điển 3.
- Khóa: `a1,a2` (chú ý), `z1..z3`, `p1..p3`, `next`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| α (attention) | (0.27, 0.73) |
| softmax logits | (0.67, 0.09, 0.24) |
| token kế | token 1 |
