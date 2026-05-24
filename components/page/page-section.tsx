"use client"
import { CircuitBorder, CircuitBorder2 } from "@/components/utility/SVGs";
import { PageSectionVariant } from "@/types/page";
import { memo, useMemo, FC, ReactNode } from "react"

export interface PageSectionProps {
    children?: ReactNode | ReactNode[]
    variant: PageSectionVariant
    id: string
    showBorder?: boolean,
    rotate?: boolean
}

const PageSection: FC<PageSectionProps> = ({children, variant, id, showBorder, rotate}: PageSectionProps) => {
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
                return "border-black/10"
        }
    }

    const border = useMemo(() => {
        const baseCSS = 'absolute z-0'
        const borderCSS = getBorderCSSForVariant(variant)

        return (
            <div className="">
                <div className={`${baseCSS} ${borderCSS} top-0 left-0 ${rotate ? "-rotate-180" : "rotate-90"}`}>
                    <CircuitBorder/>
                </div>
                <div className={`${baseCSS} ${borderCSS} bottom-0 left-0 ${rotate ? "rotate-90" : ""}`}>
                    <CircuitBorder2/>
                </div>
                <div className={`${baseCSS} ${borderCSS} bottom-0 right-0 ${rotate ? "" : "-rotate-90"}`}>
                    <CircuitBorder/>
                </div>
            </div>
        )
    }, [variant, rotate]);

    const section = useMemo(() => (
        <section id={id} className={`relative w-full flex flex-col h-full min-h-screen ${getCSSForVariant(variant)}`}>
            { showBorder && border}
            <div className="z-10 h-full w-full flex flex-col flex-grow">
                {children}
            </div>
        </section>
    ), [id, showBorder, children, variant, border]);

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
