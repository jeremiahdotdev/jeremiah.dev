"use client"
import { useDictionary } from "@/components/content/content-provider"
import { useTheme } from "next-themes"
import { FC, ReactNode, memo, useMemo } from "react"

interface ThemeOnlyProps {
    children: ReactNode | ReactNode[]
}

const DevOnly: FC<ThemeOnlyProps> = ({children}: ThemeOnlyProps) => {
    const {theme} = useTheme()
    const $t = useDictionary()

    const devOnlyComponent = useMemo(() => {
        if (theme === $t.theme.keys.dev) {
            return children
        } else {
            return (<></>)
        }
    }, [theme, children, $t])

    return devOnlyComponent
}

export default memo(DevOnly)
