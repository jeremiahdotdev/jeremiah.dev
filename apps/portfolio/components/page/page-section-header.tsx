import { TypographyH2 } from "@/components/ui/typography"
import { memo, useMemo, FC, ReactNode } from "react"

export interface PageSectionHeaderProps {
    children?: ReactNode | ReactNode[]
}

const PageSectionHeader: FC<PageSectionHeaderProps> = ({children}: PageSectionHeaderProps) => {
    // Memoized component
    const header = useMemo(() => (
        <TypographyH2 variant="section">
            {children}
        </TypographyH2>
    ), [children]);

    return (header);
};

export default memo(PageSectionHeader);
