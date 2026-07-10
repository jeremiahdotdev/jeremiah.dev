import { memo, useMemo, FC, ReactNode } from "react"
import { Button } from "../ui/button";

interface ProjectDrawerButtonProps {
    children: ReactNode | ReactNode[];
    handleClick: () => void
}
  
const ProjectDrawerButton: FC<ProjectDrawerButtonProps> = ({ children, handleClick }: ProjectDrawerButtonProps) => {
    // Memoized component
    const content = useMemo(() => (
        <Button 
            onClick={handleClick} 
            className="fixed left-1/2 text-white bottom-4 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 transition-transform duration-300 transform hover:scale-110">
                {children}
            </Button>
    ), [children, handleClick]);

    return (content);
};

export default memo(ProjectDrawerButton);