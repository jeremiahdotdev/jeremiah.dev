import { memo, useMemo, FC, ReactNode } from "react"

export interface PageSectionContentProps {
    children?: ReactNode | ReactNode[]
    className?: string
}

const PageSectionContent: FC<PageSectionContentProps> = ({children, className}: PageSectionContentProps) => {
    // Memoized component
    const content = useMemo(() => (
        <div className={`w-full h-full flex flex-col flex-grow items-center justify-around ${className || ""}`}>
            {children}
        </div>
    ), [children, className]);

    return (content);
};

export default memo(PageSectionContent);
