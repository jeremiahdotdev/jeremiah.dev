"use client";

import { useEffect, useMemo, useState } from "react";

export type LanguageEntry = {
  name: string;
  value: number;
  color: string;
};

interface ProjectLanguageMeterProps {
  languages: LanguageEntry[];
}

export default function ProjectLanguageMeter({
  languages,
}: ProjectLanguageMeterProps) {
  const defaultLanguageName = languages[0]?.name ?? "";
  const [activeLanguageName, setActiveLanguageName] = useState(
    defaultLanguageName
  );
  const [pinnedLanguageName, setPinnedLanguageName] = useState("");
  const [showLanguageList, setShowLanguageList] = useState(false);

  useEffect(() => {
    if (!languages.length) {
      setPinnedLanguageName("");
      setActiveLanguageName("");
      return;
    }

    if (
      pinnedLanguageName &&
      !languages.some((language) => language.name === pinnedLanguageName)
    ) {
      setPinnedLanguageName("");
    }

    if (!languages.some((language) => language.name === activeLanguageName)) {
      setActiveLanguageName(defaultLanguageName);
    }
  }, [languages, activeLanguageName, pinnedLanguageName, defaultLanguageName]);

  const activeLanguage =
    languages.find((language) => language.name === activeLanguageName) ??
    languages[0];

  const size = 144;
  const strokeWidth = 11;
  const activeStrokeWidth = 15;
  const radius = 57;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const segmentGap = 0;
  const visualMinPercent = 3;

  const segments = useMemo(() => {
    let offset = 0;
    const visualValues = languages.map((language) =>
      Math.max(language.value, visualMinPercent)
    );
    const visualTotal = visualValues.reduce((total, value) => total + value, 0);

    return languages.map((language, index) => {
      const visualValue = visualTotal
        ? (visualValues[index] / visualTotal) * 100
        : language.value;
      const rawLength = (visualValue / 100) * circumference;
      const gapLength = Math.min(segmentGap, rawLength * 0.5);
      const dashLength = Math.max(rawLength - gapLength, 0);
      const dashOffset = -(offset + gapLength / 2);
      offset += rawLength;

      return {
        ...language,
        dashLength,
        dashOffset,
      };
    });
  }, [languages, circumference, segmentGap, visualMinPercent]);

  if (!activeLanguage) return null;

  const inactiveSegments = segments.filter(
    (language) => language.name !== activeLanguage.name
  );
  const activeSegment = segments.find(
    (language) => language.name === activeLanguage.name
  );

  const renderSegment = (language: (typeof segments)[number]) => {
    const isActive = activeLanguage.name === language.name;
    const isPinned = pinnedLanguageName === language.name;

    const resetActiveLanguage = () => {
      setActiveLanguageName(pinnedLanguageName || defaultLanguageName);
    };

    const togglePinnedLanguage = () => {
      setPinnedLanguageName((currentPinned) => {
        const nextPinned = currentPinned === language.name ? "" : language.name;
        setActiveLanguageName(nextPinned || defaultLanguageName);
        return nextPinned;
      });
    };

    return (
      <circle
        key={language.name}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={language.color}
        strokeWidth={isActive ? activeStrokeWidth : strokeWidth}
        strokeLinecap="butt"
        strokeDasharray={`${language.dashLength} ${circumference - language.dashLength}`}
        strokeDashoffset={language.dashOffset}
        className="cursor-pointer transition-all duration-300 ease-out"
        style={{
          filter: isActive ? `drop-shadow(0 0 8px ${language.color})` : "none",
          opacity: isActive ? 1 : 0.72,
          transform: isActive || isPinned ? "scale(1.05)" : "scale(1)",
          transformOrigin: "center",
        }}
        onMouseEnter={() => setActiveLanguageName(language.name)}
        onMouseLeave={resetActiveLanguage}
        onFocus={() => setActiveLanguageName(language.name)}
        onBlur={resetActiveLanguage}
        onClick={() => {
          if (showLanguageList) return;
          togglePinnedLanguage();
        }}
        role="button"
        tabIndex={0}
        aria-label={`Select ${language.name} language segment`}
        aria-pressed={isPinned}
        onKeyDown={(event) => {
          if (showLanguageList) return;
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          togglePinnedLanguage();
        }}
      />
    );
  };

  return (
    <div
      className="portfolio-language-meter relative grid place-items-center rounded-full"
      style={{ width: size, height: size }}
      title={languages
        .map((language) => `${language.name}: ${language.value}%`)
        .join("\n")}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`absolute inset-0 -rotate-90 overflow-visible ${
          showLanguageList ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--border) / 0.55)"
          strokeWidth={strokeWidth}
        />

        {inactiveSegments.map(renderSegment)}
        {activeSegment ? renderSegment(activeSegment) : null}
      </svg>

      <button
        type="button"
        onClick={() => setShowLanguageList((current) => !current)}
        aria-label={
          showLanguageList
            ? "Show language meter"
            : "Show language percentage list"
        }
        aria-pressed={showLanguageList}
        className={
          showLanguageList
            ? "absolute inset-0 z-10 flex flex-col justify-center gap-1 text-left"
            : "relative z-10 flex min-w-20 min-h-20 flex-col items-center justify-center gap-1 text-center"
        }
      >
        {showLanguageList ? (
          <span className="flex w-full max-h-full flex-col gap-1 overflow-y-auto">
            {languages.map((language) => (
              <span
                key={language.name}
                className="portfolio-language-meter-row flex items-center justify-between gap-3 text-sm font-semibold"
              >
                <span className="truncate" style={{ color: language.color }}>
                  {language.name}
                </span>
                <span className="portfolio-language-meter-value shrink-0 text-foreground">
                  {language.value}%
                </span>
              </span>
            ))}
          </span>
        ) : (
          <>
            <span
              className="portfolio-language-meter-name transition-colors duration-300 text-md font-bold"
              style={{ color: activeLanguage.color }}
            >
              {activeLanguage.name}
            </span>
            <span className="portfolio-language-meter-value transition-colors duration-300 text-lg font-foreground font-bold">
              {activeLanguage.value}%
            </span>
          </>
        )}
      </button>
    </div>
  );
}
