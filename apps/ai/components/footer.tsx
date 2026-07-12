export function Footer() {
  return (
    <footer className="pointer-events-none absolute right-0 bottom-0 left-0 z-1 flex items-center justify-between gap-4 px-6 py-4">
      <p className="app-subtle-copy m-0 font-mono text-xs tracking-wide">
        Protected by Cloudflare.
      </p>
      <a
        className="app-subtle-copy pointer-events-auto font-mono text-xs tracking-wide no-underline transition-colors hover:text-app-foreground focus-visible:text-app-foreground focus-visible:outline-none"
        href="https://jeremiah.dev"
        rel="noreferrer"
        target="_blank"
      >
        jeremiah.dev
      </a>
    </footer>
  );
}
