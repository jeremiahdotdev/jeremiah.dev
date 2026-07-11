"use client";

import { useEffect, useRef } from "react";

import { mountCanvas } from "./mount";

export function Canvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const destroy = mountCanvas(host);

    return () => {
      destroy();
    };
  }, []);

  return <div aria-hidden="true" className="canvas" ref={hostRef} />;
}
