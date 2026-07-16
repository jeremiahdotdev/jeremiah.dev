import { FC, memo, useMemo } from "react"
import { Commendation as CommendationType } from "@/types/commendation"
import Commendation from "./commendation"

interface CommendationListProps {
    commendations: CommendationType[]
}

const CommendationList: FC<CommendationListProps> = ({ commendations }: CommendationListProps) => {
    const component = useMemo(() => {
        return (<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            { commendations.map((commendation, index) => (
                <Commendation key={`${commendation.subtitle}-${index}`} commendation={commendation} />
            ))}
        </div>)
    }, [commendations])

    return component
}

export default memo(CommendationList)
