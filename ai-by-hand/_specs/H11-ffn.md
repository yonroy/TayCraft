# SPEC — H11 · FFN trong Transformer (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `H11-ffn` · English *FFN* · ~12 phút.
> Tiền đề: 03 (lớp tuyến tính), 04 (ReLU), 13 (khối Transformer).

## 1. Định vị
Sau attention, mỗi token đi qua một **mạng 2 lớp** (giãn rộng rồi nén lại) áp **độc lập từng vị trí**: FFN = W₂·ReLU(W₁x+b₁)+b₂.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Attention **trộn** thông tin giữa token; FFN **xử lý** thông tin trong từng token (phi tuyến, dung lượng lớn).
  FFN chiếm phần lớn tham số Transformer — nơi mô hình "suy nghĩ" trên mỗi vị trí.
- `.formula`:
  ```
  FFN(x) = W₂ · ReLU(W₁·x + b₁) + b₂      (giãn d → 4d → d, áp cho từng token)
  ```

## 3. Trực giác (`.intuition`)
> Như một **trạm xử lý** đặt ở mỗi vị trí: **giãn** vectơ ra chiều lớn hơn (4×) để có chỗ "nghĩ", lọc phi tuyến bằng ReLU, rồi **nén**
> về chiều cũ. Cùng một FFN dùng cho mọi token (chia sẻ trọng số theo vị trí).

## 4. Các bước
- **⓪ Cho sẵn** · pill `d=2 → ẩn 4 → d=2`: x = (1, 2); W₁ cho h_pre = (x₁, x₂, x₁+x₂, x₁−x₂); b₁=0; W₂ hai hàng (tổng) và (xen dấu); b₂=0. (`.cell.given`)
- **① Giãn rộng (W₁x)** — `h_pre = (1, 2, 1+2, 1−2) = (__, __, __, __)` → (1, 2, 3, −1). `.why`: chiều ẩn lớn cho mô hình nhiều "đặc trưng trung gian" để xử lý.
- **② ReLU** — `h = ReLU(1,2,3,−1) = (__, __, __, __)` → (1, 2, 3, 0). `.hint`: cắt âm về 0 → phi tuyến + thưa.
- **③ Nén lại (W₂h)** — hàng tổng: `1+2+3+0 = __ (6)`; hàng xen dấu: `1−2+3−0 = __` → 2 → `out = (6, 2)`. `.why`: nén về chiều cũ d để cộng residual (Bài F9) và đi tiếp.
- **④ Vị trí độc lập** · pill `cùng FFN mọi token` — `.note`: FFN áp **riêng từng token**, không trộn vị trí (việc đó là của attention). Hệ số giãn thường 4× → FFN giữ ~⅔ tham số mỗi lớp Transformer. SVG: x → giãn 4 → ReLU → nén 2.

## 5. Tự kiểm tra (`.quiz`)
1. Attention vs FFN khác vai trò gì? → `.qa` **Attention trộn thông tin giữa token; FFN xử lý trong từng token.**
2. FFN áp theo vị trí thế nào? → `.qa` **Độc lập từng token (cùng một FFN, không trộn vị trí).**

## 6. Rút ra
> **Rút ra.** FFN = giãn → ReLU → nén, áp từng token; giữ phần lớn tham số. Cùng attention + LayerNorm + residual tạo một khối
> Transformer (Bài 13). Hết mạch attention nền; tiếp Phần I (LLM) — Bài I1: tokenization/BPE.

## 7. `data-q` & số mẫu
- Sinh x (2 chiều) nguyên nhỏ; W cố định dạng (tổng/hiệu); tính h_pre, ReLU, out.
- Khóa: `x1, x2`; `hp1..hp4`, `h1..h4`, `o1, o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| h_pre | (1, 2, 3, −1) |
| ReLU | (1, 2, 3, 0) |
| out | (6, 2) |
