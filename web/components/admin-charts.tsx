// Biểu đồ SVG thuần cho dashboard admin — không phụ thuộc thư viện, render phía server.
import type { DayPoint, FunnelStep } from "@/lib/admin-stats";

// Biểu đồ cột dọc cho chuỗi 30 ngày. Tooltip qua <title>, nhãn trục đáy thưa (mỗi 5 ngày).
export function BarChart({
  data,
  color = "var(--color-accent)",
  format,
  height = 120,
}: {
  data: DayPoint[];
  color?: string;
  format?: (v: number) => string;
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 100; // viewBox đơn vị %, scale theo container
  const n = data.length || 1;
  const gap = 0.18; // tỉ lệ khe giữa cột
  const bw = w / n;
  const fmt = format ?? ((v: number) => String(v));

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        role="img"
      >
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 4);
          const x = i * bw + (bw * gap) / 2;
          const bwInner = bw * (1 - gap);
          return (
            <rect
              key={d.day}
              x={x}
              y={height - h}
              width={bwInner}
              height={Math.max(d.value > 0 ? 1 : 0, h)}
              rx={0.6}
              fill={color}
              opacity={i === data.length - 1 ? 1 : 0.78}
            >
              <title>
                {d.day}: {fmt(d.value)}
              </title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-dim">
        <span>{data[0]?.day.slice(5)}</span>
        <span>{data[Math.floor(n / 2)]?.day.slice(5)}</span>
        <span>{data[n - 1]?.day.slice(5)}</span>
      </div>
    </div>
  );
}

// Phễu chuyển đổi: thanh ngang thu hẹp dần theo giá trị, kèm % so với bước đầu.
export function FunnelBars({ steps }: { steps: FunnelStep[] }) {
  const top = Math.max(1, steps[0]?.value ?? 1);
  const colors = [
    "var(--color-accent)",
    "var(--color-accent)",
    "var(--color-accent-2)",
    "#7c5cff",
  ];
  return (
    <div className="space-y-2">
      {steps.map((st, i) => {
        const pct = (st.value / top) * 100;
        const prev = i > 0 ? steps[i - 1].value : st.value;
        const drop = prev > 0 ? (st.value / prev) * 100 : 100;
        return (
          <div key={st.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink">{st.label}</span>
              <span className="text-dim">
                <b className="text-ink">{st.value.toLocaleString("vi-VN")}</b>
                {i > 0 && <span className="ml-2 text-xs">{drop.toFixed(0)}%↓</span>}
              </span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-paper">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(pct, st.value > 0 ? 4 : 0)}%`,
                  background: colors[i] ?? "var(--color-accent)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
