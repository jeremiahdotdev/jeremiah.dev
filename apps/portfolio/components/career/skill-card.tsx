"use client";

import CardBase from "@/components/shared/card-base";
import { useDictionary } from "@/components/content/content-provider";
import { Typography } from "@/components/ui/typography";
import { formatTemplate } from "@/lib/format-template";
import type { Skill } from "@/types/skill";
import SkillLogo from "./skill-logo";

export default function SkillCard({ skill }: { skill: Skill }) {
  const $t = useDictionary();

  return (
    <CardBase
      asChild
      className="flex aspect-square w-full shrink-0 self-start flex-col items-center justify-center gap-2 rounded-full p-1 text-center transition-colors hover:border-foreground/30 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
    >
      <a
        href={skill.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={formatTemplate($t.career.skills.websiteAria, { skill: skill.subtitle })}
      >
        <div className="flex size-10 shrink-0 items-center justify-center sm:size-12">
          <SkillLogo skill={skill} />
        </div>
        <div className="max-w-full">
          <Typography as="span" variant="skill-label">
            {skill.subtitle}
          </Typography>
        </div>
      </a>
    </CardBase>
  );
}
