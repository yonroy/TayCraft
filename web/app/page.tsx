import { cookies } from "next/headers";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LaunchPopup } from "@/components/launch-popup";
import { GiftPopup } from "@/components/gift-popup";
import { LandingCurriculum } from "@/components/landing-curriculum";
import { promoExpired } from "@/lib/promo";
import { getApprovedReviews } from "@/lib/reviews";
import { TOTAL_AVAILABLE, PARTS, FREE_SLUGS, lessonBySlug } from "@/lib/lessons";
import { PRODUCTS, COURSES, productById, effectivePriceVnd, type Product } from "@/lib/products";
import { effectiveGiftPercents, applyGift, GIFT_VISITOR_COOKIE } from "@/lib/gift";
import { getUser, accessibleCourses } from "@/lib/auth";
import { formatVnd } from "@/lib/utils";

const AVATAR_COLORS = ["#0e7490", "#b45309", "#166534", "#7c3aed"];

const FEATURES = [
  { icon: "🧮", t: "Không code", d: "Không cần biết lập trình. Chỉ cần bút chì, giấy A4 và phép cộng trừ nhân chia." },
  { icon: "🖨️", t: "In A4, giải bằng bút chì", d: "Mỗi phiếu 2 trang ĐỀ + ĐÁP ÁN, in ra và điền tay như làm bài tập ở trường." },
  { icon: "🎲", t: "Đổi số vô hạn", d: "Bấm nút là ra bộ số mới — luyện lại phiếu cũ tới khi thật sự nắm chắc." },
  { icon: "🪜", t: "Học theo thứ tự", d: "Lộ trình K1→K4 thiết kế tuần tự, mỗi bài xây trên nền bài trước, không nhảy cóc." },
];

// 1 phiếu đại diện mỗi phần A→N (14 phần) — ưu tiên H, I (Transformer/LLM) lên đầu vì
// khách quan tâm nhất tới đó. Ảnh thật lấy từ public/thumbs/<slug>.png (đã render sẵn).
const PREVIEW_SLUGS = [
  "H2-self-attention",
  "I5-lora",
  "A7-nhan-ma-tran-bien-doi-2d",
  "B6-pca",
  "C10-softmax",
  "D7-backpropagation",
  "E6-batchnorm",
  "F1-cnn-tich-chap",
  "G4-lstm-mot-o-nho",
  "J3-gan",
  "K6-policy-gradient-hieu-ro",
  "L1-confusion-matrix-hieu-ro",
  "M4-clip-hieu-ro",
  "N3-mini-gpt-hieu-ro",
];

