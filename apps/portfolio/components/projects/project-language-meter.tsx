"use client";

import { memo, useState, type FC } from "react";

import type { Languages } from "@/types/languages";

interface ProjectLanguageMeterProps {
  languages: Languages;
}

const MAX_VISIBLE_LANGUAGES = 4;

const ProjectLanguageMeter: FC<ProjectLanguageMeterProps> = ({ languages }) => {
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
      className="space-y-2"
      title={visibleLanguages
        .map((language) => `${language.name}: ${language.value}%`)
        .join("\n")}
    >
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="truncate font-medium text-foreground">
          {primaryLanguage.name}
        </span>
        <span className="shrink-0">{primaryLanguage.value}%</span>
      </div>
      <div className="flex h-2 items-center overflow-hidden rounded-full bg-muted">
        {visibleLanguages.map((language) => (
          <button
            type="button"
            key={language.name}
            className="transition-all duration-200 focus-visible:outline-none"
            onMouseEnter={() => setActiveLanguageName(language.name)}
            onMouseLeave={() => setActiveLanguageName("")}
            onFocus={() => setActiveLanguageName(language.name)}
            onBlur={() => setActiveLanguageName("")}
            aria-label={`${language.name}: ${language.value}%`}
            tabIndex={0}
            style={{
              width: `${language.value}%`,
              backgroundColor: language.color,
              height:
                primaryLanguage.name === language.name ? "0.5rem" : "0.375rem",
              opacity: primaryLanguage.name === language.name ? 1 : 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProjectLanguageMeter);
