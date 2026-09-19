import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

// Keep responsive sizing in the shared CSS type scale.
const typographyVariants = cva("not-italic", {
  variants: {
    variant: {
      display:
        "font-light font-title text-5xl leading-tight tracking-tighter normal-case text-foreground break-words sm:text-6xl lg:text-8xl",
      page:
        "font-light font-title text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.045em] normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(3.75rem,5.625vw,4.5rem)]",
      "academic-heading":
        "font-light font-title text-[clamp(2.125rem,3.75vw,3.75rem)] leading-[1.05] tracking-[-0.045em] normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(4rem,6vw,4.875rem)]",
      "academic-intro":
        "font-light font-title text-[clamp(1.625rem,2.5vw,3rem)] leading-[1.15] tracking-[-0.035em] normal-case text-muted-foreground [overflow-wrap:anywhere]",
      title:
        "font-light font-title text-[1.75rem] leading-tight tracking-tight normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(2.25rem,calc(4.6875vw_-_0.75rem),3.75rem)]",
      "role-title":
        "font-light font-title text-[1.625rem] leading-tight tracking-[-0.055em] antialiased normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(2.125rem,calc(4.375vw_-_0.75rem),3.5rem)]",
      "diagram-title":
        "font-light font-title text-[clamp(2.5rem,3.3vw,3.75rem)] leading-tight tracking-tight normal-case text-foreground",
      "diagram-body":
        "font-normal font-sans text-[clamp(1.125rem,1.55vw,1.5rem)] leading-snug tracking-normal normal-case text-muted-foreground",
      "diagram-label":
        "font-normal font-mono text-[clamp(1rem,1.15vw,1.125rem)] leading-normal tracking-[0.2em] uppercase tabular-nums text-muted-foreground",
      intro:
        "font-light font-title text-[clamp(1.5rem,2.3vw,2.75rem)] leading-[1.15] tracking-[-0.035em] normal-case text-muted-foreground [overflow-wrap:anywhere]",
      "project-intro":
        "font-medium font-title text-[clamp(1.625rem,2.55vw,3rem)] leading-[1.15] tracking-[-0.035em] normal-case text-muted-foreground [overflow-wrap:anywhere]",
      body:
        "font-normal font-sans text-base leading-relaxed tracking-normal normal-case text-foreground lg:text-[clamp(1.125rem,1.5625vw,1.5rem)]",
      "body-muted":
        "font-normal font-sans text-[15px] leading-relaxed tracking-normal normal-case text-muted-foreground lg:text-[clamp(1.125rem,1.5625vw,1.5rem)]",
      lead:
        "font-normal font-sans text-base leading-relaxed tracking-normal normal-case text-muted-foreground lg:text-[clamp(1.25rem,1.7vw,1.625rem)]",
      "section-label":
        "font-normal font-mono text-base leading-normal tracking-[0.16em] uppercase tabular-nums text-foreground sm:text-[clamp(1.125rem,1.171875vw,1.5rem)]",
      "detail-label":
        "font-normal font-mono text-xs leading-normal tracking-[0.2em] uppercase tabular-nums text-muted-foreground lg:text-[clamp(0.875rem,1.041667vw,1rem)]",
      menu:
        "font-normal font-serif text-lg leading-normal tracking-widest normal-case text-foreground/75 lg:text-sm [[aria-current=location]_&]:text-foreground",
      caption:
        "font-normal font-sans text-sm leading-normal tracking-normal normal-case tabular-nums text-muted-foreground lg:text-[clamp(1rem,1.171875vw,1.125rem)]",
      footer:
        "font-normal font-sans text-xs leading-normal tracking-normal normal-case tabular-nums text-muted-foreground",
      "skill-label":
        "font-light font-sans text-sm leading-normal tracking-tight normal-case tabular-nums text-muted-foreground lg:text-[clamp(1rem,1.171875vw,1.125rem)]",
      error:
        "font-normal font-sans text-sm leading-normal tracking-normal normal-case text-red-600 dark:text-red-400 lg:text-[clamp(1rem,1.171875vw,1.125rem)]",
    },
    noWrap: {
      true: "whitespace-nowrap",
    },
  },
})

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>
type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "small" | "label" | "blockquote"

type TypographyProps<T extends TypographyElement = "p"> = {
  as?: T
  variant: TypographyVariant
  noWrap?: boolean
  className?: never
  style?: never
} & Omit<React.ComponentPropsWithRef<T>, "as" | "className" | "style" | "color">

function Typography<T extends TypographyElement = "p">({
  as,
  variant,
  noWrap,
  ...props
}: TypographyProps<T>) {
  return React.createElement(as ?? "p", {
    ...props,
    // Also prevent styles injected by a composing component from overriding the variant.
    className: typographyVariants({ variant, noWrap }),
    style: undefined,
  })
}

export { Typography }
export type { TypographyProps, TypographyVariant }
