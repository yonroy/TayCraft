// Sinh link ảnh QR chuyển khoản qua dịch vụ ảnh miễn phí của VietQR (không cần API key).
// Tài liệu: https://www.vietqr.io/danh-sach-api/link-tao-ma-nhanh/
export function vietqrImageUrl(opts: {
  amount: number;
  addInfo: string; // nội dung chuyển khoản = transferCode
}): string {
  const bank = process.env.BANK_CODE ?? "";
  const account = process.env.BANK_ACCOUNT_NUMBER ?? "";
  const accountName = process.env.BANK_ACCOUNT_NAME ?? "";
  const params = new URLSearchParams({
    amount: String(opts.amount),
    addInfo: opts.addInfo,
    accountName,
  });
  return `https://img.vietqr.io/image/${bank}-${account}-compact2.png?${params.toString()}`;
}

export function bankInfo() {
  return {
    bank: process.env.BANK_CODE ?? "",
    account: process.env.BANK_ACCOUNT_NUMBER ?? "",
    accountName: process.env.BANK_ACCOUNT_NAME ?? "",
  };
}

// Mã chuyển khoản duy nhất, dễ đọc, không nhầm 0/O, I/1.
export function generateTransferCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TC${s}`;
}
