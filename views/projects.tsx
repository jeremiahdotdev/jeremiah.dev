import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionHeader from "@/components/page/page-section-header";
import { getDictionary } from '@/dictionaries';
import PageSectionContent from "@/components/page/page-section-content";
import ProjectDashboard from "@/components/projects/project-dashboard";
import { getProjectsData } from "@/server/getProjectsData";

async function loadProjectData() {
  const data = await getProjectsData()
  return data
}

export default async function Projects() {
  const $t = getDictionary();
  const projects = await loadProjectData()

  return (
    <PageSection id={$t.projects.id} variant={PageSectionVariant.Secondary}>
      <PageSectionHeader>{$t.projects.heading}</PageSectionHeader>
      <PageSectionContent>
        <div className="w-full p-4 lg:flex lg:min-h-0 lg:flex-1">
          <ProjectDashboard projects={projects}/>
        </div>
      </PageSectionContent>
    </PageSection>
  );
}
