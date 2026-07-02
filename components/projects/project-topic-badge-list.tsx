import { Badge } from "@/components/ui/badge";
import { TypographySmall } from "@/components/ui/typography";
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
        <div
          key={topic}
          className="min-w-0"
        >
          <Badge
            variant="outline"
            className={twMerge(
              "flex w-full justify-center rounded-none px-3 py-1.5",
              surfaceClassName
            )}
          >
            <TypographySmall className="tracking-wide">{topic}</TypographySmall>
          </Badge>
        </div>
      ))}
    </div>
  );
}
