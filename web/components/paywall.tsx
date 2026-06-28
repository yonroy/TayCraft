import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/utils";

const PRICE = Number(process.env.COURSE_PRICE_VND ?? 199000);

export function Paywall({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-md text-center rounded-3xl border border-line bg-paper p-8 mt-10">
      <div className="text-4xl">🔒</div>
      <h2 className="mt-3 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-dim text-sm">
        Bài này nằm trong gói trả phí. Mua một lần để mở khóa tất cả {""}
        bài hiện có và bài ra trong tương lai.
      </p>
      <div className="mt-5 text-3xl font-extrabold text-accent">{formatVnd(PRICE)}</div>
      <div className="mt-5 flex flex-col gap-2">
        <Link href="/checkout">
          <Button size="lg" className="w-full">
            Mua gói
          </Button>
        </Link>
        <Link href="/learn/01-tich-vo-huong">
          <Button variant="ghost" size="sm">
            Xem lại bài miễn phí
          </Button>
        </Link>
      </div>
    </div>
  );
}
