import ProjectDashboard from "@/components/projects/project-dashboard";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionHeader from "@/components/page/page-section-header";
import PageSectionContent from "@/components/page/page-section-content";
import { getProjectsData } from "@/server/getProjectsData";
import type { Dictionary } from "@/types/dictionary";

async function loadProjectData() {
  const data = await getProjectsData()
  return data
}

interface ProjectsProps {
  dictionary: Dictionary
}

export default async function Projects({ dictionary }: ProjectsProps) {
  const $t = dictionary;
  const projects = await loadProjectData()

  return (
    <PageSection id={$t.projects.id} variant={PageSectionVariant.Secondary}>
      <PageSectionHeader>{$t.projects.heading}</PageSectionHeader>
      <PageSectionContent>
        <div className="w-full lg:flex lg:min-h-0 lg:flex-1 lg:p-4">
          <ProjectDashboard projects={projects}/>
        </div>
      </PageSectionContent>
    </PageSection>
  );
}
