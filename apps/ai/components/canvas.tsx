"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { mountCanvas } from "./canvas-mount";

export function Canvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const destroy = mountCanvas(host, resolvedTheme === "light" ? "light" : "dark");

    return () => {
      destroy();
    };
  }, [resolvedTheme]);

  return <div aria-hidden="true" className="absolute inset-0 h-full w-full" ref={hostRef} />;
}
