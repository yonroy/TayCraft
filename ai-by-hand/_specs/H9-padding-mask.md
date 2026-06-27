# SPEC — H9 · Padding mask trong attention (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `H9-padding-mask` · English *Padding mask* · ~11 phút.
> Tiền đề: H1 (attention), 09 (softmax). Dùng bảng eˣ.

## 1. Định vị
Khi gom câu khác độ dài vào một batch, ta **đệm (pad)** cho bằng nhau. Mask đặt điểm attention của ô pad về **−∞** để softmax cho **0** — token thật không "nghe" ô rác.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Không mask thì token thật sẽ trộn thông tin từ ô đệm vô nghĩa → hỏng kết quả. Mask là chi tiết kỹ thuật
  nhỏ nhưng **bắt buộc đúng** để batch hoạt động. (Cùng cơ chế với **causal mask** che tương lai — Bài 14.)
- `.formula`:
  ```
  điểm_masked = điểm + (mask ? −∞ : 0)      → softmax(−∞) = 0
  ```

## 3. Trực giác (`.intuition`)
> Đặt điểm của ô pad xuống **âm vô cùng** trước softmax → eˣ của nó = 0 → **không nhận chú ý**. Như "bịt tai" với những vị trí
> không có nội dung thật.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `4 vị trí, 1 PAD`: điểm thô = (2, 0, 1, 1) cho [t₁, t₂, t₃, PAD]. Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Áp mask** — điểm sau mask = (2, 0, 1, **−∞**). `.why`: chỉ ô PAD bị đặt −∞; các ô thật giữ nguyên điểm.
- **② Mũ hóa** — `e²=7.39, e⁰=1, e¹=2.72, e^−∞ = __` → 0. `.hint`: e mũ của −∞ là 0 → ô pad biến mất khỏi tổng.
- **③ Softmax (chỉ 3 ô thật)** — `Σ = 7.39+1+2.72 = 11.11 → α = (0.67, 0.09, 0.24, __)` → 0 cho PAD. `.why`: trọng số dồn hết cho token thật; tổng vẫn = 1.
- **④ Causal mask** · pill `che tương lai` — `.note`: GPT dùng **mặt nạ tam giác** đặt −∞ cho mọi vị trí **sau** token hiện tại → khi sinh, token chỉ thấy quá khứ (Bài 14). Cùng kỹ thuật. SVG: ma trận điểm với ô bị che tô xám.

## 5. Tự kiểm tra (`.quiz`)
1. Mask đặt điểm thành gì trước softmax? → `.qa` **−∞ (→ softmax cho 0).**
2. Causal mask che gì? → `.qa` **Các vị trí tương lai (sau token hiện tại).**

## 6. Rút ra
> **Rút ra.** Padding mask = đặt điểm ô đệm −∞ → softmax 0 → token thật không nghe ô rác; causal mask cùng cơ chế che tương lai.
> Bài tiếp (H10): tăng tốc sinh token bằng KV cache.

## 7. `data-q` & số mẫu
- Sinh điểm 3 token thật rơi mốc bảng eˣ + 1 PAD; softmax sau mask.
- Khóa: `s1, s2, s3`; `a1, a2, a3` (+ pad = 0).

## Phụ lục — số mẫu
| | KQ |
|---|---|
| e của PAD | 0 |
| α | (0.67, 0.09, 0.24, 0) |
