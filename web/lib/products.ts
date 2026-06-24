// Nguồn chân lý cho GÓI BÁN (product) và KHÓA (course).
// Pha 1: chỉ "all-access" đang bán (= bundle hiện tại). Gói lẻ định nghĩa sẵn, active=false,
// bật bán ở Pha 2 khi mỗi khóa đủ phiếu. Xem kế hoạch & ai-by-hand/MUC-LUC-DAY-DU.md.
import type { Course } from "./lessons";

export type ProductId = "co-ban" | "k3" | "nang-cao" | "all-access";

// Giá All-Access đồng bộ với đơn hiện tại (env COURSE_PRICE_VND, mặc định 199k early-bird).
const ALL_ACCESS_PRICE = Number(process.env.COURSE_PRICE_VND ?? 199000);

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
  // "all" = mở mọi khóa (gồm phiếu mới sau này); hoặc danh sách khóa cụ thể.
  courses: Course[] | "all";
  priceVnd: number;
  active: boolean; // đang bán hay chưa
}

export const PRODUCTS: Product[] = [
  { id: "co-ban", label: "Cơ bản (K1 + K2)", courses: ["K1", "K2"], priceVnd: 249000, active: false },
  { id: "k3", label: "Transformer & LLM (K3)", courses: ["K3"], priceVnd: 299000, active: false },
  { id: "nang-cao", label: "Nâng cao (K4)", courses: ["K4"], priceVnd: 199000, active: false },
  { id: "all-access", label: "Trọn bộ — All-Access", courses: "all", priceVnd: ALL_ACCESS_PRICE, active: true },
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
