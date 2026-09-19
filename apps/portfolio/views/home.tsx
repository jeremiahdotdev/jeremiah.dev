import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import TypeHeading from "@/components/shared/type-heading";
import PageSectionContent from "@/components/page/page-section-content";
import type { Dictionary } from "@/types/dictionary";

interface HomeProps {
  dictionary: Dictionary
}

export default function Home({ dictionary }: HomeProps) {
  const $t = dictionary;

  return (
      <PageSection id={$t.home.id} variant={PageSectionVariant.Primary}>
      <PageSectionContent className="relative">
          <TypeHeading end={$t.home.typeHeadingEnd} stack={$t.home.typeHeading} className="flex h-full min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center md:min-h-0"/>
      </PageSectionContent>
    </PageSection>
  );
}
