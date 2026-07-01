import LinkedIn from "@/components/controls/linked-in";
import Menu from "@/components/controls/menu";
import Resume from "@/components/controls/resume";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function Controls() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 isolate">
        <div className="pointer-events-auto">
          <Menu/>
        </div>
        <ThemeToggle className="pointer-events-auto absolute right-0 top-0 z-30"/>
        <span className="pointer-events-auto absolute bottom-0 left-0 z-30 flex gap-4 p-4 pt-6">
          <LinkedIn/>
          <Resume/>
        </span>
    </div>
  );
}
