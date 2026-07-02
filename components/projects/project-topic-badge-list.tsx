import { twMerge } from "tailwind-merge";

interface ProjectTopicBadgeListProps {
  topics: string[];
  surfaceClassName: string;
}

export default function ProjectTopicBadgeList({
  topics,
  surfaceClassName,
}: ProjectTopicBadgeListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {topics.map((topic) => (
        <div key={topic} className="min-w-0">
          <div
            className={twMerge(
              "portfolio-topic-badge flex w-full justify-center rounded-md px-3 py-1.5 text-center",
              surfaceClassName
            )}
          >
            <p>{topic}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
