# SPEC — H10 · KV cache — sinh token tiếp theo (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `H10-kv-cache` · English *KV cache* · ~12 phút.
> Tiền đề: H1 (attention), I8 (decode). Dùng bảng eˣ.

## 1. Định vị
Khi sinh từng token, **lưu lại K, V** của các token cũ thay vì tính lại. Token mới chỉ cần tính K, V của chính nó → tăng tốc lớn.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Không cache, mỗi token mới phải tính lại attention cho **toàn bộ** chuỗi → chi phí O(n²) mỗi bước. KV cache
  hạ xuống O(n) mỗi bước → đây là lý do LLM sinh văn bản đủ nhanh để dùng thực tế.
- `.formula`:
  ```
  Bước mới t: tính qₜ, kₜ, vₜ;  K = [K_cache; kₜ];  V = [V_cache; vₜ]
  out = softmax(qₜ·Kᵀ/√d)·V      (K_cache, V_cache lấy lại, KHÔNG tính lại)
  ```

## 3. Trực giác (`.intuition`)
> Các token cũ **không đổi** khi thêm token mới → K, V của chúng cũng không đổi. Vậy **lưu lại** dùng tiếp, chỉ tính phần **mới**.
> Như ghi sẵn sổ tay, mỗi câu mới chỉ ghi thêm một dòng thay vì chép lại cả sổ.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `cache 2 token, dₖ=4`: K_cache = [k₁=(1,0), k₂=(0,1)], V_cache = [v₁=(1,0), v₂=(0,1)]; token mới q₃=(2,0), k₃=(2,0), v₃=(1,1). Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Chỉ tính K,V mới** — chỉ cần `k₃, v₃` (đã cho); k₁,k₂,v₁,v₂ **lấy từ cache**. `.why`: token cũ không đổi → tái dùng, đây là cốt lõi tiết kiệm.
- **② Điểm q₃ với mọi K** — `q₃·k₁=2, q₃·k₂=0, q₃·k₃=4 → /√4 = (1, 0, 2)`. `.hint`: ghép k₃ vào sau cache rồi chấm điểm như thường.
- **③ Softmax & trộn V** — `e=(2.72,1,7.39), Σ=11.11 → α=(0.24, 0.09, 0.67)`; `out = α·[v₁,v₂,v₃] = (__, __)` → (0.91, 0.76). `.why`: kết quả y như tính lại từ đầu, nhưng rẻ hơn.
- **④ Tiết kiệm** · pill `O(n²) → O(n)` — `.note`: không cache, bước thứ n tính lại n token (tổng O(n²)); có cache, mỗi bước O(n). Đổi **bộ nhớ lấy tốc độ** (phải lưu K,V). SVG: cache cũ (xám) + ô mới (cam) ghép lại.

## 5. Tự kiểm tra (`.quiz`)
1. KV cache lưu gì? → `.qa` **K và V của các token đã sinh (để khỏi tính lại).**
2. Đánh đổi của KV cache? → `.qa` **Tốn bộ nhớ để lưu K, V — đổi lấy tốc độ.**

## 6. Rút ra
> **Rút ra.** KV cache tái dùng K,V token cũ → mỗi bước O(n) thay vì O(n²); đổi bộ nhớ lấy tốc độ. Bài tiếp (H11): khối FFN trong Transformer.

## 7. `data-q` & số mẫu
- Cho cache + token mới; điểm rơi mốc bảng eˣ; tính softmax & trộn.
- Khóa: `k3, v3, q3`; `s1, s2, s3`, `a1, a2, a3`, `o1, o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| điểm /√d | (1, 0, 2) |
| α | (0.24, 0.09, 0.67) |
| out | (0.91, 0.76) |
