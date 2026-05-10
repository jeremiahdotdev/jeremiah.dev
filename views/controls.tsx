import LinkedIn from "@/components/controls/linked-in";
import Menu from "@/components/controls/menu";
import Resume from "@/components/controls/resume";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function Controls() {
  return (
    <span className="z-50">
        <Menu/>
        <ThemeToggle className="absolute top-0 right-0"/>
        <span className="flex absolute bottom-0 left-0 gap-4 p-4 mt-2">
          <LinkedIn/>
          <Resume/>
        </span>
    </span>
  );
}
