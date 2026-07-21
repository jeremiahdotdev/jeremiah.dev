import LinkedIn from "@/components/controls/linked-in";
import Menu from "@/components/controls/menu";
import Resume from "@/components/controls/resume";
import AskAiFloat from "@/components/controls/ask-ai-float";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function Controls() {
  return (
    <div className="absolute h-screen pointer-events-none fixed inset-0 z-30 isolate">
        <div className="pointer-events-auto">
          <Menu/>
        </div>
        <ThemeToggle className="pointer-events-auto absolute right-2 top-2 z-30"/>
        <AskAiFloat className="pointer-events-auto fixed bottom-2 right-2 z-40"/>
        <span className="pointer-events-auto absolute bottom-8 left-2 z-40 flex gap-2">
          <LinkedIn/>
          <Resume/>
        </span>
    </div>
  );
}
