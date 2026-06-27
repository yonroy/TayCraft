# SPEC — J3 · GAN — một bước D và G (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `J3-gan` · English *GAN* · ~13 phút.
> Tiền đề: B3 (sigmoid/BCE), A18 (log). Dùng bảng ln.

## 1. Định vị
Hai mạng đối kháng: **Discriminator** D học phân biệt thật/giả; **Generator** G học làm giả để **lừa** D. Hai bên cùng tiến.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** GAN sinh ảnh sắc nét bằng một trò chơi: G cố lừa, D cố bắt. Không cần loss tái tạo tường minh — "chất lượng"
  do D định nghĩa và **tự nâng cấp**. Hiểu một bước D/G là hiểu vì sao GAN khó nhưng mạnh.
- `.formula`:
  ```
  D: max  ln D(thật) + ln(1 − D(giả))        G: max ln D(giả)   (lừa D nghĩ giả là thật)
  ```

## 3. Trực giác (`.intuition`)
> **Kẻ làm tiền giả (G)** và **cảnh sát (D)**: cảnh sát học bắt tiền giả; kẻ làm giả học làm tiền tinh vi hơn để qua mặt. Hai bên ép
> nhau giỏi lên; cân bằng lý tưởng = tiền giả y như thật (D đoán 50/50).

## 4. Các bước
- **⓪ Cho sẵn + bảng ln** · pill `1 thật, 1 giả`: D(thật)=0.9, D(giả)=0.2. Bảng: ln0.9=−0.11, ln0.8=−0.22, ln0.2=−1.61. (`.cell.given`)
- **① Loss Discriminator** — `L_D = −[ln D(thật) + ln(1−D(giả))] = −[ln0.9 + ln0.8] = __` → 0.33. `.why`: D muốn D(thật)→1 và D(giả)→0; loss nhỏ khi phân biệt tốt.
- **② Loss Generator** — `L_G = −ln D(giả) = −ln0.2 = __` → 1.61. `.hint`: G muốn D(giả)→1 → loss G lớn khi D còn bắt được (0.2).
- **③ Hai bên kéo ngược** — D giảm L_D bằng cách hạ D(giả); G giảm L_G bằng cách **nâng** D(giả). `.why`: cùng đại lượng D(giả), hai bên kéo ngược hướng → trò chơi đối kháng.
- **④ Cân bằng & khó** · pill `D(giả) → 0.5` — `.note`: lý tưởng G làm D không phân biệt nổi → D(·)≈0.5. Thực tế dễ **mất ổn định** (mode collapse, một bên thắng áp đảo) → cần mẹo huấn luyện. SVG: G→ảnh giả→D←ảnh thật, hai mũi tên loss ngược.

## 5. Tự kiểm tra (`.quiz`)
1. G và D tối ưu ngược nhau ở đại lượng nào? → `.qa` **D(giả): D hạ xuống, G nâng lên.**
2. Cân bằng lý tưởng của GAN? → `.qa` **G làm D không phân biệt nổi → D(·) ≈ 0.5.**

## 6. Rút ra
> **Rút ra.** GAN = trò chơi D (bắt giả) vs G (lừa D); kéo ngược D(giả), cân bằng ở 0.5. Bài tiếp (J4): hướng sinh khác — diffusion thêm nhiễu.

## 7. `data-q` & số mẫu
- Chọn D(thật), D(giả) rơi mốc bảng ln; tính L_D, L_G.
- Khóa: `dReal, dFake`; `lossD, lossG`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| L_D | 0.33 |
| L_G | 1.61 |
