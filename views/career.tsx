import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import DeferredTimeline from "@/components/career/deferred-timeline";
import { CareerEvent } from "@/types/job";
import PageSectionContent from "@/components/page/page-section-content";
import PageSectionHeader from "@/components/page/page-section-header";
import { getCareerData } from "@/server/getCareerData";
import type { Dictionary } from "@/types/dictionary";

async function loadCareerData(endDateDefault: string) {
  const data = await getCareerData(endDateDefault)
  return data
}

interface CareerProps {
  dictionary: Dictionary
}

export default async function Career({ dictionary }: CareerProps) {
  const $t = dictionary;
  const jobs: CareerEvent[] = await loadCareerData($t.timeline.endDateDefault)

  return (
    <PageSection id={$t.career.id} variant={PageSectionVariant.Secondary}>
      <PageSectionHeader>{$t.career.heading}</PageSectionHeader>
      <PageSectionContent>
        <DeferredTimeline events={jobs} />
      </PageSectionContent>
    </PageSection>
  );
}
