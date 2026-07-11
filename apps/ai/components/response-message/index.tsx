import type { ReactNode } from "react";
import { forwardRef, useEffect, useState } from "react";

import styles from "./style.module.css";

type ResponseMessageProps = {
  animate?: boolean;
  children: ReactNode;
  control?: ReactNode;
  kind?: "assistant" | "user";
  label?: string;
  tone?: "default" | "error";
};

function AnimatedContent({
  animate = false,
  text,
}: {
  animate?: boolean;
  text: string;
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    const mediaQuery =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    if (!animate || mediaQuery?.matches) {
      return;
    }

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
      }
    }, 12);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [animate, text]);

  return <p className={styles.content}>{animate ? visibleText : text}</p>;
}

export const ResponseMessage = forwardRef<HTMLElement, ResponseMessageProps>(
  function ResponseMessage(
    {
      animate = false,
      children,
      control,
      kind = "assistant",
      label = "jeremiah.dev",
      tone = "default",
    },
    ref,
  ) {
    return (
      <section
        aria-label={label}
        className={`${styles.shell} ${kind === "user" ? styles.userShell : ""}`}
        ref={ref}
      >
        <div className={styles.labelRow}>
          <div className={styles.label}>{label}</div>
          {control ? <div className={styles.control}>{control}</div> : null}
        </div>
        <div
          className={`${styles.bubble} ${
            kind === "user" ? styles.userBubble : ""
          } ${tone === "error" ? styles.error : ""}`}
        >
          <AnimatedContent animate={animate} text={String(children)} />
        </div>
      </section>
    );
  },
);
