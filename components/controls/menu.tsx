"use client"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
  } from "@/components/ui/sheet"
import { memo, useMemo, FC, useCallback, useState } from "react"
import { getDictionary } from "@/dictionaries";
import { Toggle } from "@radix-ui/react-toggle";
import { Menu as MenuIcon } from "lucide-react"
import Link from "next/link";
import ThemeToggle from "../theme/theme-toggle";
import { useTheme } from "next-themes";
import LinkedIn from "./linked-in";
import Resume from "./resume";

export interface BaseOptionProps {
    href: string;
    scroll?: boolean;
    onClick?: () => void;
}

export interface MenuProps {}

const Menu: FC<MenuProps> = () => {
    const { setTheme, theme } = useTheme();
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const $t = getDictionary();

    const setChangeDrawerOpen = useCallback((isPressed: boolean) => {
      setIsPressed(isPressed)
    }, []);

    const togglePressed = useCallback(() => {
        setIsPressed(i => !i)
    }, [])

    const MenuToggle = useMemo(() =>(
        <Toggle className={`aspect-square p-2`} aria-label={$t.menu.toggle} pressed={isPressed} onPressedChange={setChangeDrawerOpen}>
          <MenuIcon className={`${isPressed ? "rotate-90" : "rotate-0"} transition-all`}/>
        </Toggle>
    ), [$t, isPressed, setChangeDrawerOpen])

    const Navigation = useMemo(() => {
        const baseOption = (props: BaseOptionProps, id: string, heading: string) => (
            <SheetClose asChild key={id} onClick={togglePressed} className="flex">
                <Link {...props} className={"flex flex-row-reverse text-xl font-serif tracking-widest font-thin text-foreground/80 hover:cursor-pointer hover:underline"}>{heading}</Link>
            </SheetClose>
        )
        const toggleOption = ({id, heading}: {id: string, heading: string}) => {return baseOption({ href: `/#${id}`, scroll:true}, id, heading)}
    
        return (
            <nav className="flex flex-col gap-6 m-4 pt-8 border-t-2 dark:border-t">
                <>{ $t.navigation.map(toggleOption) }</>
            </nav>
        )
    }, [$t, togglePressed])

    // Memoized component
    const menu = useMemo(() => (
        <Sheet open={isPressed}>
            <div className="fixed left-0 top-0" >
                {MenuToggle}
            </div>
            <SheetContent side={"left"} className="dark:border-border">
                <SheetDescription className="sr-only">
                    {$t.menu.description}
                </SheetDescription>
                { Navigation }
                <SheetClose asChild className="absolute left-0 right-0 top-0">
                    <SheetTitle className="flex justify-between items-center p-0 pl-4 font-serif text-md font-serif">
                        {$t.menu.heading} 
                        {MenuToggle}
                    </SheetTitle>
                </SheetClose>
                <span className="flex items-center absolute right-0 bottom-0">
                    <LinkedIn className="px-3"/>
                    <Resume/>
                    <ThemeToggle />
                </span>
            </SheetContent>
        </Sheet>
    ), [$t, MenuToggle, Navigation, isPressed]);

    return (menu);
};

export default memo(Menu);
