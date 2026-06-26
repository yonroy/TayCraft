# Bộ tool làm phiếu "Làm toán AI" (chỉ cho tác giả)

> Tool **chạy lúc soạn phiếu**, KHÔNG phải một phần của site tĩnh giao cho người học.
> Không cần `npm install` — thuần Node (≥18) + Edge headless (đã có sẵn trên máy). Không đụng `wb.css`/`wb-random.js`.

Chạy từ thư mục gốc dự án hoặc từ `ai-by-hand/`.

## 1. `new.mjs` — sinh khung phiếu giảng-giải
Tạo file phiếu mới theo skill [`/phieu-giai-thich`], **đã cân sẵn 2 trang** (sơ đồ + tự-kiểm-tra-đáp-án ở trang ĐÁP ÁN để trang ĐỀ không tràn). Chỉ còn điền toán vào các chỗ `/* TODO */`.

```bash
node ai-by-hand/tools/new.mjs <code> <slug> "<Tựa VI>" "<English>" [phút]
# ví dụ:
node ai-by-hand/tools/new.mjs A2 A2-do-dai-chuan "Độ dài & chuẩn" "Norm (L1, L2)" 12
```
- `--force` ghi đè nếu file đã tồn tại.
- Sinh ra `ai-by-hand/<slug>.html`.

## 2. `check.mjs` — đo tràn lề BẰNG SỐ (+ ảnh)
Thay cho màn tạo `_measure.html` thủ công. Chèn script đo (`scrollHeight − clientHeight` mỗi `.page`/`.sheet`), chạy Edge headless `--dump-dom` nhiều lần (mỗi lần `generate()` ra số random khác → bắt wrap xấu nhất), in tràn từng trang. Hợp cả phiếu classic (`.page`) lẫn canvas (`.sheet`).

```bash
node ai-by-hand/tools/check.mjs <file.html> [--runs N] [--shot] [--keep]
# ví dụ:
node ai-by-hand/tools/check.mjs A1-vecto-cong-tru.html --runs 5 --shot
```
- `--runs N` số lần đo (mặc định 3). Dùng 5 cho bài có số rộng.
- `--shot` chụp ảnh `<slug>.check.png` để soát mắt (SVG hiện? caption cắt?).
- `--keep` giữ bản tạm `._check_*.html` để mở thủ công khi debug.
- **Thoát code 1 nếu có trang tràn > 2px** → tiện gắn vào quy trình.

## Quy trình ra một phiếu
```bash
# 1) sinh khung
node ai-by-hand/tools/new.mjs A2 A2-do-dai-chuan "Độ dài & chuẩn" "Norm (L1, L2)" 12
# 2) điền toán vào /* TODO */  (sửa file bằng tay)
# 3) đo tràn tới khi ✅
node ai-by-hand/tools/check.mjs A2-do-dai-chuan.html --runs 5 --shot
# 4) đăng ký: bật thẻ trong ai-by-hand/index.html + available:true trong web/lib/lessons.ts
```

## Vì sao có bộ tool này
Phiếu hay **tràn lề rồi phải sửa** vì `.page` có `overflow:hidden` → tràn bị cắt âm thầm, mắt không thấy. `check.mjs` biến việc đo-bằng-số (vốn thủ công, hay quên) thành một lệnh; `new.mjs` đẻ sẵn khung đã cân 2 trang để bớt tràn ngay từ đầu. Xem thêm bài học "budget chiều cao trước khi viết".
