"use client"

import { memo, useMemo, useCallback, FC, useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useDictionary } from '@/components/content/content-provider';
import { Toggle } from "../ui/toggle";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: FC<ThemeToggleProps> = ({className}: ThemeToggleProps) => {
  const { setTheme, theme } = useTheme();
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const $t = useDictionary();

  useEffect(() => {
    setIsPressed(theme === "light")
  }, [theme])

  const setChangeTheme = useCallback((wasPressed: boolean) => {
    setIsPressed(wasPressed)
    setTheme(wasPressed ? 'light' : 'dark')
  }, [setTheme, setIsPressed]);

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
