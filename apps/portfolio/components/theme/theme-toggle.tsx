"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useDictionary } from "@/components/content/content-provider";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

const subscribe = () => () => {};

export default function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const $t = useDictionary();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={isDark ? $t.theme.light : $t.theme.dark}
      onClick={() => setTheme(nextTheme)}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <Typography as="span" variant="menu">{isDark ? $t.theme.light : $t.theme.dark}</Typography>
    </button>
  );
}
