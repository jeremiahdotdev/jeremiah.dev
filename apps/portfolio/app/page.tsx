import { getCachedSiteSettings } from "@/sanity/lib/getCachedSiteSettings";
import Academics from "@/views/academics";
import Career from "@/views/career";
import Home from "@/views/home";
import Projects from "@/views/projects";
import Contact from "@/views/contact";
import Footer from "@/views/footer";
import Controls from "@/views/controls";

export default async function Page() {
  const settings = await getCachedSiteSettings();
  const { dictionary } = settings;

  return (
    <main className="home-transition-scope w-full flex min-h-screen flex-col">
      <Controls />
      {/* Sections */}
      <Home dictionary={dictionary} />
      <Career dictionary={dictionary} />
      <Academics dictionary={dictionary} />
      <Projects dictionary={dictionary} />
      <Contact dictionary={dictionary} />
      <Footer dictionary={dictionary} />
    </main>
  );
}
