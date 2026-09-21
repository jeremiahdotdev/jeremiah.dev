"use client";

import { useDictionary } from "@/components/content/content-provider";
import { Typography } from "@/components/ui/typography";
import { formatTemplate } from "@/lib/format-template";
import type { Skill } from "@/types/skill";
import SkillLogo from "./skill-logo";

export default function SkillCard({ skill }: { skill: Skill }) {
  const $t = useDictionary();

  return (
    <div
      className="flex aspect-square w-full  self-start flex-col items-center justify-center rounded-full text-center transition-colors hover:border-foreground/30 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
    >
      <a
        href={skill.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={formatTemplate($t.career.skills.websiteAria, { skill: skill.subtitle })}
        className="flex flex-col gap-1 justify-center items-center sm:w-12 md:w-20"
      >
        <div className="flex shrink-0 items-center justify-center w-12 md:w-20">
          <SkillLogo skill={skill} />
        </div>
        <Typography as="span" variant="label">
          {skill.subtitle === "React Native" ? "Native" : skill.subtitle}
        </Typography>
      </a>
    </div>
  );
}
