# SPEC — K8 · PPO — ý tưởng cắt (clip) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K8-ppo-clip` · English *PPO clip* · ~13 phút.
> Tiền đề: K6 (policy gradient), K7 (advantage).

## 1. Định vị
**Proximal Policy Optimization**: giới hạn mỗi cập nhật chính sách trong một "vùng an toàn" bằng cách **cắt tỉ lệ** π_mới/π_cũ. Ổn định, dễ dùng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Policy gradient bước quá mạnh → chính sách "nhảy" hỏng, sụp đổ. PPO **chặn** mức thay đổi mỗi bước (không đi xa
  chính sách cũ) → huấn luyện ổn định. Là thuật toán RL phổ biến nhất hiện nay (kể cả RLHF cho LLM).
- `.formula`:
  ```
  rₜ = π_mới(a|s) / π_cũ(a|s)        L = min( rₜ·A,  clip(rₜ, 1−ε, 1+ε)·A )
  ```

## 3. Trực giác (`.intuition`)
> Tỉ lệ r = "chính sách mới ưu ái hành động này gấp mấy lần cũ". PPO cho phép cải thiện nhưng **không quá ε**: nếu r vượt 1+ε (với A>0),
> phần thưởng bị **cắt trần** → mất động lực đi xa. Như "thắt dây an toàn" cho mỗi bước cập nhật.

## 4. Các bước
- **⓪ Cho sẵn** · pill `ε=0.2`: tỉ lệ r = 1.3 (chính sách mới ưa hành động này hơn 30%); advantage A = 2 (> 0, hành động tốt). (`.cell.given`)
- **① Mục tiêu chưa cắt** — `r·A = 1.3·2 = __` → 2.6. `.why`: nếu không chặn, mô hình muốn đẩy r còn lớn hơn nữa (đi xa chính sách cũ).
- **② Cắt tỉ lệ** — `clip(1.3, 0.8, 1.2) = __ (1.2)`; `clip·A = 1.2·2 = __` → 2.4. `.hint`: 1.3 vượt trần 1+ε=1.2 → bị cắt về 1.2.
- **③ Lấy min** — `L = min(2.6, 2.4) = __` → 2.4. `.why`: lấy min → khi r vượt vùng an toàn, **không thưởng thêm** → triệt động lực bước quá xa.
- **④ Vì sao "proximal"** · pill `gần chính sách cũ` — `.note`: clip giữ chính sách mới **gần** cũ (trong [1−ε, 1+ε]) → mỗi bước cải thiện nhỏ, an toàn, không sụp. Với A<0 cơ chế đối xứng (chặn dưới). SVG: hàm L theo r — phẳng ngoài [0.8,1.2].

## 5. Tự kiểm tra (`.quiz`)
1. Tỉ lệ rₜ trong PPO là gì? → `.qa` **π_mới(a|s) / π_cũ(a|s) — mức thay đổi ưu ái hành động.**
2. Vì sao lấy min và clip? → `.qa` **Chặn bước đi quá xa chính sách cũ → huấn luyện ổn định.**

## 6. Rút ra
> **Rút ra.** PPO clip: L = min(r·A, clip(r,1±ε)·A) → cập nhật nhỏ & an toàn, gần chính sách cũ. **Hết Phần K (RL).** Tiếp Phần L — Bài tiếp (L1): ma trận nhầm lẫn.

## 7. `data-q` & số mẫu
- Sinh r (vượt hoặc trong [1−ε,1+ε]), A (±), ε; tính r·A, clip·A, min.
- Khóa: `ratio, A, eps`; `unclipped, clipped, L`.

## Phụ lục — số mẫu (ε=0.2)
| | KQ |
|---|---|
| r·A | 2.6 |
| clip·A | 2.4 |
| L = min | 2.4 |
