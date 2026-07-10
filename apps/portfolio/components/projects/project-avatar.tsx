import { memo, useMemo, FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/types/icon";
import { twMerge } from "tailwind-merge";

interface ProjectAvatarProps {
  icon?: Icon;
  fallbackText: string;
  className?: string;
}

const ProjectAvatar: FC<ProjectAvatarProps> = ({ icon, fallbackText, className }) => {
  const content = useMemo(
    () => (
      <Avatar className={twMerge("avatar", className)}>
        <AvatarImage src={icon?.src} alt={icon?.alt} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    ),
    [icon, fallbackText, className]
  );

  return content;
};

export default memo(ProjectAvatar);
