import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./style.module.css";

type CircleIconButtonProps = {
  active?: boolean;
  children: ReactNode;
  size?: "compact" | "default";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function CircleIconButton({
  active = false,
  children,
  className,
  size = "default",
  type = "button",
  ...props
}: CircleIconButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.button} ${
        size === "compact" ? styles.compact : styles.default
      } ${active ? styles.active : ""} ${className ?? ""}`}
      type={type}
    >
      <span className={styles.icon}>{children}</span>
    </button>
  );
}