const FAQS = [
  {
    q: "Phiếu tính tay là gì? Học kiểu gì?",
    a: "Mỗi phiếu là 1 file gồm 2 trang khổ A4: trang ĐỀ có ô trống để bạn tự điền số, trang ĐÁP ÁN để đối chiếu. Bạn in ra giấy, dùng bút chì tính tay từng bước — theo tinh thần “AI by Hand” của Prof. Tom Yeh. Có nút 🎲 để đổi bộ số bất kỳ lúc nào, luyện lại vô hạn lần.",
  },
  {
    q: "Trên YouTube có đầy tài liệu miễn phí, sao phải trả tiền?",
    a: "Xem video là học thụ động — xem xong dễ quên vì tay không làm gì cả. Phiếu tính tay bắt bạn tự điền từng con số, có nút 🎲 đổi số để luyện lại vô hạn lần, và đáp án đối chiếu ngay khi làm xong thay vì tự đoán đúng sai. Toàn bộ đi theo lộ trình K1→K4 liền mạch, không phải tự mò rải rác qua chục video khác nhau.",
  },
  {
    q: "Sao không có video giảng như các khóa học khác?",
    a: "Vì học bằng tay nhớ lâu hơn học bằng mắt. Xem giảng viên giải hộ trên video, lúc xem thấy hiểu nhưng não không phải tự xử lý gì nên quên rất nhanh. Phiếu tính tay bắt bạn tự tay điền từng ô — đúng cơ chế học chủ động, nhớ sâu hơn nhiều so với xem người khác làm.",
  },
  {
    q: "Tôi không biết lập trình, có học được không?",
    a: "Hoàn toàn được. Bộ phiếu không yêu cầu biết code — chỉ cần phép cộng trừ nhân chia và toán cấp 2. Mục tiêu là hiểu bản chất toán học đằng sau AI, không phải học lập trình.",
  },
  {
    q: "Không có máy in thì học được không?",
    a: "Được. Mở phiếu trên màn hình, tính ra giấy nháp rồi đối chiếu đáp án ở trang 2. Muốn bản giấy để giải bằng bút chì: bấm Lưu PDF rồi mang ra tiệm photo — mỗi bài chỉ 2 trang A4.",
  },
  {
    q: "Thanh toán và nhận bài thế nào?",
    a: "Thanh toán qua chuyển khoản quét mã QR ngân hàng. Sau khi chuyển thành công, hệ thống tự động mở khóa trong tài khoản của bạn, thường dưới 1 phút. Trả một lần, học trọn đời.",
  },
  {
    q: "Chính sách hoàn tiền ra sao?",
    a: "Hoàn tiền 100% trong vòng 7 ngày kể từ ngày mua, không cần lý do — nhắn Facebook hoặc email kèm mã chuyển khoản. Ngoài ra 3 phiếu đầu xem tự do trước khi mua.",
  },
];

function PackageCard({
  p,
  launchActive,
  giftPercent,
}: {
  p: Product;
  launchActive: boolean;
  giftPercent?: number | null;
}) {
  // Có quà còn hạn → thẻ hiện GIÁ ĐÃ GIẢM, gạch ngang giá thường + nhãn −N%. Giá gạch ngang lúc
  // này là giá thường (thứ khách thật sự tiết kiệm được), không phải compareAtVnd "mua lẻ cộng lại".
  const gift = applyGift(effectivePriceVnd(p), giftPercent);
  const price = gift.final;
  const old = gift.percent != null ? gift.base : p.compareAtVnd && p.compareAtVnd > price ? p.compareAtVnd : null;
  const featured = !!p.highlight;
  const launchRibbon = p.id === "k1" && launchActive;
  return (
    <div className={`pkg-card ${featured ? "featured" : ""}`}>
      {launchRibbon ? (
        <span className="pkg-launch-ribbon">🎉 Khai trương · chỉ {formatVnd(price)}</span>
      ) : (
        featured && <span className="pkg-ribbon">★ Phổ biến nhất</span>
      )}
      <div className="pkg-name">{p.label}</div>
      <div className="pkg-title">{p.tagline}</div>
      <div className="pkg-price-row">
        <span className="pkg-price">{formatVnd(price)}</span>
        {old && <span className="pkg-old">{formatVnd(old)}</span>}
        {gift.percent != null && <span className="pkg-off">−{gift.percent}%</span>}
      </div>
      {old && (
        <span className={`pkg-save ${gift.percent != null ? "gift" : ""}`}>
          {gift.percent != null ? "🎁 Quà tặng · tiết kiệm " : "Tiết kiệm "}
          {formatVnd(old - price)}
        </span>
      )}
      <div className="pkg-note">Trả một lần, học trọn đời</div>
      <ul className="pkg-feats">
        {(p.perks ?? []).map((perk) => (
          <li key={perk}>
            <span className="ck">✓</span> {perk}
          </li>
        ))}
      </ul>
      <Link
        href={`/checkout?product=${p.id}`}
        className={`btn ${featured ? "btn-amber" : p.id === "k1" ? "btn-primary" : "btn-ghost"}`}
      >
        Chọn gói {p.label.split(" · ")[0]}
      </Link>
    </div>
  );
}

