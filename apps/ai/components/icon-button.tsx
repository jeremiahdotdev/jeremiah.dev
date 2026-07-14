import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconVariant = "arrow" | "check" | "close" | "mic" | "pause" | "speaker";

type IconButtonProps = {
  active?: boolean;
  children?: ReactNode;
  icon?: IconVariant;
  size?: "compact" | "default";
} & ButtonHTMLAttributes<HTMLButtonElement>;

function renderIcon(icon: IconVariant) {
  if (icon === "mic") {
    return (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 16 16">
        <path
          d="M8 2.2a2.2 2.2 0 0 0-2.2 2.2v3.2A2.2 2.2 0 0 0 8 9.8a2.2 2.2 0 0 0 2.2-2.2V4.4A2.2 2.2 0 0 0 8 2.2Zm-3.6 5a.7.7 0 1 1 1.4 0 2.2 2.2 0 1 0 4.4 0 .7.7 0 1 1 1.4 0 3.6 3.6 0 0 1-2.9 3.53V13a.7.7 0 1 1-1.4 0v-2.27A3.6 3.6 0 0 1 4.4 7.2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "speaker") {
    return (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 16 16">
        <path
          d="M7.13 3.3a.7.7 0 0 1 1.17.52v8.36a.7.7 0 0 1-1.17.52L4.6 10.4H3.1A1.1 1.1 0 0 1 2 9.3V6.7a1.1 1.1 0 0 1 1.1-1.1h1.5L7.13 3.3Zm3.22 2.04a.7.7 0 0 1 .99.02 3.76 3.76 0 0 1 0 5.28.7.7 0 1 1-1-1 2.36 2.36 0 0 0 0-3.3.7.7 0 0 1 .01-1Zm1.9-1.9a.7.7 0 0 1 .98.02 6.46 6.46 0 0 1 0 9.08.7.7 0 1 1-1-1 5.06 5.06 0 0 0 0-7.1.7.7 0 0 1 .02-1Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "pause") {
    return (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 16 16">
        <path
          d="M4.7 3.7c0-.39.31-.7.7-.7h1.4c.39 0 .7.31.7.7v8.6a.7.7 0 0 1-.7.7H5.4a.7.7 0 0 1-.7-.7V3.7Zm3.8 0c0-.39.31-.7.7-.7h1.4c.39 0 .7.31.7.7v8.6a.7.7 0 0 1-.7.7H9.2a.7.7 0 0 1-.7-.7V3.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "close") {
    return (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 16 16">
        <path
          d="M4.15 4.15a.5.5 0 0 1 .7 0L8 7.29l3.15-3.14a.5.5 0 0 1 .7.7L8.71 8l3.14 3.15a.5.5 0 0 1-.7.7L8 8.71l-3.15 3.14a.5.5 0 0 1-.7-.7L7.29 8 4.15 4.85a.5.5 0 0 1 0-.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (icon === "check") {
    return (
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 16 16">
        <path
          d="M6.2 11.6a.6.6 0 0 1-.42-.18L3.68 9.3a.6.6 0 1 1 .84-.84L6.2 10.15l5.28-5.27a.6.6 0 0 1 .84.84l-5.7 5.7a.6.6 0 0 1-.42.18Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 16 16">
      <path
        d="M3.35 8a.6.6 0 0 1 .6-.6h6.65L8.1 4.9a.6.6 0 1 1 .84-.84l3.52 3.52a.6.6 0 0 1 0 .84l-3.52 3.52a.6.6 0 0 1-.84-.84l2.5-2.5H3.95a.6.6 0 0 1-.6-.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconButton({
  active = false,
  children,
  className,
  icon,
  size = "default",
  style,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={`app-shimmer-surface relative z-1 grid cursor-pointer place-items-center self-center rounded-full border border-transparent font-mono text-lg font-medium leading-none text-app-foreground focus-visible:outline-none disabled:cursor-wait disabled:opacity-70 active:translate-y-px ${
        size === "compact"
          ? "h-8 w-8 min-w-8"
          : "h-12 w-12 min-w-12"
      } ${active && "text-app-foreground-strong"} ${className ?? ""}`}
      style={
        active
          ? {
              backgroundColor: "var(--button-active-background)",
              borderColor: "var(--button-active-border)",
              ...style,
            }
          : style
      }
      type={type}
    >
      <span className="grid h-5 w-5 place-items-center">
        {icon ? renderIcon(icon) : children}
      </span>
    </button>
  );
}
