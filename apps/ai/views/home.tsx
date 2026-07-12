import { Canvas } from "@/components/canvas";
import { Chat } from "@/components/chat";
import { Footer } from "@/components/footer";

export function Home() {
  return (
    <main className="page-shell">
      <Canvas />
      <Chat />
      <Footer />
    </main>
  );
}
