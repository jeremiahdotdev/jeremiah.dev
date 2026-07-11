"use client";

import { useEffect, useState } from "react";

const thinkingFrames = [
  "Thinking.\u00A0\u00A0",
  "Thinking..\u00A0",
  "Thinking...",
];

export function useThinkingLabel(active: boolean) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % thinkingFrames.length);
    }, 350);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [active]);

  return active ? thinkingFrames[frameIndex] : thinkingFrames[0];
}
