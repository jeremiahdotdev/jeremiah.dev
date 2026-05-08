import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import TypeHeading from "@/components/shared/type-heading";
import { getDictionary } from '@/dictionaries';
import DevNote from "@/components/developer/dev-note";
import PageSectionContent from "@/components/page/page-section-content";

export default function Home() {
  const $t = getDictionary();

  return (
    <PageSection id={$t.home.id} variant={PageSectionVariant.Primary} showBorder={true}>
      <PageSectionContent>
          <TypeHeading end={$t.home.typeHeadingEnd} stack={$t.home.typeHeading} className="w-full h-full flex flex-col justify-center items-center h-screen"/>
      </PageSectionContent>
    </PageSection>
  );
}
