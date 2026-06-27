# SPEC — E9 · Gradient clipping (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E9-gradient-clipping` · English *Gradient clipping* · ~11 phút.
> Tiền đề: A2 (chuẩn), E2 (exploding gradient).

## 1. Định vị
Chặn **độ lớn gradient**: nếu ‖g‖ vượt ngưỡng c thì **co lại** về c (giữ hướng). Cứu huấn luyện khỏi gradient nổ (RNN, mạng sâu).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một bước gradient khổng lồ (exploding) đẩy trọng số đi xa → loss thành NaN, hỏng cả phiên huấn luyện.
  Clipping đặt **trần** cho bước đó: vẫn đi đúng hướng nhưng không quá một độ dài an toàn. Gần như bắt buộc với RNN/LSTM.
- `.formula`:
  ```
  nếu ‖g‖ > c:   g ← g · (c / ‖g‖)      ngược lại giữ nguyên g
  ```

## 3. Trực giác (`.intuition`)
> Như **giới hạn tốc độ**: gradient được phép chỉ hướng nào tùy ý, nhưng độ dài bước bị **cắt trần** ở c. Hướng giữ nguyên (chia
> cho ‖g‖ rồi nhân c) — chỉ rút ngắn, không bẻ lái.

## 4. Các bước
- **⓪ Cho sẵn** · pill `ngưỡng c=2`: gradient g = (3, 4). (`.cell.given`)
- **① Chuẩn gradient** — `‖g‖ = √(3²+4²) = √25 = __` → 5. `.why`: clipping theo **norm** (cả vectơ) chứ không từng phần tử → giữ nguyên hướng.
- **② Vượt ngưỡng?** — `‖g‖ = 5 > c = 2 → cần cắt`. Hệ số `c/‖g‖ = 2/5 = __` → 0.4. `.hint`: hệ số < 1 → co lại.
- **③ Gradient sau cắt** — `g ← 0.4·(3,4) = (__, __)` → (1.2, 1.6); kiểm `‖g_mới‖ = √(1.44+2.56) = √4 = __` → 2 = c. `.why`: độ dài đúng bằng trần c,
  hướng (3,4) giữ nguyên.
- **④ Khi nào không cắt** · pill `‖g‖ ≤ c` — `.note`: nếu ‖g‖ đã ≤ c thì giữ nguyên (đa số bước). Có biến thể **clip từng phần tử** (đơn giản nhưng đổi
  hướng). RNN/LSTM gần như luôn bật clipping. SVG: vectơ g dài → cắt về vòng tròn bán kính c.

## 5. Tự kiểm tra (`.quiz`)
1. Clipping theo norm có đổi hướng gradient không? → `.qa` **Không — chỉ rút ngắn độ dài về c.**
2. Vì sao RNN cần clipping? → `.qa` **Gradient dễ nổ qua nhiều bước thời gian (exploding).**

## 6. Rút ra
> **Rút ra.** Clipping = đặt trần ‖g‖ ở c, giữ hướng; chống exploding. Bài tiếp (E10): gradient ước lượng từ mini-batch vs full-batch.

## 7. `data-q` & số mẫu
- Sinh g là bộ Pythagore (‖g‖ tròn) + ngưỡng c < ‖g‖ để luôn cắt; tính hệ số & g mới.
- Khóa: `g1,g2`, `c`; `norm`, `scale`, `gc1,gc2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ‖g‖ | 5 |
| hệ số c/‖g‖ | 0.4 |
| g sau cắt | (1.2, 1.6), ‖·‖=2 |
