import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

// Shared variants own all responsive typography; callers only choose semantics.
const typographyVariants = cva("not-italic", {
  variants: {
    variant: {
      display:
        "font-light font-title text-5xl sm:text-6xl lg:text-8xl leading-tight tracking-tighter normal-case text-foreground [overflow-wrap:anywhere]",
      heading:
        "font-light font-title text-4xl sm:text-5xl lg:text-6xl hlg:text-5xl lg:hlg:text-6xl h2xl:text-6xl lg:h2xl:text-7xl leading-tight tracking-tighter normal-case text-foreground [overflow-wrap:anywhere]",
      title:
        "font-light font-title text-xl sm:text-3xl hsm:text-3xl hlg:text-4xl h2xl:text-5xl leading-tight tracking-tight normal-case text-foreground",
      intro:
        "font-light font-title text-2xl sm:text-3xl lg:text-4xl hlg:text-3xl lg:hlg:text-4xl h2xl:text-4xl lg:h2xl:text-5xl leading-tight tracking-tight normal-case text-muted-foreground [overflow-wrap:anywhere]",
      body:
        "font-normal font-sans text-base sm:text-xl sm:hmd:text-xl sm:hsm:text-xl sm:h2xl:text-3xl md:text-4xl lg:text-4xl xl:text-6xl leading-relaxed tracking-normal normal-case text-muted-foreground",
      label:
        "font-normal whitespace-nowrap font-mono text-base leading-normal tracking-widest uppercase tabular-nums text-foreground sm:text-lg",
      eyebrow:
        "font-normal font-mono text-xs lg:text-sm hlg:text-sm h2xl:text-base uppercase tabular-nums text-muted-foreground",
      caption:
        "font-light font-sans text-sm lg:text-base hsm:text-base hlg:text-lg h2xl:text-xl leading-normal tracking-normal normal-case tabular-nums text-muted-foreground [[data-fitting]_&]:tracking-tight",
      navigation:
        "font-normal font-serif text-md leading-normal tracking-wide normal-case text-foreground/75 sm:text-md lg:text-md [[aria-current=location]_&]:text-foreground",
      error:
        "font-normal font-sans text-sm leading-normal tracking-normal normal-case text-red-600 dark:text-red-400 lg:text-base",
    },
    noWrap: {
      true: "whitespace-nowrap",
    },
    hoverable: {
      true: "transition-opacity duration-200 hover:opacity-60 focus-visible:opacity-60 group-hover/typography:opacity-60 group-focus-visible/typography:opacity-60 motion-reduce:transition-none",
    },
  },
})

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>
type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "small" | "label" | "blockquote"

type TypographyProps<T extends TypographyElement = "p"> = {
  as?: T
  variant: TypographyVariant
  noWrap?: boolean
  hoverable?: boolean
  className?: never
  style?: never
} & Omit<React.ComponentPropsWithRef<T>, "as" | "className" | "style" | "color">

function Typography<T extends TypographyElement = "p">({
  as,
  variant,
  noWrap,
  hoverable,
  ...props
}: TypographyProps<T>) {
  return React.createElement(as ?? "p", {
    ...props,
    // Also prevent styles injected by a composing component from overriding the variant.
    className: typographyVariants({ variant, noWrap, hoverable }),
    style: undefined,
  })
}

export { Typography }
export type { TypographyProps, TypographyVariant }
