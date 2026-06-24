export function SiteFooter() {
  return (
    <footer className="border-t border-line mt-auto">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-dim flex flex-col sm:flex-row gap-2 justify-between">
        <p>© {new Date().getFullYear()} TayCraft · AI by Hand ✍️</p>
        <p>
          Cảm hứng:{" "}
          <a href="https://www.byhand.ai" target="_blank" rel="noreferrer" className="text-accent">
            Prof. Tom Yeh — AI by Hand
          </a>
        </p>
      </div>
    </footer>
  );
}
