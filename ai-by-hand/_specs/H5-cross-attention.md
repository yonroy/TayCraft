# SPEC — H5 · Cross-Attention (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `15-cross-attention` · English *Cross-Attention* · ~13 phút.
> Tiền đề: 11 (self-attention), G7 (seq2seq), H1. **Đã có phiếu** — spec để nâng cấp/tái tạo. Dùng bảng eˣ.

## 1. Định vị
Attention nối **hai chuỗi**: Q từ decoder (bên cần), K & V từ encoder (bên nguồn). Cách decoder "nhìn lại" câu nguồn khi dịch.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Dịch/tóm tắt cần decoder **tra cứu câu gốc** ở mỗi bước sinh. Cross-attention thay nút thắt cổ chai của seq2seq
  (một vectơ c, Bài G7) bằng "nhìn mọi token nguồn" → bước nhảy chất lượng dẫn tới Transformer. Cũng là cách nối **đa phương thức** (ảnh↔chữ).
- `.formula`:
  ```
  Q = decoder,  K = V = encoder        out = softmax(Q·Kᵀ/√dₖ)·V
  ```

## 3. Trực giác (`.intuition`)
> Decoder đang viết từ kế **hỏi** (Q) toàn bộ câu nguồn (K) xem chỗ nào liên quan, rồi lấy **nội dung** (V) ở đó. Như dịch giả vừa viết
> vừa **liếc lại** câu gốc, tập trung vào từ đang cần dịch.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `1 query, 2 nguồn, dₖ=4`: q (decoder) = (2,0); encoder k₁=(1,0),k₂=(0,1); v₁=(1,0),v₂=(0,1). Bảng: e⁰=1, e¹=2.72. (`.cell.given`)
- **① Điểm q với K nguồn** — `q·k₁=2, q·k₂=0 → /√4 = (1, 0)`. `.why`: Q (đang dịch) so với mọi token nguồn → "nên nhìn token nguồn nào".
- **② Softmax** — `e¹=2.72,e⁰=1,Σ=3.72 → α = (__, __)` → (0.73, 0.27). `.hint`: trọng số "căn chỉnh" (alignment) giữa từ đích và từ nguồn.
- **③ Trộn V nguồn** — `out = 0.73·v₁ + 0.27·v₂ = (__, __)` → (0.73, 0.27). `.why`: thông tin câu nguồn được rót vào decoder đúng chỗ cần.
- **④ So với self-attention** · pill `2 chuỗi` — `.note`: self-attention: Q,K,V cùng chuỗi (11); cross: Q khác nguồn của K,V. Decoder Transformer có **cả hai**: self (đã sinh) + cross (nguồn). SVG: chuỗi nguồn (K,V) và token đích (Q) với mũi tên chú ý.

## 5. Tự kiểm tra (`.quiz`)
1. Trong cross-attention, Q và K/V đến từ đâu? → `.qa` **Q từ decoder; K, V từ encoder (hai chuỗi).**
2. Cross-attention khắc phục điểm yếu nào của seq2seq? → `.qa` **Nút thắt một vectơ c — cho decoder nhìn mọi token nguồn.**

## 6. Rút ra
> **Rút ra.** Cross-attention = Q(decoder) hỏi K,V(encoder) → rót thông tin nguồn vào đích; nền dịch máy & đa phương thức. Bài tiếp (18): nhiều đầu chú ý song song.

## 7. `data-q` & số mẫu
- Chọn điểm/√d rơi mốc bảng eˣ; q, k, v nhỏ.
- Khóa: `q, k1, k2, v1, v2`; `s1, s2`, `a1, a2`, `o1, o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| α | (0.73, 0.27) |
| out | (0.73, 0.27) |
