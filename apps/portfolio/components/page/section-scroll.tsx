"use client";

import { useEffect, useRef, type ComponentProps } from "react";

const entryThreshold = 0.1;
const scrollPause = 160;

export default function SectionScroll(props: ComponentProps<"main">) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let previousY = window.scrollY;
    let direction = 0;
    let timer = 0;
    let snapping = false;
    let pointerDown = false;
    let scrollPending = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function settleScroll() {
      if (snapping) {
        snapping = false;
        scrollPending = false;
        return;
      }
      if (!main || pointerDown || !direction) return;
      scrollPending = false;
      if (window.getSelection()?.isCollapsed === false) return;

      const viewportHeight = window.innerHeight;
      for (const section of main.querySelectorAll<HTMLElement>(":scope > section")) {
        const rect = section.getBoundingClientRect();
        const threshold = Math.min(rect.height, viewportHeight) * entryThreshold;
        const enteringBelow = direction > 0 && rect.top > 1 && viewportHeight - rect.top > threshold;
        const enteringAbove = direction < 0 && rect.bottom < viewportHeight - 1 && rect.bottom > threshold;
        if (!enteringBelow && !enteringAbove) continue;

        // Enter tall sections from the relevant edge without skipping their content.
        const offset = enteringBelow ? rect.top : rect.bottom - viewportHeight;
        snapping = true;
        window.scrollBy({ top: offset, behavior: reducedMotion.matches ? "instant" : "smooth" });
        timer = window.setTimeout(settleScroll, scrollPause);
        break;
      }
    }

    function scheduleSnap() {
      window.clearTimeout(timer);
      timer = window.setTimeout(settleScroll, scrollPause);
    }

    function onScroll() {
      const nextY = window.scrollY;
      if (nextY === previousY) return;
      direction = Math.sign(nextY - previousY);
      previousY = nextY;
      scrollPending = true;
      scheduleSnap();
    }

    function onPointerDown() {
      pointerDown = true;
      window.clearTimeout(timer);
    }

    function onPointerUp() {
      pointerDown = false;
      if (scrollPending) scheduleSnap();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return <main {...props} ref={mainRef} />;
}
