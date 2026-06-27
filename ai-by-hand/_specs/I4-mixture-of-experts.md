# SPEC — I4 · Mixture of Experts (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `26-mixture-of-experts` · English *Mixture of Experts* · ~13 phút.
> Tiền đề: 09 (softmax), H11 (FFN). **Đã có phiếu** — spec để nâng cấp/tái tạo. Dùng bảng eˣ.

## 1. Định vị
Thay một FFN lớn bằng **nhiều chuyên gia (expert)** + một **router** chọn vài expert cho mỗi token → mô hình **rất nhiều tham số** nhưng tính ít.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** MoE cho phép phình tham số (kiến thức) **mà không phình tính toán**: mỗi token chỉ kích hoạt top-k expert. Đây là
  cách scale LLM tới hàng nghìn tỉ tham số (Mixtral, GLaM) với chi phí suy luận vừa phải.
- `.formula`:
  ```
  g = softmax(router·x)   → chọn top-k expert       out = Σ_{i∈top-k} gᵢ · Expertᵢ(x)
  ```

## 3. Trực giác (`.intuition`)
> Như **hội đồng chuyên gia**: router (người điều phối) xem token rồi gọi **vài** chuyên gia hợp nhất, bỏ qua số còn lại. Mỗi token
> đi qua ít chuyên gia → rẻ; nhưng cả mô hình **chứa rất nhiều** chuyên gia → giàu kiến thức.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `3 expert, top-2`: router logits cho token = (2, 0, 1); đầu ra expert E₁=(1,0), E₂=(0,1), E₃=(1,1). Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Cổng router (softmax)** — `e=(7.39,1,2.72), Σ=11.11 → g = (__, __, __)` → (0.67, 0.09, 0.24). `.why`: router cho điểm "token này hợp expert nào".
- **② Chọn top-2** — giữ E₁ (0.67) và E₃ (0.24); **bỏ** E₂. Chuẩn hóa lại: `g' = (0.67/0.91, 0.24/0.91) = (__, __)` → (0.74, 0.26). `.hint`: chỉ k expert được kích hoạt → tiết kiệm tính toán.
- **③ Trộn đầu ra** — `out = 0.74·E₁ + 0.26·E₃ = 0.74·(1,0) + 0.26·(1,1) = (__, __)` → (1.0, 0.26). `.why`: kết quả = tổ hợp có trọng số các expert được chọn.
- **④ Phình tham số, không phình tính** · pill `top-k` — `.note`: 8 expert nhưng mỗi token dùng 2 → tham số ×8, tính ×2. Cần **cân tải** (load balancing) kẻo router dồn hết vào vài expert. SVG: token → router → 2/3 expert sáng → trộn.

## 5. Tự kiểm tra (`.quiz`)
1. MoE đạt được gì? → `.qa` **Nhiều tham số (kiến thức) nhưng tính ít — mỗi token chỉ dùng top-k expert.**
2. Rủi ro của router? → `.qa` **Dồn tải vào vài expert → cần cân bằng tải (load balancing).**

## 6. Rút ra
> **Rút ra.** MoE = router softmax → top-k expert → trộn có trọng số; scale tham số mà giữ chi phí. **Hết khóa K3.** Tiếp K4 — Bài tiếp (K1): phần thưởng & chiết khấu (RL).

## 7. `data-q` & số mẫu
- Chọn router logits rơi mốc bảng eˣ; đầu ra expert nhỏ; top-2.
- Khóa: `r1..r3`, expert; `g1..g3`, `gp1,gp3`, `o1,o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| g (router) | (0.67, 0.09, 0.24) |
| top-2 chuẩn hóa | (0.74, 0.26) |
| out | (1.0, 0.26) |
