import HoverBadge from "./hover-badge"
import { Badging } from "./badge"

interface BadgeListProps {
    badges?: Badging[]
}

export default function HoverBadgeList({ badges }: BadgeListProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {badges?.map((badge, index) => (
                <HoverBadge key={`${badge.subtitle}-${index}`} badge={badge} />
            ))}
        </div>
    )
}
