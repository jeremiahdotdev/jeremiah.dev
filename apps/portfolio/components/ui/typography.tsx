import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

// Desktop sections floor the responsive type unit at its 1500px-wide value.
// Outside those sections, the fallback preserves the regular viewport type scale.
const typographyVariants = cva("not-italic", {
  variants: {
    variant: {
      display:
        "font-light font-title text-5xl leading-tight tracking-tighter normal-case text-foreground break-words sm:text-6xl lg:text-8xl",
      "project-title":
        "font-light font-title text-[length:min(var(--project-title-fit,6rem),var(--project-title-size))] [--project-title-size:3rem] sm:[--project-title-size:3.75rem] lg:[--project-title-size:6rem] leading-tight tracking-tighter normal-case text-foreground whitespace-nowrap",
      page:
        "font-light font-title text-[clamp(2.25rem,calc(4*var(--type-vw,1vw)),3.5rem)] leading-[1.05] tracking-[-0.045em] normal-case text-foreground [overflow-wrap:anywhere] md:text-[clamp(2.5rem,calc(4.5*var(--type-vw,1vw)),3.5rem)] lg:text-[clamp(3.5rem,calc(5.25*var(--type-vw,1vw)),4rem)]",
      "academic-heading":
        "font-light font-title text-[clamp(2.125rem,calc(3.75*var(--type-vw,1vw)),3.75rem)] leading-[1.05] tracking-[-0.045em] normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(3.5rem,calc(5.15*var(--type-vw,1vw)),4.25rem)]",
      "academic-intro":
        "font-light font-title text-[clamp(1.625rem,calc(2.5*var(--type-vw,1vw)),3rem)] leading-[1.15] tracking-[-0.035em] normal-case text-muted-foreground [overflow-wrap:anywhere] lg:text-[clamp(1.4375rem,calc(2.15*var(--type-vw,1vw)),2.5625rem)]",
      "academic-focus":
        "font-light font-title text-[1.75rem] leading-tight tracking-tight normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(2rem,calc(calc(4.0625*var(--type-vw,1vw))_-_0.65rem),3.25rem)]",
      "academic-body":
        "font-normal font-sans text-[15px] leading-relaxed tracking-normal normal-case text-muted-foreground lg:text-[clamp(1rem,calc(1.35*var(--type-vw,1vw)),1.3125rem)]",
      title:
        "font-light font-title text-[1.75rem] leading-tight tracking-tight normal-case text-foreground [overflow-wrap:anywhere] lg:text-[clamp(2.25rem,calc(calc(4.6875*var(--type-vw,1vw))_-_0.75rem),3.75rem)]",
      "role-title":
        "font-light font-title text-[clamp(2rem,calc(0.5rem_+_0.8*min(1vw,15px)_+_2.5vh),4rem)] leading-[1.05] tracking-[-0.055em] antialiased normal-case text-foreground [overflow-wrap:anywhere]",
      "career-intro":
        "font-light font-title text-[clamp(1.75rem,calc(0.75rem_+_1.6*min(1vw,15px)_+_1vh),3.75rem)] leading-tight tracking-tight normal-case text-foreground [overflow-wrap:anywhere]",
      "career-employer":
        "font-light font-sans text-[clamp(0.875rem,calc(0.75rem_+_0.35vw),1.125rem)] leading-normal tracking-normal normal-case text-muted-foreground/80",
      "diagram-title":
        "font-light font-title text-2xl leading-[1.05] tracking-tighter normal-case text-foreground whitespace-normal [overflow-wrap:anywhere] lg:text-3xl xl:text-4xl",
      "diagram-label":
        "font-normal font-mono text-xs leading-tight tracking-[0.1em] uppercase tabular-nums text-muted-foreground whitespace-normal [overflow-wrap:anywhere] lg:text-base",
      "diagram-body":
        "font-normal font-sans text-sm leading-snug tracking-tight normal-case text-muted-foreground whitespace-normal [overflow-wrap:anywhere] lg:text-lg",
      intro:
        "font-light font-title text-[clamp(1.5rem,calc(2.3*var(--type-vw,1vw)),2.75rem)] leading-[1.15] tracking-[-0.035em] normal-case text-muted-foreground [overflow-wrap:anywhere]",
      "project-intro":
        "font-medium font-title text-[clamp(1.625rem,calc(2.55*var(--type-vw,1vw)),3rem)] leading-[1.15] tracking-[-0.035em] normal-case text-muted-foreground [overflow-wrap:anywhere]",
      body:
        "font-normal font-sans text-base leading-relaxed tracking-normal normal-case text-foreground lg:text-[clamp(1.125rem,calc(1.5625*var(--type-vw,1vw)),1.5rem)]",
      "body-muted":
        "font-normal font-sans text-[15px] leading-relaxed tracking-normal normal-case text-muted-foreground lg:text-[clamp(1.125rem,calc(1.5625*var(--type-vw,1vw)),1.5rem)]",
      lead:
        "font-normal font-sans text-[clamp(1rem,calc(0.55rem_+_0.28*min(1vw,15px)_+_1vh),1.75rem)] leading-[1.4] tracking-normal normal-case text-muted-foreground",
      "section-label":
        "font-normal font-mono text-base leading-normal tracking-[0.16em] uppercase tabular-nums text-foreground sm:text-[clamp(1.125rem,calc(1.171875*var(--type-vw,1vw)),1.5rem)]",
      "detail-label":
        "font-normal font-mono text-xs leading-normal tracking-[0.2em] uppercase tabular-nums text-muted-foreground lg:text-[clamp(0.875rem,calc(1.041667*var(--type-vw,1vw)),1rem)]",
      menu:
        "font-normal font-serif text-lg leading-normal tracking-widest normal-case text-foreground/75 lg:text-sm [[aria-current=location]_&]:text-foreground",
      "menu-trigger":
        "font-normal font-serif text-sm leading-normal tracking-widest normal-case text-foreground/75",
      caption:
        "font-normal font-sans text-sm leading-normal tracking-normal normal-case tabular-nums text-muted-foreground lg:text-[clamp(1rem,calc(1.171875*var(--type-vw,1vw)),1.125rem)]",
      footer:
        "font-normal font-sans text-xs leading-normal tracking-normal normal-case tabular-nums text-muted-foreground",
      "skill-label":
        "font-light font-sans text-sm leading-normal tracking-tight normal-case tabular-nums text-muted-foreground lg:text-[clamp(1rem,calc(1.171875*var(--type-vw,1vw)),1.125rem)]",
      error:
        "font-normal font-sans text-sm leading-normal tracking-normal normal-case text-red-600 dark:text-red-400 lg:text-[clamp(1rem,calc(1.171875*var(--type-vw,1vw)),1.125rem)]",
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
