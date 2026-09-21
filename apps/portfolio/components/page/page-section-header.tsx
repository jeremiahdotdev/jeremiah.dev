import { Typography } from "@/components/ui/typography"
import { memo, useMemo, FC, ReactNode } from "react"

interface PageSectionHeaderProps {
    children?: ReactNode | ReactNode[]
}

const PageSectionHeader: FC<PageSectionHeaderProps> = ({children}: PageSectionHeaderProps) => {
    // Memoized component
    const header = useMemo(() => (
        <div className="flex w-full justify-center p-4 pt-8 sm:justify-end sm:px-16">
          <Typography as="h2" variant="label">
            {children}
          </Typography>
        </div>
    ), [children]);

    return (header);
};

export default memo(PageSectionHeader);
