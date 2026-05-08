import { memo, useMemo, FC } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from "@/types/icon";

interface ProjectAvatarProps {
    icon?: Icon;
}
  
const ProjectAvatar: FC<ProjectAvatarProps> = ({ icon }: ProjectAvatarProps) => {
    // Memoized component
    const content = useMemo(() => (
        <Avatar>
            <AvatarImage src={icon?.src} alt={icon?.alt}/>
            <AvatarFallback>{icon?.alt}</AvatarFallback>
        </Avatar>
    ), [icon]);

    return (content);
};

export default memo(ProjectAvatar);