export default async function Home() {
  const user = await getUser();
  const access = user ? await accessibleCourses(user.id) : [];
  const ownsK1 = access.includes("K1");
  // Hộp quà giờ giảm cho CẢ 4 GÓI → chỉ ẩn khi khách đã sở hữu TRỌN BỘ (không còn gì để bán).
  // Trước đây ẩn ngay khi có K1, tức người mua K1 rồi không bao giờ được mời nâng cấp Pro/Trọn bộ.
  const ownsEverything = COURSES.every((c) => access.includes(c.id));
  // % giảm còn hiệu lực của từng gói (1 query) → 4 thẻ giá hiện đúng số khách sẽ trả.
  // ĐỢT 2: tính cả quà ẩn danh theo cookie 'gv' → khách quay quà xong quay lại trang chủ vẫn
  // thấy 4 thẻ giá đã giảm dù chưa đăng nhập.
  const visitor = (await cookies()).get(GIFT_VISITOR_COOKIE)?.value ?? null;
  const giftPercents = await effectiveGiftPercents(user?.id ?? null, visitor);
  const launchActive = !promoExpired();
  const reviews = await getApprovedReviews();
  const reviewCount = reviews.length;
  const reviewAvg = reviewCount
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
    : null;

  const pro = productById("k3")!;
  const proPrice = effectivePriceVnd(pro);
  const proOld = pro.compareAtVnd ?? null;

  // Nguồn giá K1 DUY NHẤT cho mọi chỗ hiển thị ở trang này — không hardcode số nữa
  // (products.ts đã bỏ nhánh promo trong effectivePriceVnd, xem ADR-002).
  const k1 = productById("k1")!;
  const k1Price = effectivePriceVnd(k1);
  const k1Old = k1.compareAtVnd ?? null; // hiện null: K1 không còn giá gạch ngang nào

  return (
    <>
      <SiteHeader />
      {launchActive && !ownsK1 && <LaunchPopup />}
      {/* Promo khai trương hết → hộp quà giảm giá tiếp quản (tránh 2 popup cùng bung). */}
      {!launchActive && !ownsEverything && <GiftPopup />}

      <div className="lp">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="lpc hero-grid">
            <div className="hero-copy">
              {launchActive && (
                <div className="hero-badge-row">
                  <span className="pill-launch">🎉 100 suất khai trương</span>
                </div>
              )}
              <h1>
                Học AI bằng tay — <em>tự điền từng con số</em>, không code, không lý thuyết suông
              </h1>
              <p className="hero-lede">
                Hơn <strong>{TOTAL_AVAILABLE} phiếu tính tay</strong> khổ A4 theo tinh thần
                &ldquo;AI by Hand&rdquo; của Prof. Tom Yeh. Mỗi phiếu 2 trang ĐỀ + ĐÁP ÁN, in ra
                giải bằng bút chì, bấm 🎲 là ra bộ số mới — luyện tới khi thật sự hiểu.
              </p>
              <div className="hero-ctas">
                {launchActive && !ownsK1 ? (
                  <Link href="/checkout?product=k1" className="btn btn-primary btn-lg">
                    Nhận Khóa 1 — {formatVnd(k1Price)}
                  </Link>
                ) : (
                  <Link href="/checkout?product=k3" className="btn btn-primary btn-lg">
                    Mua gói Pro · {formatVnd(proPrice)}
                  </Link>
                )}
                <Link href="/learn/A1-vecto-cong-tru" className="btn btn-ghost btn-lg">
                  Xem thử 3 phiếu đầu miễn phí →
                </Link>
              </div>
              <p className="hero-sub-cta">
                Cam kết <Link href="#guarantee">hoàn tiền 100% trong 7 ngày</Link> nếu không phù hợp
              </p>
              <div className="hero-microproof">
                {reviewCount > 0 ? (
                  <div className="txt">
                    <span style={{ color: "#d97706", letterSpacing: "1px" }}>★</span>{" "}
                    <b>{reviewAvg}/5</b> · {reviewCount} đánh giá thật từ học viên
                  </div>
                ) : (
                  <div className="txt">
                    ✓ 3 phiếu đầu <b>xem miễn phí</b> · Hoàn tiền 100% trong 7 ngày
                  </div>
                )}
              </div>
            </div>

            {/* Hero visual: 2 tờ A4 xếp chồng — ẢNH PHIẾU THẬT, tờ trước tự xoay vòng */}
            <div className="hero-visual">
              <div className="floaty-tag tag-1">🎲 Đổi số vô hạn</div>
              <div className="floaty-tag tag-2">✓ 2 trang: ĐỀ + ĐÁP ÁN</div>
              <div className="sheet-stack">
                <div className="sheet sheet-back">
                  <img src="/hero/phieu-attention.png" alt="" aria-hidden="true" />
                </div>
                <div className="sheet sheet-front">
                  <div className="sheet-carousel">
                    <img
                      className="hero-slide s1"
                      src="/hero/phieu-nhan-ma-tran.png"
                      alt="Phiếu thật — Bài A7 · Nhân ma trận"
                    />
                    <img
                      className="hero-slide s2"
                      src="/hero/phieu-phep-chieu.png"
                      alt="Phiếu thật — Bài A5 · Phép chiếu vectơ"
                      aria-hidden="true"
                    />
                    <img
                      className="hero-slide s3"
                      src="/hero/phieu-cnn.png"
                      alt="Phiếu thật — Bài F1 · CNN tích chập"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="dice-badge">🎲</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ TRUST BAR (số thật) ============ */}
        <section className="trust-bar">
          <div className="lpc">
            <div className="trust-grid">
              <div className="trust-item">
                <div className="num">
                  {TOTAL_AVAILABLE}
                  <span className="unit">+</span>
                </div>
                <div className="lbl">phiếu tính tay</div>
              </div>
              <div className="trust-item">
                <div className="num">4</div>
                <div className="lbl">khóa · lộ trình rõ ràng</div>
              </div>
              <div className="trust-item">
                <div className="num">{PARTS.length}</div>
                <div className="lbl">phần nội dung</div>
              </div>
              <div className="trust-item">
                {reviewCount > 0 ? (
                  <>
                    <div className="num">
                      {reviewAvg}
                      <span className="unit">★</span>
                    </div>
                    <div className="lbl">{reviewCount} đánh giá học viên</div>
                  </>
                ) : (
                  <>
                    <div className="num">
                      ∞<span className="unit">🎲</span>
                    </div>
                    <div className="lbl">bộ số luyện lại mỗi phiếu</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ FEATURES ============ */}
        <section className="sec">
          <div className="lpc">
            <div className="sec-head">
              <span className="eyebrow">Vì sao khác biệt</span>
              <h2>Học bằng tay — nhớ lâu hơn học bằng mắt</h2>
              <p>Không xem video thụ động. Bạn tự tay tính từng con số cho tới khi cơ chế thấm vào tay.</p>
            </div>
            <div className="features-grid">
              {FEATURES.map((f) => (
                <div className="feature-card" key={f.t}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CURRICULUM ============ */}
        <section className="sec sec-alt" id="curriculum">
          <div className="lpc">
            <div className="sec-head">
              <span className="eyebrow">Lộ trình học</span>
              <h2>4 khóa — từ số 0 tới hiểu Transformer/LLM</h2>
              <p>Bấm vào từng khóa để xem các phần bên trong.</p>
            </div>
            <LandingCurriculum />
          </div>
        </section>

        {/* ============ PREVIEW SHEETS (ảnh phiếu thật) ============ */}
        <section className="sec" id="preview">
          <div className="lpc">
            <div className="sec-head">
              <span className="eyebrow">Xem trước phiếu thật</span>
              <h2>Không phải minh họa — đây là ảnh chụp phiếu thật</h2>
              <p>Mỗi ảnh dưới đây đại diện cho một phần trong lộ trình A→N, lấy thẳng từ bộ phiếu bạn sẽ nhận.</p>
            </div>

            <div className="pv-free-row">
              {FREE_SLUGS.map((slug) => {
                const l = lessonBySlug(slug);
                if (!l) return null;
                return (
                  <Link key={slug} href={`/learn/${slug}`} className="pv-free-card">
                    <span className="pv-free-tag">Xem miễn phí</span>
                    <div className="pv-free-thumb">
                      <img src={`/thumbs/${slug}.png`} alt={`Phiếu thật — Bài ${l.no} · ${l.title}`} loading="lazy" />
                    </div>
                    <div className="pv-free-title">{l.title}</div>
                  </Link>
                );
              })}
            </div>

            <div className="pv-grid">
              {PREVIEW_SLUGS.map((slug) => {
                const l = lessonBySlug(slug);
                if (!l) return null;
                return (
                  <div className="pv-card" key={slug}>
                    <div className="pv-thumb">
                      <img src={`/thumbs/${slug}.png`} alt={`Phiếu thật — Bài ${l.no} · ${l.title}`} loading="lazy" />
                      <span className="pv-part">Phần {l.part}</span>
                    </div>
                    <div className="pv-title">{l.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ REVIEWS (thật) ============ */}
        <section className="sec sec-alt" id="reviews">
          <div className="lpc">
            <div className="sec-head">
              <span className="eyebrow">Học viên nói gì</span>
              <h2>Cảm nhận thật từ người đã học</h2>
            </div>
            {reviewCount > 0 ? (
              <div className="reviews-grid">
                {reviews.slice(0, 6).map((r, i) => {
                  const initial = (r.name.trim().split(/\s+/).pop() ?? r.name).charAt(0).toUpperCase();
                  return (
                    <div className="review-card" key={r.id}>
                      <div className="review-stars">{"★".repeat(Math.round(r.rating))}</div>
                      <p className="review-quote">&ldquo;{r.comment}&rdquo;</p>
                      <div className="review-person">
                        <span
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {initial}
                        </span>
                        <div>
                          <div className="rname">{r.name}</div>
                          {r.role && <div className="rmeta">{r.role}</div>}
                          <div className="review-verified">✓ Đã mua khóa</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="reviews-empty">
                <p>
                  Bộ phiếu vừa ra mắt — bạn là một trong những học viên <b>đầu tiên</b>. Đã làm thử
                  phiếu nào rồi? Để lại vài dòng cảm nhận giúp người học sau nhé.
                </p>
                <Link href="/danh-gia" className="btn btn-primary">
                  Viết đánh giá đầu tiên →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ============ GUARANTEE ============ */}
        <section className="sec" id="guarantee">
          <div className="lpc">
            <div className="guarantee-box">
              <div className="guarantee-badge">🛡️</div>
              <div className="guarantee-txt">
                <h3>Cam kết hoàn tiền 100% trong 7 ngày</h3>
                <p>
                  Nếu sau 7 ngày cảm thấy không phù hợp với cách học &ldquo;làm toán bằng tay&rdquo;,
                  nhắn cho tụi mình qua Facebook hoặc email kèm mã chuyển khoản — hoàn lại toàn bộ số
                  tiền, không cần lý do. Ngoài ra 3 phiếu đầu xem tự do trước khi mua.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PACKAGES ============ */}
        <section className="sec sec-alt" id="packages">
          <div className="lpc">
            <div className="sec-head">
              <span className="eyebrow">Bảng giá</span>
              <h2>Chọn gói phù hợp — trả một lần, học trọn đời</h2>
              <p>Không phí ẩn, không gia hạn hàng tháng. Thanh toán QR chuyển khoản, kích hoạt tức thì.</p>
            </div>
            <div className="pkg-grid">
              {PRODUCTS.filter((p) => p.active).map((p) => (
                <PackageCard
                  key={p.id}
                  p={p}
                  launchActive={launchActive}
                  giftPercent={giftPercents[p.id] ?? null}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="sec" id="faq">
          <div className="lpc">
            <div className="sec-head">
              <span className="eyebrow">Câu hỏi thường gặp</span>
              <h2>Còn thắc mắc gì trước khi bắt đầu?</h2>
            </div>
            <div className="faq-list">
              {FAQS.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary className="faq-q">
                    <span>{f.q}</span>
                    <span className="plus">+</span>
                  </summary>
                  <p className="faq-a">{f.a}</p>
                </details>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: FAQS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="sec sec-alt">
          <div className="lpc">
            <div className="final-cta">
              {launchActive && !ownsK1 ? (
                <span className="eyebrow">🎉 100 suất khai trương</span>
              ) : (
                <span className="eyebrow">★ Gói được chọn nhiều nhất</span>
              )}
              <h2>Sẵn sàng hiểu AI từ gốc bằng chính đôi tay của bạn?</h2>
              {launchActive && !ownsK1 ? (
                <p>Khóa 1: nền tảng toán cho AI — vectơ, ma trận, đạo hàm, xác suất trước khi vào Deep Learning.</p>
              ) : (
                <p>Gói Pro: Khóa 1 + Khóa 2 + Khóa 3 — Toán nền tới Transformer &amp; LLM.</p>
              )}
              <div className="final-price-row">
                {launchActive && !ownsK1 ? (
                  <>
                    <span className="price">{formatVnd(k1Price)}</span>
                    {k1Old && k1Old > k1Price && <span className="old">{formatVnd(k1Old)}</span>}
                    {k1Old && k1Old > k1Price && (
                      <span className="save-tag">Tiết kiệm {formatVnd(k1Old - k1Price)}</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="price">{formatVnd(proPrice)}</span>
                    {proOld && proOld > proPrice && <span className="old">{formatVnd(proOld)}</span>}
                    {proOld && proOld > proPrice && (
                      <span className="save-tag">Tiết kiệm {formatVnd(proOld - proPrice)}</span>
                    )}
                  </>
                )}
              </div>
              <div className="final-cta-btns">
                {launchActive && !ownsK1 ? (
                  <Link href="/checkout?product=k1" className="btn btn-amber btn-lg">
                    Nhận Khóa 1 ngay
                  </Link>
                ) : (
                  <Link href="/checkout?product=k3" className="btn btn-amber btn-lg">
                    Mua gói Pro ngay
                  </Link>
                )}
                <Link
                  href="#curriculum"
                  className="btn btn-ghost btn-lg"
                  style={{ borderColor: "rgba(255,255,255,.3)", color: "#fff" }}
                >
                  Xem lộ trình chi tiết
                </Link>
              </div>
              <p className="final-cta-note">
                Trả một lần, học trọn đời · Hoàn tiền 7 ngày · Thanh toán QR an toàn
              </p>
            </div>
          </div>
        </section>

        {/* ============ STICKY MOBILE CTA ============ */}
        <div className="mobile-cta">
          <div className="mc-txt">
            {launchActive && !ownsK1 ? (
              <>
                <div className="mc-price">
                  {formatVnd(k1Price)}
                  {k1Old && k1Old > k1Price && <span className="mc-old">{formatVnd(k1Old)}</span>}
                </div>
                <div className="mc-label">Khóa 1 · ưu đãi khai trương</div>
              </>
            ) : (
              <>
                <div className="mc-price">{formatVnd(proPrice)}</div>
                <div className="mc-label">Gói Pro · trọn đời</div>
              </>
            )}
          </div>
          <Link
            href={launchActive && !ownsK1 ? "/checkout?product=k1" : "/checkout?product=k3"}
            className="btn btn-primary"
          >
            {launchActive && !ownsK1 ? "Nhận ngay" : "Mua ngay"}
          </Link>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
