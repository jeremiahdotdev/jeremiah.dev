import { Focus as FocusType } from "@/types/focus"
import { FC, memo, useMemo } from "react"
import Focus from "./focus"

interface FocusListProps {
    focuses: FocusType[]
    gpaLabel: string
}

const FocusList: FC<FocusListProps> = ({ focuses, gpaLabel }: FocusListProps) => {
    const component = useMemo(() => (
        <div className="grid gap-4 lg:grid-cols-3">
            {focuses.map((focus) => (
                <Focus key={`${focus.type}-${focus.name}`} focus={focus} gpaLabel={gpaLabel}/>
            ))}
        </div>
    ), [focuses, gpaLabel])

    return component
}

export default memo(FocusList)
