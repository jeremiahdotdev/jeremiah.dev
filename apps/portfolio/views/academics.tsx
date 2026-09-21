import { Typography } from "@/components/ui/typography";
import SectionHeading from "@/components/shared/section-heading";
import SectionContainer from "@/components/shared/section-container";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from "@/types/page";
import { getAcademicData } from "@/server/getAcademicData";
import AcademicBadges from "@/components/academics/academic-badges";
import AcademicPerspective from "@/components/academics/academic-perspective";
import type { Dictionary } from "@/types/dictionary";

export default async function Academics({ dictionary: $t }: { dictionary: Dictionary }) {
  const academics = await getAcademicData($t.timeline.endDateDefault);
  const startYear = academics.startDate.match(/\d{4}/)?.[0] ?? academics.startDate;
  const endYear = academics.endDate.match(/\d{4}/)?.[0] ?? academics.endDate;

  return (
    <PageSection id={$t.academics.id} variant={PageSectionVariant.Secondary}>
      <SectionContainer className="grid flex-1 grid-rows-[auto_1fr] gap-x-10 gap-y-4 md:grid-rows-[auto_auto_1fr] lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12 xl:gap-x-16 hsm:gap-y-6 hlg:gap-y-10 h2xl:gap-y-14">
        <header className="lg:col-span-2">
          <SectionHeading label={$t.academics.heading} metadata={`${startYear}–${endYear}`} />
          <div className="mt-4 hlg:mt-6">
            <Typography as="h2" variant="heading">
              <a href={$t.academics.cofo} target="_blank" rel="noopener noreferrer" className="hover:opacity-75">{academics.institution}</a>
            </Typography>
          </div>
          <div className="mt-4 hlg:mt-6">
            <Typography variant="intro">
              {$t.academics.intro}
            </Typography>
          </div>
        </header>
        <div className="flex min-w-0 flex-col justify-center">
          <div className="sr-only"><Typography as="h3" variant="title">{$t.academics.focus.heading}</Typography></div>
          <div className="flex h-full flex-col justify-between">
            {academics.focuses.map((focus) => {
              const commendations = academics.commendations.filter((commendation) => commendation.focusKey === focus.key);
              return (
                <article key={focus.key} className="border-l border-foreground/20 pl-5 sm:pl-6 hsm:py-2 hlg:py-4 h2xl:py-6">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0"><Typography as="span" variant="eyebrow">{focus.type}</Typography></div>
                    {focus.gpa && (
                      <>
                        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-foreground/20" />
                        <div className="shrink-0"><Typography variant="caption">{$t.academics.focus.gpaLabel} {focus.gpa}</Typography></div>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <Typography as="h4" variant="title">{focus.name}</Typography>
                  </div>
                  <div className="mt-2 hlg:mt-3">
                    <Typography as="div" variant="body">{focus.description}</Typography>
                  </div>
                  {commendations.length > 0 && <AcademicBadges awards={commendations} label={$t.academics.awardsLabel} classNames="hsm:mt-3 hlg:mt-4" />}
                </article>
              );
            })}
          </div>
        </div>
        <div className="hidden min-w-0 md:block">
          <AcademicPerspective content={$t.academics.perspective} />
        </div>
      </SectionContainer>
    </PageSection>
  );
}
