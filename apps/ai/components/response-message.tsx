import type { ReactNode } from "react";
import { forwardRef, useEffect, useState } from "react";

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

  return (
    <p className="relative m-0 whitespace-pre-wrap">
      {animate ? visibleText : text}
    </p>
  );
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
        className={`app-rise-in relative z-1 inline-grid max-w-2xl gap-3 ${
          kind === "user" ? "ml-auto justify-items-end" : "justify-items-start"
        }`}
        ref={ref}
      >
        <div
          className={`flex w-full items-center gap-4 pl-1 ${
            kind === "user" ? "justify-end" : "justify-between"
          }`}
        >
          <div className="app-muted-copy font-mono text-xs tracking-widest">
            {label}
          </div>
          {control && <div className="flex justify-end">{control}</div>}
        </div>
        <div
          className={`app-bubble app-bubble-glow relative overflow-hidden rounded-2xl border px-5 py-4 leading-7 text-app-foreground backdrop-blur ${
            kind === "user" ? "app-bubble-user app-bubble-user-border" : "app-bubble-border"
          } ${tone === "error" && "app-bubble-error-border"}`}
        >
          <AnimatedContent animate={animate} text={String(children)} />
        </div>
      </section>
    );
  },
);
