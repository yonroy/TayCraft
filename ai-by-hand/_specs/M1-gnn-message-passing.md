# SPEC — M1 · GNN — message passing một bước (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `M1-gnn-message-passing` · English *GNN* · ~13 phút.
> Tiền đề: A1 (vectơ), 03 (lớp tuyến tính). Mở đầu Phần M (Nâng cao, K4).

## 1. Định vị
Mạng nơ-ron trên **đồ thị**: mỗi nút cập nhật bằng cách **gom thông tin từ hàng xóm** (message passing) rồi trộn với chính nó.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nhiều dữ liệu là **đồ thị** (mạng xã hội, phân tử, bản đồ). GNN cho mỗi nút "nghe" hàng xóm để học biểu diễn theo
  cấu trúc quan hệ. Một lớp = một vòng lan tin; chồng lớp → nút thấy hàng xóm xa hơn.
- `.formula`:
  ```
  hᵥ' = Update( hᵥ , Aggregate({ hᵤ : u ∈ N(v) }) )      (Aggregate: sum/mean/max)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi nút **gửi tin** (đặc trưng) cho hàng xóm và **nhận** lại; gom các tin nhận được (trung bình/tổng) rồi cập nhật bản thân. Sau k lớp,
> một nút biết tin từ hàng xóm trong **bán kính k** — như tin đồn lan qua mạng quen biết.

## 4. Các bước
- **⓪ Cho sẵn** · pill `nút A, 2 hàng xóm`: h_A=(1,0); hàng xóm h_B=(0,1), h_C=(1,1). Aggregate = trung bình. (`.cell.given`)
- **① Gom tin hàng xóm (mean)** — `agg = ((0+1)/2, (1+1)/2) = (__, __)` → (0.5, 1). `.why`: trung bình cho biểu diễn "bối cảnh hàng xóm" của A, bất biến số lượng/thứ tự hàng xóm.
- **② Cập nhật nút A** — `h_A' = h_A + agg = (1+0.5, 0+1) = (__, __)` → (1.5, 1). `.hint`: cộng (hoặc nối + lớp tuyến tính) để trộn "bản thân" với "hàng xóm".
- **③ Chồng lớp** — sau lớp 2, A nhận tin từ hàng xóm của hàng xóm (bán kính 2). `.why`: chiều sâu GNN = bán kính thông tin; quá sâu → "over-smoothing" (mọi nút giống nhau).
- **④ Vì sao aggregate hoán vị-bất biến** · pill `sum/mean/max` — `.note`: hàng xóm **không có thứ tự** → hàm gom phải bất biến hoán vị (sum/mean/max), không phải nối theo thứ tự. SVG: nút A với 2 mũi tên tin từ B, C.

## 5. Tự kiểm tra (`.quiz`)
1. Một lớp GNN cho nút thấy gì? → `.qa` **Thông tin từ hàng xóm trực tiếp (bán kính 1).**
2. Vì sao hàm aggregate phải bất biến hoán vị? → `.qa` **Hàng xóm không có thứ tự cố định.**

## 6. Rút ra
> **Rút ra.** GNN = gom tin hàng xóm (mean/sum) + cập nhật nút; chồng lớp → bán kính lớn hơn. Bài tiếp (M2): học biểu diễn bằng đối lập — contrastive/InfoNCE.

## 7. `data-q` & số mẫu
- Sinh đặc trưng nút & hàng xóm nhỏ; mean + cập nhật.
- Khóa: `hA, hB, hC`; `agg1, agg2`, `hA1, hA2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| agg (mean) | (0.5, 1) |
| h_A' | (1.5, 1) |
