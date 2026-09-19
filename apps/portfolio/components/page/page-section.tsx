import { PageSectionVariant } from "@/types/page";
import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react"

interface PageSectionProps {
    children?: ReactNode | ReactNode[]
    variant: PageSectionVariant
    id: string
    backdrop?: ReactNode
    fitViewport?: boolean
    compactContent?: boolean
}

const PageSection: FC<PageSectionProps> = ({children, variant, id, backdrop, fitViewport = true, compactContent = false}: PageSectionProps) => {
    const hasSplashBackdrop = variant === PageSectionVariant.Primary

    const getCSSForVariant = (variant: PageSectionVariant) => {
        switch(variant) {
            case PageSectionVariant.Primary:
                return "bg-[hsl(var(--background)/var(--page-section-splash-overlay))]"
            case PageSectionVariant.Secondary:
                return "bg-background-secondary"
            case PageSectionVariant.Footer:
                return "bg-background-secondary"
        }
    }

    const getBorderCSSForVariant = (variant: PageSectionVariant) => {
        switch(variant) {
            case PageSectionVariant.Primary:
                return "text-circuit"
            case PageSectionVariant.Secondary:
                return "text-circuit-secondary"
            case PageSectionVariant.Footer:
                return "border-border/60"
        }
    }

    if (variant === PageSectionVariant.Footer) {
        return (
            <footer className={`border-t ${getBorderCSSForVariant(variant)} ${getCSSForVariant(variant)}`}>
                <div className="w-full">
                    {children}
                </div>
            </footer>
        );
    } else {
        return (
            <section id={id} className={cn(
                "min-h-svh lg:pb-20 lg:[--type-vw:max(1vw,15px)] relative flex w-full shrink-0 flex-col overflow-x-clip",
                fitViewport && "desktop-fit:h-svh desktop-fit:max-h-svh",
                getCSSForVariant(variant),
                hasSplashBackdrop ? "transition-colors duration-600 ease-out" : "border-y border-border/60 shadow-lg",
            )}>
                {backdrop}
                <div className={cn(
                    "relative z-0 flex min-h-0 w-full flex-1 flex-col",
                    // Blend into desktop sizing across tablet widths; keep scaling
                    // continuous when the viewport-height cap switches at 800px.
                    // atan2/tan avoids newer CSS length division.
                    compactContent && "md:[--fit-progress:clamp(0,tan(atan2(calc(100vw_-_48rem),16rem)),1)] md:[--fit-scale:clamp(0.6,tan(atan2(calc(100svh_-_5rem),1200px)),1)] md:[zoom:calc(1_-_var(--fit-progress)*(1_-_var(--fit-scale)))]",
                )}>{children}</div>
            </section>
        )
    }
};

export default PageSection;
