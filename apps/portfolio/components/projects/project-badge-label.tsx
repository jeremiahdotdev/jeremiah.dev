"use client";

import { useLayoutEffect, useRef } from "react";
import { Typography } from "@/components/ui/typography";

export default function ProjectBadgeLabel({ label }: { label: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;
    let disposed = false;

    function fitLabel() {
      if (disposed || !container || !text) return;
      container.style.removeProperty("--topic-badge-fit");
      container.style.removeProperty("--topic-badge-tracking");
      container.style.removeProperty("--topic-badge-width");
      const availableWidth = container.clientWidth;
      if (availableWidth <= 0 || text.scrollWidth <= availableWidth) return;

      // Preserve the measured space while the surrounding badge sizes to its text.
      container.style.setProperty("--topic-badge-width", `${availableWidth}px`);
      container.style.setProperty("--topic-badge-tracking", "-0.03em");
      if (text.scrollWidth > availableWidth) {
        let minimum = 0;
        let maximum = parseFloat(getComputedStyle(text).fontSize);
        for (let step = 0; step < 10; step += 1) {
          const fontSize = (minimum + maximum) / 2;
          container.style.setProperty("--topic-badge-fit", `${fontSize}px`);
          if (text.scrollWidth > availableWidth) maximum = fontSize;
          else minimum = fontSize;
        }
        container.style.setProperty("--topic-badge-fit", `${minimum}px`);
      }
    }

    fitLabel();
    const observer = new ResizeObserver(fitLabel);
    observer.observe(container);
    window.addEventListener("resize", fitLabel);
    document.fonts.addEventListener("loadingdone", fitLabel);
    void document.fonts.ready.then(fitLabel);

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", fitLabel);
      document.fonts.removeEventListener("loadingdone", fitLabel);
    };
  }, [label]);

  return (
    <span ref={containerRef} className="block min-w-[var(--topic-badge-width,0px)] max-w-full">
      <Typography ref={textRef} as="span" variant="topic-badge">{label}</Typography>
    </span>
  );
}
