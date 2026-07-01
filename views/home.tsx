import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import TypeHeading from "@/components/shared/type-heading";
import DevNote from "@/components/developer/dev-note";
import PageSectionContent from "@/components/page/page-section-content";
import { getSiteDictionary } from "@/sanity/lib/getSiteSettings";

export default async function Home() {
  const $t = await getSiteDictionary();

  return (
    <PageSection id={$t.home.id} variant={PageSectionVariant.Primary} showBorder={true} rotate={true}>
      <PageSectionContent className="relative">
          <TypeHeading end={$t.home.typeHeadingEnd} stack={$t.home.typeHeading} className="w-full h-full flex flex-col justify-center items-center h-screen"/>
      </PageSectionContent>
    </PageSection>
  );
}
