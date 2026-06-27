# SPEC — H6 · Khối Transformer (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `13-khoi-transformer` · English *Transformer block* · ~14 phút.
> Tiền đề: 11 (self-attention), H11 (FFN), 20 (LayerNorm), F9 (residual). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Một khối Transformer = **attention + FFN**, mỗi cái bọc bởi **LayerNorm + kết nối tắt (residual)**. Xếp chồng N khối thành mô hình.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là "viên gạch" lặp lại của mọi LLM. Hai nửa bổ trợ: attention **trộn** thông tin giữa token, FFN **xử lý**
  trong token; LN + residual giữ tín hiệu/gradient ổn định để chồng được rất sâu.
- `.formula`:
  ```
  a = x + Attention(LN(x))        out = a + FFN(LN(a))      (pre-norm)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi khối: **chuẩn hóa → trộn ngữ cảnh (attention) → cộng lại chính mình**; rồi **chuẩn hóa → suy nghĩ (FFN) → cộng lại**. "Cộng lại
> chính mình" (residual) cho phép khối chỉ cần học **phần thêm**, và mở đường cao tốc cho gradient.

## 4. Các bước
- **⓪ Cho sẵn** · pill `1 token, d nhỏ`: x = (2, 0); kết quả Attention(LN(x)) = (1, 1); FFN(LN(a)) = (0, 2) (cho sẵn để tập trung vào cấu trúc khối). (`.cell.given`)
- **① Nhánh attention + residual** — `a = x + Attention(LN(x)) = (2,0) + (1,1) = (__, __)` → (3, 1). `.why`: cộng x giữ thông tin gốc; attention chỉ **bổ sung** ngữ cảnh.
- **② Nhánh FFN + residual** — `out = a + FFN(LN(a)) = (3,1) + (0,2) = (__, __)` → (3, 3). `.hint`: cùng kiểu "cộng lại chính mình" như nhánh trên.
- **③ Vai trò LN & residual** — LN giữ đầu vào mỗi nhánh **chuẩn hóa** (ổn định); residual cho gradient đường thẳng (Bài F9). `.why`: thiếu hai cái này thì khối sâu **không train nổi**.
- **④ Xếp chồng** · pill `N khối` — `.note`: đầu ra khối này là đầu vào khối kế; chồng N khối (GPT-3: 96). Encoder/decoder khác ở mask & cross-attention (Bài 14, 15). SVG: x → LN→Attn→⊕ → LN→FFN→⊕ → out.

## 5. Tự kiểm tra (`.quiz`)
1. Hai nửa của khối Transformer làm gì? → `.qa` **Attention trộn giữa token; FFN xử lý trong token.**
2. Residual + LayerNorm để làm gì? → `.qa` **Giữ tín hiệu/gradient ổn định → chồng được rất sâu.**

## 6. Rút ra
> **Rút ra.** Khối = (LN→Attention→+x) rồi (LN→FFN→+a); chồng N khối thành mô hình. Bài tiếp (14): thêm causal mask → khối GPT.

## 7. `data-q` & số mẫu
- Sinh x và hai vectơ nhánh (cho sẵn) nguyên nhỏ; cộng residual.
- Khóa: `x1,x2`, `att1,att2`, `ffn1,ffn2`; `a1,a2`, `o1,o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| a (sau attn) | (3, 1) |
| out (sau FFN) | (3, 3) |
