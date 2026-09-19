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
  const focusKeys = new Set(academics.focuses.map((focus) => focus.key));
  const generalCommendations = academics.commendations.filter((commendation) => !commendation.focusKey || !focusKeys.has(commendation.focusKey));

  return (
    <PageSection id={$t.academics.id} variant={PageSectionVariant.Secondary} compactContent>
      <SectionContainer className="grid flex-1 grid-rows-[auto_1fr] gap-x-10 gap-y-6 md:grid-rows-[auto_auto_1fr] lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12 xl:gap-x-16">
        <header className="py-4 sm:py-5 lg:col-span-2">
          <SectionHeading label={$t.academics.heading} metadata={`${startYear}–${endYear}`} />
          <div className="mt-4">
            <Typography as="h2" variant="academic-heading">
              <a href={$t.academics.cofo} target="_blank" rel="noopener noreferrer" className="hover:opacity-75">{academics.institution}</a>
            </Typography>
          </div>
          <div className="mt-4">
            <Typography variant="academic-intro">
              {$t.academics.intro}
            </Typography>
          </div>
        </header>
        <div className="flex min-w-0 flex-col justify-center">
          <div className="sr-only"><Typography as="h3" variant="title">{$t.academics.focus.heading}</Typography></div>
          <div className="grid gap-3">
            {academics.focuses.map((focus) => {
              const commendations = academics.commendations.filter((commendation) => commendation.focusKey === focus.key);
              return (
                <article key={focus.key} className="border-l border-foreground/20 py-3 pl-5 sm:pl-6">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0"><Typography as="span" variant="detail-label">{focus.type}</Typography></div>
                    {focus.gpa && (
                      <>
                        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-foreground/20" />
                        <div className="shrink-0"><Typography variant="caption">{$t.academics.focus.gpaLabel} {focus.gpa}</Typography></div>
                      </>
                    )}
                  </div>
                  <div className="mt-1"><Typography as="h4" variant="academic-focus">{focus.name}</Typography></div>
                  <div className="mt-2"><Typography as="div" variant="academic-body">{focus.description}</Typography></div>
                  {commendations.length > 0 && <AcademicBadges awards={commendations} label={$t.academics.awardsLabel} />}
                </article>
              );
            })}
            {generalCommendations.length > 0 && <AcademicBadges awards={generalCommendations} label={$t.academics.awardsLabel} />}
          </div>
        </div>
        <div className="hidden min-w-0 md:block">
          <AcademicPerspective content={$t.academics.perspective} />
        </div>
      </SectionContainer>
    </PageSection>
  );
}
