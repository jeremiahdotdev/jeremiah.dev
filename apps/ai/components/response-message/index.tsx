import type { ReactNode } from "react";
import { forwardRef } from "react";

import styles from "./style.module.css";

type ResponseMessageProps = {
  actions?: ReactNode;
  children: ReactNode;
  kind?: "assistant" | "user";
  label?: string;
  tone?: "default" | "error";
};

export const ResponseMessage = forwardRef<HTMLElement, ResponseMessageProps>(
  function ResponseMessage(
    {
      actions,
      children,
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
        </div>
        <div
          className={`${styles.bubble} ${
            kind === "user" ? styles.userBubble : ""
          } ${tone === "error" ? styles.error : ""}`}
        >
          <p className={styles.content}>{children}</p>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
      </section>
    );
  },
);
