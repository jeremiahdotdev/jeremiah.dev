import { Canvas } from "@/components/canvas";
import { Chat } from "@/components/chat";
import { Footer } from "@/components/footer";
import ThemeToggle from "@/components/theme-toggle";

export function Home() {
  return (
    <main className="page-shell">
      <Canvas />
      <div className="pointer-events-none absolute top-0 right-0 z-2 p-4">
        <ThemeToggle
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/75 text-black shadow-sm backdrop-blur transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-white dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-black"
        />
      </div>
      <Chat />
      <Footer />
    </main>
  );
}
