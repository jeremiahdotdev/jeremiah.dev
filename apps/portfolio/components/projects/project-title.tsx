"use client";

import { useLayoutEffect, useRef } from "react";
import { Typography } from "@/components/ui/typography";

export default function ProjectTitle({ name }: { name: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  return (
    <Typography ref={headingRef} as="h3" variant="display" forceWrap>
      <span ref={textRef} className="inline-block">{name}</span>
    </Typography>
  );
}
