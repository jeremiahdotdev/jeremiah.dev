"use client";

import { memo, useEffect, useState, type FC } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: FC<ThemeToggleProps> = ({ className }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const isLight = resolvedTheme === "light";
  const iconClassName = isLight
    ? "h-[1.4rem] w-[1.4rem] text-black"
    : "h-[1.4rem] w-[1.4rem] text-white/70";

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(id);
    };
  }, []);

  return (
    <button
      aria-label="Toggle theme"
      className={`app-shimmer-surface inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-transparent text-black/70 shadow-sm backdrop-blur transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/70 dark:hover:text-white dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-black ${className ?? ""}`}
      onClick={() => isMounted && setTheme(isLight ? "dark" : "light")}
      type="button"
    >
      {!isMounted ? (
        <span aria-hidden="true" className="h-[1.4rem] w-[1.4rem]" />
      ) : isLight ? (
        <Moon className={iconClassName} />
      ) : (
        <Sun className={iconClassName} />
      )}
    </button>
  );
};

export default memo(ThemeToggle);
