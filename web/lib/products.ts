// Nguồn chân lý cho GÓI BÁN (product) và KHÓA (course).
// Thang giá "chim mồi" (decoy): K2 → K3 Pro → K4 Max (mồi) → K5 Full (đích).
// K4 Max = đủ 4 khóa nội dung hiện có; K5 Full = + trọn đời/phiếu tương lai/bonus, giá gần bằng
// → Full chi phối tuyệt đối Max. K1 miễn phí cho mọi người (xem FREE_COURSES trong lessons.ts).
import type { Course } from "./lessons";

// Giữ id "all-access" cho K5 Full để enrollment/đơn cũ vẫn được grandfather.
export type ProductId = "co-ban" | "k3" | "k4-max" | "all-access";

// Giá K5 Full early-bird = 349k (cố định để giữ tính toàn vẹn thang mồi: phải > K4 Max 329k;
// KHÔNG đọc COURSE_PRICE_VND nữa vì env cũ = 199k sẽ làm Full rẻ hơn mồi → vỡ decoy).
// Lộ trình giá đích khi đủ ~138 phiếu: 599k.
const FULL_PRICE = 349000;

export interface CourseMeta {
  id: Course;
  name: string;
  desc: string;
  prereq: Course[]; // khóa nên học trước
}

export const COURSES: CourseMeta[] = [
  { id: "K1", name: "Nền tảng AI", desc: "Toán nền + ML cổ điển + Nơ-ron/MLP", prereq: [] },
  { id: "K2", name: "Huấn luyện & Kiến trúc", desc: "Tối ưu + Chuẩn hóa + CNN + RNN/LSTM", prereq: ["K1"] },
  { id: "K3", name: "Transformer & LLM", desc: "Attention + LLM + Mô hình sinh", prereq: ["K1", "K2"] },
  { id: "K4", name: "Chuyên sâu & Dự án", desc: "RL + Đánh giá + Nâng cao + Capstone", prereq: ["K1", "K2"] },
];

export interface Product {
  id: ProductId;
  label: string;
  tagline?: string; // mô tả ngắn dưới tên gói
  // "all" = mở mọi khóa (gồm phiếu mới sau này); hoặc danh sách khóa cụ thể.
  courses: Course[] | "all";
  priceVnd: number;
  compareAtVnd?: number; // giá "mua lẻ cộng lại" để gạch ngang (neo)
  perks?: string[]; // gạch đầu dòng quyền lợi nổi bật (✓), hoặc điểm thiếu của mồi
  highlight?: boolean; // gói đích — làm nổi bật trên lưới
  active: boolean; // đang bán hay chưa
}

// Thang cộng dồn: gói cao gồm trọn khóa của gói thấp. Xếp K2 → … → K5 Full (đích).
export const PRODUCTS: Product[] = [
  {
    id: "co-ban",
    label: "K2 — Cơ bản",
    tagline: "Vào nghề: nền tảng + huấn luyện/kiến trúc",
    courses: ["K1", "K2"],
    priceVnd: 149000,
    perks: ["Gồm Khóa 1 (miễn phí) + Khóa 2", "Học một lần, dùng trọn đời"],
    active: true,
  },
  {
    id: "k3",
    label: "K3 Pro",
    tagline: "Thêm Transformer & LLM — phần được hỏi nhiều nhất",
    courses: ["K1", "K2", "K3"],
    priceVnd: 249000,
    compareAtVnd: 348000,
    perks: ["Gồm K1 + K2 + K3 (Transformer/LLM)"],
    active: true,
  },
  {
    id: "k4-max",
    label: "K4 Max",
    tagline: "Đủ cả 4 khóa hiện có",
    courses: ["K1", "K2", "K3", "K4"],
    priceVnd: 329000,
    compareAtVnd: 497000,
    perks: ["Trọn 4 khóa, 138 phiếu hiện có", "Không kèm phiếu ra trong tương lai", "Không kèm bonus"],
    active: true,
  },
  {
    id: "all-access",
    label: "K5 Full — Trọn bộ",
    tagline: "Tất cả + mọi phiếu tương lai, trọn đời",
    courses: "all",
    priceVnd: FULL_PRICE,
    compareAtVnd: 497000,
    perks: [
      "Trọn 4 khóa + mọi phiếu RA TRONG TƯƠNG LAI, trọn đời",
      "Bonus: phiếu capstone + cộng đồng",
      "Chỉ hơn K4 Max ~20k mà thêm trọn đời",
    ],
    highlight: true,
    active: true,
  },
];

export const DEFAULT_PRODUCT: ProductId = "all-access";

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

// Các gói mở được khóa này (luôn gồm all-access). Dùng cho kiểm quyền theo bài.
export function packagesGrantingCourse(course: Course): ProductId[] {
  return PRODUCTS.filter((p) => p.courses === "all" || p.courses.includes(course)).map((p) => p.id);
}

// Danh sách khóa một gói mở ("all" → cả 4 khóa). Dùng để liệt kê nội dung gói.
export function coursesOfProduct(p: Product): Course[] {
  return p.courses === "all" ? COURSES.map((c) => c.id) : p.courses;
}

// Các gói (Product) chứa khóa này — để header mỗi khóa ghi "Có trong gói…".
export function productsIncludingCourse(course: Course): Product[] {
  return PRODUCTS.filter((p) => p.courses === "all" || p.courses.includes(course));
}

export function isActiveProduct(id: string): boolean {
  return productById(id)?.active ?? false;
}
