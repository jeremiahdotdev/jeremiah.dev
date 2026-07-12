import academicsProfile from "./profile-data/academics.json";
import aiProfile from "./profile-data/ai.json";
import careerProfile from "./profile-data/career.json";
import personalProfile from "./profile-data/personal.json";
import projectsProfile from "./profile-data/projects.json";
import theologyProfile from "./profile-data/theology.json";

type ApprovedProfileSection = {
  heading: string;
  points: string[];
};

type ApprovedProfileDocument = {
  description?: string;
  keywords: string[];
  sections: ApprovedProfileSection[];
};

const approvedProfileDocuments = {
  ai: aiProfile as ApprovedProfileDocument,
  career: careerProfile as ApprovedProfileDocument,
  academics: academicsProfile as ApprovedProfileDocument,
  theology: theologyProfile as ApprovedProfileDocument,
  personal: personalProfile as ApprovedProfileDocument,
  projects: projectsProfile as ApprovedProfileDocument,
};

export type ApprovedProfileTopic = keyof typeof approvedProfileDocuments;

export function getApprovedProfileTopics() {
  return Object.keys(approvedProfileDocuments) as ApprovedProfileTopic[];
}

function formatSections(sections: ApprovedProfileSection[]) {
  return sections
    .filter((section) => section.points.length > 0)
    .map((section) => {
      const points = section.points.map((point) => `- ${point}`).join("\n");
      return `## ${section.heading}\n${points}`;
    })
    .join("\n\n");
}

export function getApprovedProfileContext(
  topics: ApprovedProfileTopic[] = getApprovedProfileTopics(),
) {
  const sections = topics.flatMap((topic) => approvedProfileDocuments[topic].sections);

  return formatSections(sections);
}

export function getApprovedProfileDocuments() {
  return approvedProfileDocuments;
}
