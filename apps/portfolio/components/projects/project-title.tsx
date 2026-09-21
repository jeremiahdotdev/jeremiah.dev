"use client";

import { useLayoutEffect, useRef } from "react";
import { Typography } from "@/components/ui/typography";

export default function ProjectTitle({ name }: { name: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const text = textRef.current;
    if (!heading || !text) return;
    let disposed = false;

    function fitTitle() {
      if (disposed || !heading || !text) return;
      heading.style.fontSize = "";
      const availableWidth = heading.getBoundingClientRect().width;
      const textWidth = text.getBoundingClientRect().width;
      if (availableWidth > 0 && textWidth > availableWidth) {
        const fontSize = parseFloat(getComputedStyle(heading).fontSize);
        heading.style.fontSize = `${fontSize * availableWidth / textWidth}px`;
      }
    }

    fitTitle();
    const observer = new ResizeObserver(fitTitle);
    observer.observe(heading);
    window.addEventListener("resize", fitTitle);
    document.fonts.addEventListener("loadingdone", fitTitle);
    void document.fonts.ready.then(fitTitle);

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", fitTitle);
      document.fonts.removeEventListener("loadingdone", fitTitle);
    };
  }, [name]);

  return (
    <Typography ref={headingRef} as="h3" variant="display" noWrap>
      <span ref={textRef} className="inline-block">{name}</span>
    </Typography>
  );
}
