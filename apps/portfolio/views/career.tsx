import { Typography } from "@/components/ui/typography";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import SectionCard from "@/components/shared/section-card";
import SectionHeading from "@/components/shared/section-heading";
import Timeline from "@/components/career/timeline";
import SectionContainer from "@/components/shared/section-container";
import { getCareerData } from "@/server/getCareerData";
import { getCareerMilestones } from "@/lib/career-milestones";
import type { Dictionary } from "@/types/dictionary";
import { formatTemplate } from "@/lib/format-template";

async function loadCareerData(endDateDefault: string) {
  const data = await getCareerData(endDateDefault)
  return data
}

interface CareerProps {
  dictionary: Dictionary
}

export default async function Career({ dictionary }: CareerProps) {
  const $t = dictionary;
  const { jobs, skills, experience: experienceYears } = await loadCareerData($t.timeline.endDateDefault)
  const experienceLabel = formatTemplate(
    experienceYears === 1 ? $t.career.experience.one : $t.career.experience.other,
    { count: experienceYears },
  );
  const milestones = getCareerMilestones(jobs, $t.timeline.endDateDefault);

  return (
    <PageSection id={$t.career.id} variant={PageSectionVariant.Primary} fitViewport={false}>
      <SectionContainer className="flex flex-1 flex-col justify-between gap-2 hlg:gap-3">
        <SectionCard className="shrink-0 py-3 hlg:py-5">
          <SectionHeading as="h2" label={$t.career.heading} metadata={experienceLabel} />
          <div className="mt-2">
            <Typography variant="intro">{$t.career.intro}</Typography>
          </div>
        </SectionCard>
        <Timeline milestones={milestones} skills={skills} />
      </SectionContainer>
    </PageSection>
  );
}
