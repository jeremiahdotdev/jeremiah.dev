import ProjectDashboard from "@/components/projects/project-dashboard";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import { getProjectsData } from "@/server/getProjectsData";
import type { Dictionary } from "@/types/dictionary";

interface ProjectsProps {
  dictionary: Dictionary
}

export default async function Projects({ dictionary }: ProjectsProps) {
  const $t = dictionary;
  const projects = await getProjectsData()

  return (
    <PageSection id={$t.projects.id} variant={PageSectionVariant.Secondary} compactContent>
      <div className="flex w-full flex-1 flex-col overflow-x-clip py-4 lg:py-2">
        <ProjectDashboard projects={projects}/>
      </div>
    </PageSection>
  );
}
