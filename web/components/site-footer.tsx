export function SiteFooter() {
  return (
    <footer className="border-t border-line mt-auto">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-dim flex flex-col sm:flex-row gap-2 justify-between">
        <p>© {new Date().getFullYear()} TayCraft · Làm toán AI ✍️</p>
        <div className="flex flex-col gap-1 sm:text-right">
          <p>
            Liên hệ:{" "}
            <a
              href="https://www.facebook.com/profile.php?id=61591262106772"
              target="_blank"
              rel="noreferrer"
              className="text-accent"
            >
              📘 Facebook
            </a>
          </p>
          <p>
            Cảm hứng:{" "}
            <a href="https://www.byhand.ai" target="_blank" rel="noreferrer" className="text-accent">
              Prof. Tom Yeh — AI by Hand
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
