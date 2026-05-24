import CommendationList from "@/components/academics/commendation-list";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionContent from "@/components/page/page-section-content";
import PageSectionHeader from "@/components/page/page-section-header";
import { Academics as AcademicsType } from "@/types/academics";
import { getAcademicData } from '@/server/getAcademicData';
import AcademicSummaryCard from "@/components/academics/academic-summary-card";
import FocusList from "@/components/academics/focus-list";
import { getSiteDictionary } from "@/sanity/lib/getSiteSettings";

async function loadAcademicData() {
  const data = await getAcademicData()
  return data
}

export default async function Academics() {
  const academics: AcademicsType = await loadAcademicData()
  const $t = await getSiteDictionary();

  return (
    <PageSection id={$t.academics.id} variant={PageSectionVariant.Primary} showBorder={true}>
      <PageSectionHeader>{$t.academics.heading}</PageSectionHeader>
      <PageSectionContent>
        <div className="w-full px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <AcademicSummaryCard academics={academics} institutionHref={$t.academics.cofo}/>
            <FocusList focuses={academics.focuses} gpaLabel={$t.academics.focus.gpaLabel}/>
            <div className="flex flex-col gap-3">
              <hr></hr>
              <CommendationList commendations={academics.commendations || []} />
            </div>
          </div>
        </div>
      </PageSectionContent>
    </PageSection>
  );
}
