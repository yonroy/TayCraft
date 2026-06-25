// Nguồn chân lý cho GÓI BÁN (product) và KHÓA (course).
// 3 bậc gọn (Goldilocks): Cơ bản → Pro (nổi bật, phổ biến nhất) → Trọn bộ.
// Khóa nền tảng (K1) miễn phí cho mọi người (xem FREE_COURSES trong lessons.ts).
// Cam kết bền vững: Trọn bộ = trọn đời nội dung hiện có + cập nhật mới free 12 tháng
// (không hứa "mọi phiếu tương lai trọn đời" để tránh gánh nặng vận hành).
import type { Course } from "./lessons";

// Giữ id "all-access" cho gói Trọn bộ để enrollment/đơn cũ vẫn được grandfather.
export type ProductId = "co-ban" | "k3" | "all-access";

// Giá gói Trọn bộ = 349k (cố định, không đọc COURSE_PRICE_VND vì env cũ = 199k sẽ phá thang giá).
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
  perks?: string[]; // gạch đầu dòng quyền lợi nổi bật
  highlight?: boolean; // gói nổi bật ("phổ biến nhất")
  badge?: string; // nhãn nhỏ góc thẻ (vd "Đầy đủ nhất")
  active: boolean; // đang bán hay chưa
}

// 3 bậc cộng dồn: gói cao gồm trọn khóa của gói thấp. Nổi bật ở giữa (Pro).
export const PRODUCTS: Product[] = [
  {
    id: "co-ban",
    label: "Cơ bản",
    tagline: "Nền tảng vững + huấn luyện & kiến trúc",
    courses: ["K1", "K2"],
    priceVnd: 149000,
    perks: ["Học một lần, xem trọn đời"],
    active: true,
  },
  {
    id: "k3",
    label: "Pro",
    tagline: "Thêm Transformer & LLM — phần được hỏi nhiều nhất",
    courses: ["K1", "K2", "K3"],
    priceVnd: 249000,
    compareAtVnd: 348000,
    perks: ["Gồm trọn gói Cơ bản", "Học một lần, xem trọn đời"],
    highlight: true,
    active: true,
  },
  {
    id: "all-access",
    label: "Trọn bộ",
    tagline: "Đủ mọi chủ đề, gồm chuyên sâu & dự án",
    courses: "all",
    priceVnd: FULL_PRICE,
    compareAtVnd: 497000,
    perks: [
      "Trọn đời nội dung hiện có",
      "Cập nhật mới miễn phí 12 tháng",
      "Bonus: dự án capstone + cộng đồng",
    ],
    badge: "Đầy đủ nhất",
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
