# SPEC — M2 · Contrastive learning (InfoNCE) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `M2-contrastive-infonce` · English *Contrastive / InfoNCE* · ~13 phút.
> Tiền đề: A4 (cosine), 09 (softmax), 17 (CE). Dùng bảng eˣ.

## 1. Định vị
Học biểu diễn **không nhãn**: kéo **cặp dương** (hai góc nhìn của cùng vật) lại gần, đẩy **cặp âm** (vật khác) ra xa — qua loss InfoNCE.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Dữ liệu có nhãn đắt; contrastive học từ **dữ liệu thô** bằng cách tự tạo cặp dương (augment) và coi phần còn lại
  là âm. Nền của SimCLR, MoCO, và phần text–image của CLIP (M4). InfoNCE = cross-entropy chọn đúng cặp dương giữa nhiều âm.
- `.formula`:
  ```
  L = −ln  exp(sim(a,p)/τ) / Σ_x exp(sim(a,x)/τ)      (x gồm p và các âm n)
  ```

## 3. Trực giác (`.intuition`)
> Một **trò chọn đúng**: cho điểm tương đồng giữa neo a và mọi ứng viên; loss ép **cặp dương** có điểm cao **nhất** giữa đám âm. Như bài
> toán softmax "đâu là bạn thật của a?" — kéo bạn lại gần, đẩy người lạ ra xa.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `1 dương, 2 âm, τ=1`: sim(a,p)=2; sim(a,n₁)=0; sim(a,n₂)=1. Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Mũ hóa điểm** — `e²=7.39, e⁰=1, e¹=2.72`. `.why`: softmax trên độ tương đồng → "xác suất p là bạn thật của a".
- **② Xác suất cặp dương** — `Σ = 7.39+1+2.72 = 11.11 → p(dương) = 7.39/11.11 = __` → 0.67. `.hint`: dương có điểm cao nhất → chiếm phần lớn.
- **③ Loss InfoNCE** — `L = −ln(0.67) = __` → 0.40. `.why`: giảm L = đẩy p(dương) → 1 = kéo dương gần, đẩy âm xa.
- **④ Vai trò τ & nhiều âm** · pill `nhiệt độ` — `.note`: τ nhỏ làm phân phối nhọn (phạt mạnh âm gần); càng nhiều âm, biểu diễn càng phân biệt tốt. SVG: neo a + dương (gần) + âm (xa).

## 5. Tự kiểm tra (`.quiz`)
1. InfoNCE kéo/đẩy cái gì? → `.qa` **Kéo cặp dương lại gần, đẩy cặp âm ra xa.**
2. InfoNCE giống loss nào? → `.qa` **Cross-entropy (chọn đúng cặp dương giữa các âm).**

## 6. Rút ra
> **Rút ra.** Contrastive = softmax chọn cặp dương giữa âm (InfoNCE); học biểu diễn không nhãn. Bài tiếp (M3): một dạng khác — triplet loss.

## 7. `data-q` & số mẫu
- Chọn sim rơi mốc bảng eˣ; 1 dương + vài âm.
- Khóa: `simP, simN1, simN2`; `pPos`, `loss`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| p(dương) | 0.67 |
| InfoNCE loss | 0.40 |
