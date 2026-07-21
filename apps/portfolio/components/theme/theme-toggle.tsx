"use client"

import { memo, useMemo, useCallback, FC, useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useDictionary } from '@/components/content/content-provider';
import ControlBadgeToggle from "../controls/control-badge-toggle";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: FC<ThemeToggleProps> = ({className}: ThemeToggleProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const $t = useDictionary();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isPressed = resolvedTheme === "light"

  const setChangeTheme = useCallback((wasPressed: boolean) => {
    setTheme(wasPressed ? 'light' : 'dark')
  }, [setTheme]);

  // Memoized button component
  const toggle = useMemo(() => {
    if (!mounted) {
      return <span className={`aspect-square ${className}`} aria-hidden="true" />;
    }

    return (
      <ControlBadgeToggle className={className} aria-label={$t.theme.toggle} pressed={isPressed} onPressedChange={setChangeTheme}>
        { isPressed
          ? <Moon className="h-[1.4rem] w-[1.4rem]" />
          : <Sun className="h-[1.4rem] w-[1.4rem]" />
        }
      </ControlBadgeToggle>
    );
  }, [$t, mounted, isPressed, setChangeTheme, className]);

  return (toggle);
};

export default memo(ThemeToggle);
