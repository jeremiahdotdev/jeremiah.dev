import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import Timeline from "@/components/career/timeline";
import { CareerEvent } from "@/types/job";
import PageSectionContent from "@/components/page/page-section-content";
import PageSectionHeader from "@/components/page/page-section-header";
import { getCareerData } from "@/server/getCareerData";
import { getSiteDictionary } from "@/sanity/lib/getSiteSettings";

async function loadCareerData() {
  const data = await getCareerData()
  return data
}

export default async function Career() {
  const jobs: CareerEvent[] = await loadCareerData()
  const $t = await getSiteDictionary();

  return (
    <PageSection id={$t.career.id} variant={PageSectionVariant.Secondary}>
      <PageSectionHeader>{$t.career.heading}</PageSectionHeader>
      <PageSectionContent>
        <Timeline events={jobs}></Timeline>
      </PageSectionContent>
    </PageSection>
  );
}
