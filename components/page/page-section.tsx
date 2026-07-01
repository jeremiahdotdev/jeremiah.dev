"use client"
import { PageSectionVariant } from "@/types/page";
import { memo, useMemo, FC, ReactNode } from "react"
import splashStyles from "@/components/theme/splash-backdrop.module.css";

export interface PageSectionProps {
    children?: ReactNode | ReactNode[]
    variant: PageSectionVariant
    id: string
    showBorder?: boolean,
    rotate?: boolean
}

const PageSection: FC<PageSectionProps> = ({children, variant, id, showBorder, rotate}: PageSectionProps) => {
    const hasSplashBackdrop = variant === PageSectionVariant.Primary

    const getCSSForVariant = (variant: PageSectionVariant) => {
        switch(variant) {
            case PageSectionVariant.Primary:
                return "bg-background"
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

    const section = useMemo(() => (
        <section id={id} className={`relative flex h-full min-h-screen w-full flex-col ${getCSSForVariant(variant)} ${hasSplashBackdrop ? splashStyles.section : "border-y border-border/60 shadow-lg"}`}>
            <div className="z-20 h-full w-full flex flex-col flex-grow">
                {children}
            </div>
        </section>
    ), [id, children, variant, hasSplashBackdrop]);

    const footer = useMemo(() => (
        <footer className={`py-2 border-t ${getBorderCSSForVariant(variant)} ${getCSSForVariant(variant)}`}>
            <div className="container mx-auto text-center">
                {children}
            </div>
        </footer>
    ), [children, variant]);

    if (variant === PageSectionVariant.Footer) {
        return footer;
    } else {
        return section
    }
};

export default memo(PageSection);
