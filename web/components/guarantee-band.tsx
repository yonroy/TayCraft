// Dải cam kết hoàn tiền — trấn an ngay trước lời mời mua (chính sách thật, có trong FAQ).
export function GuaranteeBand() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-6">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-accent/30 bg-accent/5 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full bg-accent text-white shadow-sm">
          <span className="text-xl font-extrabold leading-none">7</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">ngày</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">Hoàn tiền 100% trong 7 ngày — không hỏi lý do</h3>
          <p className="mt-1 text-sm text-dim">
            Thử phiếu thoải mái. Thấy không phù hợp, nhắn Facebook hoặc email kèm mã chuyển khoản là
            được hoàn đúng số tiền đã trả. Ngoài ra 3 phiếu đầu xem tự do trước khi mua.
          </p>
        </div>
      </div>
    </section>
  );
}
