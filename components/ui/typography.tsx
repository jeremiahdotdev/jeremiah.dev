import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typographyH2Variants = cva(
  "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  {
    variants: {
      variant: {
        default: "",
        section:
          "border-b-0 p-4 flex flex-col text-2xl w-full font-serif font-thin tracking-widest text-foreground/80 items-center justify-center sm:justify-end sm:align-start sm:px-16",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const typographyPVariants = cva("leading-7 [&:not(:first-child)]:mt-6", {
  variants: {
    variant: {
      default: "",
      dashboard:
        "text-base font-serif tracking-tight text-dashboard-foreground [&:not(:first-child)]:mt-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const typographySmallVariants = cva("text-sm font-medium leading-none", {
  variants: {
    variant: {
      default: "",
      label: "block font-serif font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const typographyMutedVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      footer:
        "font-thin tracking-tight text-foreground dark:text-muted-foreground",
      status: "text-foreground",
    },
    tone: {
      default: "",
      destructive: "text-red-600",
    },
  },
  defaultVariants: {
    variant: "default",
    tone: "default",
  },
})

const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}
    {...props}
  />
))
TypographyH1.displayName = "TypographyH1"

const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof typographyH2Variants>
>(({ className, variant, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(typographyH2Variants({ variant }), className)}
    {...props}
  />
))
TypographyH2.displayName = "TypographyH2"

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}
    {...props}
  />
))
TypographyH3.displayName = "TypographyH3"

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof typographyPVariants>
>(({ className, variant, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(typographyPVariants({ variant }), className)}
    {...props}
  />
))
TypographyP.displayName = "TypographyP"

const TypographyLead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xl text-muted-foreground", className)}
    {...props}
  />
))
TypographyLead.displayName = "TypographyLead"

const TypographyLarge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
TypographyLarge.displayName = "TypographyLarge"

const TypographySmall = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof typographySmallVariants>
>(({ className, variant, ...props }, ref) => (
  <small
    ref={ref}
    className={cn(typographySmallVariants({ variant }), className)}
    {...props}
  />
))
TypographySmall.displayName = "TypographySmall"

const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof typographyMutedVariants>
>(({ className, variant, tone, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(typographyMutedVariants({ variant, tone }), className)}
    {...props}
  />
))
TypographyMuted.displayName = "TypographyMuted"

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
}
