# SPEC — H3 · Khối GPT — Masked Attention (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `14-khoi-gpt-mask` · English *Masked attention* · ~13 phút.
> Tiền đề: 11 (self-attention), H9 (mask), 09. **Đã có phiếu** — spec để nâng cấp/tái tạo. Dùng bảng eˣ.

## 1. Định vị
GPT sinh trái→phải nên mỗi token **chỉ được nhìn quá khứ**. Causal mask đặt điểm với token tương lai về −∞ → softmax 0.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nếu token thấy được **tương lai**, mô hình "gian lận" lúc huấn luyện (biết đáp án). Causal mask buộc dự đoán
  chỉ dựa trên quá khứ → học đúng cách sinh tuần tự. Đây là khác biệt then chốt của decoder GPT.
- `.formula`:
  ```
  điểm[i][j] += (j > i ? −∞ : 0)   →  token i chỉ chú ý j ≤ i (quá khứ + hiện tại)
  ```

## 3. Trực giác (`.intuition`)
> **Mặt nạ tam giác**: đứng ở token i, "che kín" mọi token sau i. Như đọc sách mà **tay che phần chưa đọc** — chỉ được dùng những gì
> đã thấy để đoán chữ kế.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `3 token`: điểm thô của token 2 với [t₁,t₂,t₃] = (1, 2, 3). Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Áp causal mask cho token 2** — token 2 chỉ thấy t₁,t₂ → điểm = (1, 2, **−∞**). `.why`: t₃ ở tương lai (j=3 > i=2) → che.
- **② Softmax (chỉ quá khứ)** — `e¹=2.72, e²=7.39, e^−∞=0, Σ=10.11 → α = (__, __, 0)` → (0.27, 0.73, 0). `.hint`: trọng số dồn cho token đã thấy; tổng = 1.
- **③ Token 1 thấy gì** — token 1 chỉ thấy chính nó → α = (1, 0, 0). `.why`: đầu chuỗi không có quá khứ → tự chú ý 100%.
- **④ Ma trận tam giác** · pill `lower-triangular` — `.note`: gộp mọi token → mặt nạ **tam giác dưới**; lúc suy luận kết hợp KV cache (H10) sinh từng token. SVG: ma trận điểm với nửa trên tô xám (bị che).

## 5. Tự kiểm tra (`.quiz`)
1. Causal mask che gì? → `.qa` **Các token tương lai (j > i).**
2. Vì sao GPT cần mask này? → `.qa` **Để mô hình không "gian lận" nhìn đáp án — học sinh tuần tự đúng.**

## 6. Rút ra
> **Rút ra.** Causal mask = tam giác dưới, che tương lai → token chỉ chú ý quá khứ; đó là decoder GPT. Bài tiếp (15): cross-attention nối encoder↔decoder.

## 7. `data-q` & số mẫu
- Sinh điểm 3 token rơi mốc bảng eˣ; áp mask cho một token giữa.
- Khóa: `s1,s2,s3`; `a1,a2` (+ tương lai = 0).

## Phụ lục — số mẫu (token 2)
| | KQ |
|---|---|
| điểm sau mask | (1, 2, −∞) |
| α | (0.27, 0.73, 0) |
