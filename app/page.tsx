import Academics from "@/views/academics";
import Career from "@/views/career";
import Home from "@/views/home";
import Projects from "@/views/projects";
import Contact from "@/views/contact";
import Footer from "@/views/footer";

export default function Page() {
  return (
    <main className="w-full flex min-h-screen flex-col">
      {/* Sections */}
      <Home />
      <Career />
      <Academics />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
