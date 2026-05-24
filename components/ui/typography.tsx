import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
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

type AsChildProps = {
  asChild?: boolean
}

type TextProps = AsChildProps & {
  text?: string
}

const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & TextProps
>(({ asChild, children, className, text, ...props }, ref) => {
  const Comp = asChild ? Slot : "h1"
  return <Comp
    ref={ref}
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}
    {...props}
  >
    {children ?? text}
  </Comp>
})
TypographyH1.displayName = "TypographyH1"

const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof typographyH2Variants> &
    TextProps
>(({ asChild, children, className, text, variant, ...props }, ref) => {
  const Comp = asChild ? Slot : "h2"
  return <Comp
    ref={ref}
    className={cn(typographyH2Variants({ variant }), className)}
    {...props}
  >
    {children ?? text}
  </Comp>
})
TypographyH2.displayName = "TypographyH2"

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & TextProps
>(({ asChild, children, className, text, ...props }, ref) => {
  const Comp = asChild ? Slot : "h3"
  return <Comp
    ref={ref}
    className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}
    {...props}
  >
    {children ?? text}
  </Comp>
})
TypographyH3.displayName = "TypographyH3"

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof typographyPVariants> &
    TextProps
>(({ asChild, children, className, text, variant, ...props }, ref) => {
  const Comp = asChild ? Slot : "p"
  return <Comp
    ref={ref}
    className={cn(typographyPVariants({ variant }), className)}
    {...props}
  >
    {children ?? text}
  </Comp>
})
TypographyP.displayName = "TypographyP"

const TypographyLead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & TextProps
>(({ asChild, children, className, text, ...props }, ref) => {
  const Comp = asChild ? Slot : "p"
  return <Comp
    ref={ref}
    className={cn("text-xl text-muted-foreground", className)}
    {...props}
  >
    {children ?? text}
  </Comp>
})
TypographyLead.displayName = "TypographyLead"

const TypographyLarge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & TextProps
>(({ asChild, children, className, text, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return <Comp ref={ref} className={cn("text-lg font-semibold", className)} {...props}>
    {children ?? text}
  </Comp>
})
TypographyLarge.displayName = "TypographyLarge"

const TypographySmall = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof typographySmallVariants> &
    TextProps
>(({ asChild, children, className, text, variant, ...props }, ref) => {
  const Comp = asChild ? Slot : "small"
  return <Comp
    ref={ref}
    className={cn(typographySmallVariants({ variant }), className)}
    {...props}
  >
    {children ?? text}
  </Comp>
})
TypographySmall.displayName = "TypographySmall"

const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof typographyMutedVariants> &
    TextProps
>(({ asChild, children, className, text, variant, tone, ...props }, ref) => {
  const Comp = asChild ? Slot : "p"
  return <Comp
    ref={ref}
    className={cn(typographyMutedVariants({ variant, tone }), className)}
    {...props}
  >
    {children ?? text}
  </Comp>
})
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
