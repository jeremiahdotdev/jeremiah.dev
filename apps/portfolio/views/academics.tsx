import CommendationList from "@/components/academics/commendation-list";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionContent from "@/components/page/page-section-content";
import PageSectionHeader from "@/components/page/page-section-header";
import { Academics as AcademicsType } from "@/types/academics";
import { getAcademicData } from '@/server/getAcademicData';
import AcademicSummaryCard from "@/components/academics/academic-summary-card";
import FocusList from "@/components/academics/focus-list";
import type { Dictionary } from "@/types/dictionary";

async function loadAcademicData(endDateDefault: string) {
  const data = await getAcademicData(endDateDefault)
  return data
}

interface AcademicsProps {
  dictionary: Dictionary
}

export default async function Academics({ dictionary }: AcademicsProps) {
  const $t = dictionary;
  const academics: AcademicsType = await loadAcademicData($t.timeline.endDateDefault)

  return (
    <PageSection id={$t.academics.id} variant={PageSectionVariant.Primary} showBorder={true}>
      <PageSectionHeader>{$t.academics.heading}</PageSectionHeader>
      <PageSectionContent>
        <div className="w-full py-8 md:py-10">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6">
            <div className="px-4 md:px-8">
              <AcademicSummaryCard academics={academics} institutionHref={$t.academics.cofo}/>
            </div>
            <FocusList focuses={academics.focuses} gpaLabel={$t.academics.focus.gpaLabel}/>
            <div className="flex flex-col gap-3 px-4 md:px-8">
              <CommendationList commendations={academics.commendations || []} />
            </div>
          </div>
        </div>
      </PageSectionContent>
    </PageSection>
  );
}
