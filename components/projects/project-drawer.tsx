import { useDictionary } from "@/components/content/content-provider";
import { memo, useMemo, FC, ReactNode, useCallback } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
} from "@/components/ui/drawer"
import ProjectDrawerButton from "./project-drawer-button";

interface ProjectDrawerProps {
    openState: boolean;
    setIsOpen: (flag: boolean) => void;
    children: ReactNode | ReactNode[]
}
  
const ProjectDrawer: FC<ProjectDrawerProps> = ({ openState, children, setIsOpen }: ProjectDrawerProps) => {
    const $t = useDictionary();
    const handleClose = useCallback(()=> {
        setIsOpen(false)
    }, [setIsOpen])

    // Memoized component
    const content = useMemo(() => (
        <Drawer open={openState} onOpenChange={setIsOpen}>
            <DrawerTitle className="sr-only">{$t.projects.heading}</DrawerTitle>
            <DrawerDescription className="sr-only">{$t.projects.description}</DrawerDescription>
            <DrawerContent className="h-1/2">
                {children}
            </DrawerContent>
        </Drawer>
    ), [$t, children, openState, setIsOpen]);

    return (content);
};

export default memo(ProjectDrawer);
