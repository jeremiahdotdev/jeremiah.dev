import { memo, useMemo, FC, ReactNode } from "react"

export interface PageSectionHeaderProps {
    children?: ReactNode | ReactNode[]
}

const PageSectionHeader: FC<PageSectionHeaderProps> = ({children}: PageSectionHeaderProps) => {
    // Memoized component
    const header = useMemo(() => (
        <h2 className={"p-4 flex flex-col text-2xl w-full font-serif font-thin tracking-widest text-foreground/80 items-center justify-center sm:justify-end sm:align-start sm:px-16"}>
            {children}
        </h2>
    ), [children]);

    return (header);
};

export default memo(PageSectionHeader);
