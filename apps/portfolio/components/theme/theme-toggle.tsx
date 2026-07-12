"use client"

import { memo, useMemo, useCallback, FC, useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useDictionary } from '@/components/content/content-provider';
import { Toggle } from "../ui/toggle";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: FC<ThemeToggleProps> = ({className}: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const $t = useDictionary();
  const [mounted, setMounted] = useState(false);
  const isPressed = resolvedTheme === "light"

  useEffect(() => {
    setMounted(true);
  }, []);

  const setChangeTheme = useCallback((wasPressed: boolean) => {
    setTheme(wasPressed ? 'light' : 'dark')
  }, [setTheme]);

  // Memoized button component
  const toggle = useMemo(() => {
    if (!mounted) {
      return <span className={`aspect-square ${className}`} aria-hidden="true" />;
    }

    return (
      <Toggle className={`aspect-square ${className}`} aria-label={$t.theme.toggle} pressed={isPressed} onPressedChange={setChangeTheme}>
        { isPressed
          ? <Moon className="h-[1.4rem] w-[1.4rem]" />
          : <Sun className="h-[1.4rem] w-[1.4rem]" />
        }
      </Toggle>
    );
  }, [$t, mounted, isPressed, setChangeTheme, className]);

  return (toggle);
};

export default memo(ThemeToggle);
