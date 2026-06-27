# SPEC — I2 · Logits → softmax → sampling (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I2-sampling` · English *Sampling* · ~13 phút.
> Tiền đề: 09 (softmax), A17 (Categorical). Dùng bảng eˣ.

## 1. Định vị
Biến logits thành xác suất (softmax), rồi **chọn token** kế: greedy, **nhiệt độ T**, top-k, top-p. Điều khiển "sáng tạo" của LLM.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Cùng mô hình, cách **lấy mẫu** quyết định văn bản nhàm (greedy) hay đa dạng (sampling). T, top-k, top-p là
  các "núm" điều chỉnh độ ngẫu nhiên — kỹ năng dùng LLM thực tế.
- `.formula`:
  ```
  p = softmax(z / T)      top-k: giữ k logit lớn nhất      top-p: giữ tập nhỏ nhất có Σp ≥ p
  ```

## 3. Trực giác (`.intuition`)
> **Nhiệt độ T** như "độ liều": T nhỏ (→0) làm phân phối nhọn → gần như luôn chọn token mạnh nhất (an toàn, nhàm); T lớn làm
> phẳng → liều hơn, đa dạng hơn. top-k/top-p **cắt đuôi** token xác suất thấp để khỏi nói linh tinh.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `3 token`: logits z = (2, 1, 0). Bảng: e⁰=1, e⁰·⁵=1.65, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Softmax T=1** — `e=(7.39, 2.72, 1), Σ=11.11 → p = (__, __, __)` → (0.67, 0.24, 0.09). `.why`: T=1 giữ nguyên độ chênh logits.
- **② Nhiệt độ T=2** — `z/2 = (1, 0.5, 0) → e=(2.72,1.65,1), Σ=5.37 → p = (__, __, __)` → (0.51, 0.31, 0.19). `.hint`: T lớn → phân phối **phẳng hơn** → đa dạng hơn.
- **③ Greedy & top-k=1** — chọn token có p lớn nhất → `token __` (token 1). `.why`: greedy = top-1 → tất định, dễ lặp/nhàm.
- **④ top-p=0.9** · pill `cắt đuôi` — với p(T=1)=(0.67,0.24,0.09): giữ {token1, token2} (Σ=0.91 ≥ 0.9), **bỏ** token3; chuẩn hóa lại rồi lấy mẫu. `.note`: top-p (nucleus) giữ "khối xác suất" thay vì số token cố định → linh hoạt hơn top-k. SVG: cột p ở T=1 vs T=2.

## 5. Tự kiểm tra (`.quiz`)
1. Tăng nhiệt độ T làm gì với phân phối? → `.qa` **Phẳng hơn → đa dạng/ngẫu nhiên hơn.**
2. top-p khác top-k ở đâu? → `.qa` **top-p giữ tập có tổng xác suất ≥ p (số token thay đổi); top-k giữ k token cố định.**

## 6. Rút ra
> **Rút ra.** Softmax(z/T) + top-k/top-p điều khiển độ sáng tạo khi sinh; T nhỏ an toàn, T lớn liều. Bài tiếp (I3): đo độ "bất ngờ"
> của mô hình — perplexity.

## 7. `data-q` & số mẫu
- Chọn logits rơi mốc bảng eˣ; T ∈ {1,2}; tính p hai nhiệt độ.
- Khóa: `z1..z3`; `p1..p3` (T=1), `pt1..pt3` (T=2); argmax.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| p (T=1) | (0.67, 0.24, 0.09) |
| p (T=2) | (0.51, 0.31, 0.19) |
| greedy | token 1 |
