"use client"

import { memo, useMemo, useCallback, FC } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useDictionary } from '@/components/content/content-provider';
import { Toggle } from "../ui/toggle";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: FC<ThemeToggleProps> = ({className}: ThemeToggleProps) => {
  const { setTheme, theme } = useTheme();
  const $t = useDictionary();
  const isPressed = theme === "light"

  const setChangeTheme = useCallback((wasPressed: boolean) => {
    setTheme(wasPressed ? 'light' : 'dark')
  }, [setTheme]);

  // Memoized button component
  const toggle = useMemo(() => (
    <Toggle className={`aspect-square ${className}`} aria-label={$t.theme.toggle} pressed={isPressed} onPressedChange={setChangeTheme}>
      { isPressed 
        ? <Moon className="h-[1.4rem] w-[1.4rem]" />
        : <Sun className="h-[1.4rem] w-[1.4rem]" />
      }
    </Toggle>
  ), [$t, isPressed, setChangeTheme, className]);

  return (toggle);
};

export default memo(ThemeToggle);
