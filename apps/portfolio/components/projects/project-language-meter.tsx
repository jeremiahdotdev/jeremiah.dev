"use client";

import { memo, useState, type FC } from "react";

import type { Languages } from "@/types/languages";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/components/content/content-provider";
import { formatTemplate } from "@/lib/format-template";

interface ProjectLanguageMeterProps {
  languages: Languages;
}

const MAX_VISIBLE_LANGUAGES = 4;

const ProjectLanguageMeter: FC<ProjectLanguageMeterProps> = ({ languages }) => {
  const { projects: labels } = useDictionary();
  const [activeLanguageName, setActiveLanguageName] = useState("");
  const visibleLanguages = languages.slice(0, MAX_VISIBLE_LANGUAGES);

  if (!visibleLanguages.length) {
    return null;
  }

  const primaryLanguage =
    visibleLanguages.find((language) => language.name === activeLanguageName) ??
    visibleLanguages[0];

  return (
    <div
      role="group"
      aria-label={labels.languageBreakdown}
      className="space-y-3"
      title={visibleLanguages
        .map((language) => formatTemplate(labels.languageValue, { language: language.name, value: language.value }))
        .join("\n")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 truncate">
          <Typography as="span" variant="eyebrow">
            {primaryLanguage.name}
          </Typography>
        </div>
        <div className="shrink-0">
          <Typography as="span" variant="caption">{primaryLanguage.value}%</Typography>
        </div>
      </div>
      <div className="flex h-2 items-center overflow-hidden rounded-full bg-foreground/10">
        {visibleLanguages.map((language) => (
          <button
            type="button"
            key={language.name}
            className={cn(
              "h-1.5 shrink-0 opacity-80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground",
              primaryLanguage.name === language.name && "h-2 opacity-100",
            )}
            onMouseEnter={() => setActiveLanguageName(language.name)}
            onMouseLeave={() => setActiveLanguageName("")}
            onFocus={() => setActiveLanguageName(language.name)}
            onBlur={() => setActiveLanguageName("")}
            aria-label={formatTemplate(labels.languageValue, { language: language.name, value: language.value })}
            style={{
              width: `${language.value}%`,
              backgroundColor: language.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProjectLanguageMeter);
