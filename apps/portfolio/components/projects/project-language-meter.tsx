"use client";

import { MouseEvent } from "react";
import { useMemo, useState } from "react";

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
  const [hoveredLanguageName, setHoveredLanguageName] = useState("");
  const [pinnedLanguageName, setPinnedLanguageName] = useState("");
  const [showLanguageList, setShowLanguageList] = useState(false);
  const effectivePinnedLanguageName = languages.some(
    (language) => language.name === pinnedLanguageName
  )
    ? pinnedLanguageName
    : "";
  const effectiveHoveredLanguageName = languages.some(
    (language) => language.name === hoveredLanguageName
  )
    ? hoveredLanguageName
    : "";
  const activeLanguageName =
    effectiveHoveredLanguageName || effectivePinnedLanguageName || defaultLanguageName;
  const activeLanguage =
    languages.find((language) => language.name === activeLanguageName) ?? languages[0];

  const size = 144;
  const strokeWidth = 11;
  const activeStrokeWidth = 15;
  const radius = 57;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const segmentGap = 0;
  const visualMinPercent = 3;

  const segments = useMemo(() => {
    const visualValues = languages.map((language) =>
      Math.max(language.value, visualMinPercent)
    );
    const visualTotal = visualValues.reduce((total, value) => total + value, 0);

    return languages.reduce<(LanguageEntry & { dashLength: number; dashOffset: number })[]>(
      (allSegments, language, index) => {
      const offset = allSegments.reduce(
        (total, segment) => total + segment.dashLength,
        0
      );
      const visualValue = visualTotal
        ? (visualValues[index] / visualTotal) * 100
        : language.value;
      const rawLength = (visualValue / 100) * circumference;
      const gapLength = Math.min(segmentGap, rawLength * 0.5);
      const dashLength = Math.max(rawLength - gapLength, 0);
      const dashOffset = -(offset + gapLength / 2);

      allSegments.push({
        ...language,
        dashLength,
        dashOffset,
      });

      return allSegments;
    }, []);
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
    const isPinned = effectivePinnedLanguageName === language.name;

    const togglePinnedLanguage = () => {
      setPinnedLanguageName((currentPinned) =>
        currentPinned === language.name ? "" : language.name
      );
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
        onMouseEnter={() => setHoveredLanguageName(language.name)}
        onMouseLeave={() => setHoveredLanguageName("")}
        onFocus={() => setHoveredLanguageName(language.name)}
        onBlur={() => setHoveredLanguageName("")}
        onClick={(event) => {
          event.stopPropagation();
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
      onClick={(event) => event.stopPropagation()}
      title={languages
        .map((language) => `${language.name}: ${language.value}%`)
        .join("\n")}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`absolute inset-0 -rotate-90 overflow-visible ${
          showLanguageList ? "pointer-events-none" : ""
        }`}
        style={{
          opacity: showLanguageList ? 0 : 1,
          transform: `rotate(-90deg) scale(${showLanguageList ? 0.92 : 1})`,
          transformOrigin: "center",
          transition: "opacity 260ms ease, transform 260ms ease",
        }}
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
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          setShowLanguageList((current) => !current);
        }}
        aria-label={
          showLanguageList
            ? "Show language meter"
            : "Show language percentage list"
        }
        aria-pressed={showLanguageList}
        className="absolute inset-0 z-10 flex items-center justify-center p-0"
      >
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 text-center ${
            showLanguageList ? "pointer-events-none" : ""
          }`}
          style={{
            opacity: showLanguageList ? 0 : 1,
            transform: `scale(${showLanguageList ? 0.96 : 1}) translateY(${showLanguageList ? -4 : 0}px)`,
            transition: "opacity 220ms ease, transform 220ms ease",
          }}
        >
          <span
            className="portfolio-language-meter-name text-md font-bold transition-colors duration-300"
            style={{ color: activeLanguage.color }}
          >
            {activeLanguage.name}
          </span>
          <span className="portfolio-language-meter-value text-lg font-bold text-foreground transition-colors duration-300">
            {activeLanguage.value}%
          </span>
        </span>
        <span
          className={`absolute inset-0 flex w-full max-h-full flex-col justify-center gap-1 overflow-y-auto text-left ${
            showLanguageList ? "" : "pointer-events-none"
          }`}
          style={{
            opacity: showLanguageList ? 1 : 0,
            transform: `scale(${showLanguageList ? 1 : 0.96}) translateY(${showLanguageList ? 0 : 4}px)`,
            transition: "opacity 220ms ease, transform 220ms ease",
          }}
        >
          <span className="flex w-full flex-col gap-1">
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
        </span>
      </button>
    </div>
  );
}
