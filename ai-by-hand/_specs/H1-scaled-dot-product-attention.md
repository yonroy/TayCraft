# SPEC — H1 · Scaled dot-product attention (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `H1-scaled-dot-product-attention` · English *Scaled dot-product attention* · ~14 phút.
> Tiền đề: 01 (tích vô hướng), 09 (softmax), A4 (cosine). Mở đầu Phần H (Attention/Transformer, K3). Dùng bảng eˣ.

## 1. Định vị
Cơ chế lõi của Transformer: mỗi truy vấn (Q) **chấm điểm tương đồng** với mọi khóa (K), chuẩn hóa bằng softmax, rồi **trộn các giá trị (V)** theo trọng số đó.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Attention cho mỗi token "nhìn" và **lấy thông tin từ token liên quan** bất kể khoảng cách — phá giới
  hạn tuần tự của RNN. Đây là phép tính làm nên LLM hiện đại.
- `.formula`:
  ```
  Attention(Q,K,V) = softmax(Q·Kᵀ / √dₖ) · V
  ```

## 3. Trực giác (`.intuition`)
> Như **tra cứu mềm**: câu hỏi Q so độ khớp với từng "nhãn" K (tích vô hướng), softmax biến độ khớp thành **trọng số chú ý**
> (tổng 1), rồi lấy **trung bình có trọng số** các nội dung V. Chia √dₖ để điểm không quá lớn làm softmax bão hòa.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `1 query, 2 key/value, dₖ=4`: q=(2,0); k₁=(1,0), k₂=(0,1); v₁=(1,0), v₂=(0,1). Bảng: e⁰=1, e¹=2.72. (`.cell.given`)
- **① Điểm tương đồng (Q·Kᵀ)** — `q·k₁ = __ (2) ; q·k₂ = __ (0)`. `.why`: tích vô hướng đo "câu hỏi khớp khóa nào" — giống cosine chưa chuẩn hóa.
- **② Chia √dₖ** — `√4 = 2 → điểm = (2/2, 0/2) = (__, __)` → (1, 0). `.hint`: chia √dₖ để giữ phương sai điểm ổn định khi dₖ lớn → softmax không bão hòa.
- **③ Softmax → trọng số chú ý** — `e¹=2.72, e⁰=1, Σ=3.72 → α = (2.72/3.72, 1/3.72) = (__, __)` → (0.73, 0.27). `.why`: token khớp hơn (k₁) nhận chú ý nhiều hơn.
- **④ Trộn V** · pill `O = α·V` — `O = 0.73·(1,0) + 0.27·(0,1) = (__, __)` → (0.73, 0.27). `.note`: đầu ra là **hỗn hợp** thông tin các token, nghiêng về token liên quan nhất. SVG: q → điểm → softmax → trộn v.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao chia √dₖ? → `.qa` **Giữ điểm không quá lớn → softmax không bão hòa (gradient sống).**
2. Trọng số attention tổng bằng bao nhiêu? → `.qa` **1 (do softmax).**

## 6. Rút ra
> **Rút ra.** Attention = điểm Q·K (chia √dₖ) → softmax → trộn V; mỗi token lấy thông tin theo độ liên quan. Bài tiếp (11): tự
> chú ý (self-attention) — Q, K, V cùng từ một chuỗi.

## 7. `data-q` & số mẫu
- Chọn q, k, v sao cho điểm/√dₖ rơi mốc bảng eˣ (0,1,2); dₖ=4.
- Khóa: `q, k1, k2, v1, v2`; `s1, s2`, `sc1, sc2`, `a1, a2`, `o1, o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| điểm /√d | (1, 0) |
| α | (0.73, 0.27) |
| O | (0.73, 0.27) |
