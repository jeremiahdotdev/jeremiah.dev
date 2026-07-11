import { Chat } from "@/components/chat";
import { Footer } from "@/components/footer";
import { Canvas } from "@/components/canvas";

export default function HomePage() {
  return (
    <main className="page-shell">
      <Canvas />
      <div className="page-overlay" aria-hidden="true" />
      <Chat />
      <Footer />
    </main>
  );
}
