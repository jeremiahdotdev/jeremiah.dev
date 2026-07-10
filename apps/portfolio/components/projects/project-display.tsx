import { useDictionary } from "@/components/content/content-provider";
import { Project } from "@/types/project";
import { memo, useMemo, FC, useState, useCallback } from "react"
import { Skeleton } from "../ui/skeleton";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer";
import ProjectDrawerButton from "./project-drawer-button";
import { cn } from "@/lib/utils";

interface ProjectDisplayProps {
    project?: Project;
}
  
const ProjectDisplay: FC<ProjectDisplayProps> = ({ project }: ProjectDisplayProps) => {
    const [loadedDemoKey, setLoadedDemoKey] = useState<string | null>(null)
    const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false)
    const $t = useDictionary();
    const demoKey = project?.demo?.href ?? project?.name ?? "project-demo"
    const frameIsLoading = Boolean(project?.demo?.href) && loadedDemoKey !== demoKey
    
    const handleLoadFrame = useCallback(()=>{ 
        setLoadedDemoKey(demoKey) 
    }, [demoKey])

    const toggleFullScreen = useCallback(()=>{ 
        setIsDemoOpen(val => !val) 
    }, [setIsDemoOpen])

    const frame = useMemo(() => (                    
        <iframe
            key={demoKey}
            title={project ? `${project.name} demo` : $t.projects.placeholder}
            onLoad={handleLoadFrame}
            src={project?.demo?.href}
            className={cn("w-full h-full p-4 rounded-md", frameIsLoading && "hidden")}
        />
    ), [demoKey, project, $t, handleLoadFrame, frameIsLoading]);

    const overlay = useMemo(() => isDemoOpen 
    ? ( <ProjectDrawerButton handleClick={toggleFullScreen}>{$t.projects.closeDemo}</ProjectDrawerButton>) 
    : ( <button
            type="button"
            onClick={toggleFullScreen}
            className="absolute h-full w-full flex justify-center items-center text-white text-2xl font-mono font-extrabold bg-black/70 hover:bg-black/80 hover:cursor-pointer lg:hidden"
        >
            <span className="transition-transform duration-300 transform hover:scale-110">{$t.projects.viewDemo}</span>
        </button>
    ), [$t, isDemoOpen, toggleFullScreen]);


    const display = useMemo(() => {     
        if (isDemoOpen) { 
            return (
                <Drawer open={isDemoOpen} onOpenChange={toggleFullScreen}>
                    <DrawerTitle className="sr-only">{$t.projects.heading}</DrawerTitle>
                    <DrawerDescription className="sr-only">{$t.projects.description}</DrawerDescription>
                    <DrawerContent className="h-full w-full">
                        {frame}
                        { overlay }
                    </DrawerContent>
                </Drawer>
            )
        } else if (project?.demo) { 
            return (
                <div className="relative flex h-full min-h-0 w-full flex-1 rounded-md shadow-inner">
                    { overlay }
                    { frameIsLoading && (<Skeleton className="w-full h-full rounded-md" />) }
                    { frame }
                </div>
            )
        } else {
            return (
                <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center rounded-md bg-dashboard-header text-4xl font-extrabold font-mono text-dashboard shadow-inner">{ $t.projects.placeholder }</div>
            ) 
        }
    }, [project, $t, frame, frameIsLoading, overlay, isDemoOpen, toggleFullScreen]);

    return (
        <div className="flex h-full min-h-0 w-full flex-1">
            {display}
        </div>
    );
};

export default memo(ProjectDisplay);
