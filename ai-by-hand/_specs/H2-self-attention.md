# SPEC — H2 · Self-Attention (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `11-self-attention` · English *Self-Attention* · ~14 phút.
> Tiền đề: H1 (scaled dot-product), 01, 09. **Đã có phiếu** — spec để nâng cấp/tái tạo. Dùng bảng eˣ.

## 1. Định vị
Self-attention: Q, K, V **đều sinh từ cùng một chuỗi** → mỗi token nhìn mọi token khác (kể cả chính nó) để gom ngữ cảnh.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là lớp lõi của Transformer: mỗi từ tự "hỏi" mọi từ trong câu xem ai liên quan → gom thông tin. Phá giới
  hạn tuần tự, học quan hệ xa (đại từ ↔ danh từ cách nhiều từ).
- `.formula`:
  ```
  Q = X·Wq, K = X·Wₖ, V = X·Wᵥ        out = softmax(Q·Kᵀ/√dₖ)·V    (X = cùng chuỗi)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi token phát một **câu hỏi** (Q), mang một **nhãn** (K) và một **nội dung** (V). Token i so câu hỏi của mình với nhãn mọi token →
> trọng số chú ý → trộn nội dung tương ứng. "Self" vì hỏi và trả lời đều trong cùng câu.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `2 token, dₖ=4`: token reps x₁, x₂; lấy Q=K=V=X (Wq,Wk,Wv = I). q₁·k₁=2, q₁·k₂=0 (đã chia √4). Bảng: e⁰=1, e¹=2.72. (`.cell.given`)
- **① Điểm của token 1** — đã chia √dₖ: (2/2, 0/2) = `(1, 0)`. `.why`: token 1 khớp chính nó mạnh, khớp token 2 yếu.
- **② Softmax** — `e¹=2.72, e⁰=1, Σ=3.72 → α₁ = (__, __)` → (0.73, 0.27). `.hint`: trọng số chú ý của token 1 lên [token1, token2].
- **③ Trộn V → out₁** — `out₁ = 0.73·v₁ + 0.27·v₂`. `.why`: đầu ra token 1 = hỗn hợp ngữ cảnh, nghiêng về token liên quan.
- **④ Lặp cho mọi token** · pill `ma trận` — `.note`: làm song song cho token 2 → cả lớp là **một phép ma trận** softmax(QKᵀ/√d)·V. Thêm nhiều đầu (Bài 18), mask (14). SVG: 2 token, mũi tên chú ý có độ đậm theo α.

## 5. Tự kiểm tra (`.quiz`)
1. "Self" trong self-attention nghĩa là gì? → `.qa` **Q, K, V cùng sinh từ một chuỗi (token tự hỏi các token trong câu).**
2. Token i lấy thông tin từ đâu? → `.qa` **Trộn V của mọi token theo trọng số chú ý (softmax điểm Q·K).**

## 6. Rút ra
> **Rút ra.** Self-attention = mỗi token trộn V cả câu theo độ liên quan Q·K; lõi của Transformer. Bài tiếp (13): ghép attention + FFN + LN + residual thành khối.

## 7. `data-q` & số mẫu
- Chọn điểm/√d rơi mốc bảng eˣ; token reps nhỏ.
- Khóa: `x1, x2`; `s1, s2`, `a1, a2`, out.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| điểm /√d (tok1) | (1, 0) |
| α₁ | (0.73, 0.27) |
