# SPEC — G3 · RNN trải nhiều bước (BPTT) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `G3-bptt` · English *BPTT* · ~14 phút.
> Tiền đề: 21 (RNN một bước), A13 (chuỗi), D8 (backprop). Có thể cần 3 trang.

## 1. Định vị
**Backprop Through Time**: trải RNN theo chuỗi thời gian rồi lan gradient ngược qua **mọi bước**, cộng dồn gradient cho trọng số dùng chung.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** RNN dùng **cùng một W** ở mọi bước thời gian. Để học, gradient phải đi ngược toàn chuỗi và **cộng lại** đóng
  góp từng bước. BPTT lý giải vì sao chuỗi dài gây vanishing/exploding (Bài E2) → cần LSTM/clipping.
- `.formula`:
  ```
  hₜ = W·xₜ + U·hₜ₋₁      ∂L/∂W = Σₜ δₜ·xₜ      δₜ truyền ngược qua U
  ```

## 3. Trực giác (`.intuition`)
> Trải RNN ra như một **mạng sâu mà mọi lớp xài chung trọng số**. Gradient chảy ngược từ bước cuối về bước đầu; vì W lặp lại, ta
> **cộng** đóng góp gradient của mọi bước thành một cập nhật.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 bước, tuyến tính`: W=1, U=0.5, h₀=0; x=(2, 4); mục tiêu t=4 ở bước cuối, loss `L=½(h₂−t)²`. (`.cell.given`)
- **① Forward** — `h₁ = 1·2 + 0.5·0 = __ (2) ; h₂ = 1·4 + 0.5·2 = __` → 5. `.why`: trạng thái h mang "trí nhớ" từ bước trước qua U·hₜ₋₁.
- **② δ ở bước cuối** — `δ₂ = ∂L/∂h₂ = h₂ − t = 5 − 4 = __` → 1. `.hint`: bắt đầu từ loss ở bước cuối, lan ngược.
- **③ Gradient W cộng dồn theo thời gian** — `∂h₂/∂W = x₂ + U·∂h₁/∂W = 4 + 0.5·2 = __ (5) ; ∂L/∂W = δ₂·5 = __` → 5.
  `.why`: vì ∂h₁/∂W = x₁ = 2 và h₂ phụ thuộc W **cả trực tiếp lẫn qua h₁** → gradient là **tổng theo thời gian**.
- **④ Vì sao chuỗi dài khó** · pill `∏ U teo/nổ` — `.note`: gradient về bước xa nhân nhiều lần U (∏Uᵗ) → |U|<1 teo, >1 nổ (Bài E2). Khắc phục: **clipping**
  (E9), **LSTM/GRU** (cổng giữ trí nhớ). SVG: RNN trải ngang, mũi tên gradient chạy ngược qua các bước.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao gradient W là tổng theo thời gian? → `.qa` **W dùng chung mọi bước → cộng đóng góp gradient từng bước.**
2. Chuỗi dài gây vấn đề gì? → `.qa` **Vanishing/exploding do nhân U nhiều lần.**

## 6. Rút ra
> **Rút ra.** BPTT = trải thời gian + cộng dồn gradient W; chuỗi dài → vanishing/exploding. Bài tiếp (G5): cổng giữ trí nhớ — GRU.

## 7. `data-q` & số mẫu
- Sinh W, U, x (2 bước), t nguyên nhỏ; tính forward & gradient cộng dồn.
- Khóa: `W,U,h0,x1,x2,t`; `h1,h2`, `delta2`, `dhdW`, `gW`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| h₁, h₂ | 2, 5 |
| δ₂ | 1 |
| ∂L/∂W | 5 |
