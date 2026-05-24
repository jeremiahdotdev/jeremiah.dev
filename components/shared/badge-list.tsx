import Badge, { Badging } from "./badge"

interface BadgeListProps {
    badges?: Badging[]
}

export default function BadgeList({ badges }: BadgeListProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {badges?.map((badge, index) => (
                <Badge key={`${badge.subtitle}-${index}`} badge={badge} />
            ))}
        </div>
    )
}
