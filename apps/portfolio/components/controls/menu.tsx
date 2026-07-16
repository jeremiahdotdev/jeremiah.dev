"use client"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
  } from "@/components/ui/sheet"
import { memo, useMemo, FC, useCallback, useState } from "react"
import { useDictionary } from "@/components/content/content-provider";
import { Toggle } from "@radix-ui/react-toggle";
import { Menu as MenuIcon } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../theme/theme-toggle";
import LinkedIn from "./linked-in";
import Resume from "./resume";
import MobileTabletOnly from "../breakpoints/mobile-tablet-only";
import DesktopOnly from "../breakpoints/desktop-only";

const navigationIconFallbacks: Record<string, string> = {
    home: "/navigation-icons/home.svg",
    career: "/navigation-icons/briefcase.svg",
    academics: "/navigation-icons/bookOpen.svg",
    projects: "/navigation-icons/code.svg",
    contact: "/navigation-icons/mail.svg",
}

interface BaseLinkProps {
    id: string;
    heading: string;
    icon?: string;
    className: string;
    iconClassName?: string;
}

export interface MenuProps {}

const BaseLink: FC<BaseLinkProps> = ({id, heading, icon, className, iconClassName}: BaseLinkProps) => {
    const iconSrc = icon ?? navigationIconFallbacks[id]

    return (
        <Link
            href={`/#${id}`} 
            scroll
            className={className}
        >
            {iconSrc ? (
                <Image
                    src={iconSrc}
                    alt=""
                    width={20}
                    height={20}
                    className={iconClassName}
                    unoptimized={iconSrc.startsWith("http")}
                />
            ) : null}
            <span>{heading}</span>
        </Link>
    )
}

const Menu: FC<MenuProps> = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const $t = useDictionary();

    const setChangeDrawerOpen = useCallback((isPressed: boolean) => {
      setIsPressed(isPressed)
    }, []);

    const togglePressed = useCallback(() => {
        setIsPressed(i => !i)
    }, [])

    const MenuToggle = useMemo(() =>(
        <Toggle className={`aspect-square rounded-md p-2`} aria-label={$t.menu.toggle} pressed={isPressed} onPressedChange={setChangeDrawerOpen}>
          <MenuIcon className={`${isPressed ? "rotate-90" : "rotate-0"} transition-all`}/>
        </Toggle>
    ), [$t, isPressed, setChangeDrawerOpen])

    const MobileTabletNavigation = useMemo(() => {
        const mobileTabletOption = ({id, heading, icon}: {id: string, heading: string, icon?: string}) => (
            <SheetClose asChild key={id} onClick={togglePressed} className="flex">
                <BaseLink
                    id={id}
                    heading={heading}
                    icon={icon}
                    className="flex items-center gap-3 text-xl font-serif tracking-widest font-thin text-foreground/80 hover:cursor-pointer hover:underline"
                    iconClassName="h-5 w-5 shrink-0"
                />
            </SheetClose>
        )
        
        return (
            <nav className="m-4 flex flex-col gap-6 border-t-2 border-border pt-8">
                <>{ $t.navigation.map(mobileTabletOption) }</>
            </nav>
        )
    }, [$t, togglePressed])
    
    const DesktopNavigation = useMemo(() => {
        const desktopOption = ({id, heading, icon}: {id: string, heading: string, icon?: string}) => (
            <BaseLink
                key={id}
                id={id}
                heading={heading}
                icon={icon}
                className="flex items-center gap-2 px-4 py-2 font-serif text-sm tracking-widest text-foreground/75 hover:cursor-pointer hover:underline"
                iconClassName="h-5 w-5 shrink-0"
            />
        )
        return (
            <nav
                aria-label={$t.menu.description}
                className="fixed left-1/2 bottom-4 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/60 bg-background/90 px-2 py-1.5 shadow-sm shadow-foreground/10"
            >
                {$t.navigation.map(desktopOption)}
            </nav>
        )
    }, [$t])

    // Memoized component
    const MobileTabletMenu = useMemo(() => (
        <Sheet open={isPressed}>
            <div className="fixed left-0 top-0 z-40 p-2" >
                {MenuToggle}
            </div>
            <SheetContent side={"left"}>
                <SheetDescription className="sr-only">
                    {$t.menu.description}
                </SheetDescription>
                { MobileTabletNavigation }
                <SheetClose asChild className="absolute left-0 right-0 top-0">
                    <SheetTitle className="flex justify-between items-center p-0 pl-4 font-serif text-md font-serif">
                        {$t.menu.heading} 
                        {MenuToggle}
                    </SheetTitle>
                </SheetClose>
                <span className="flex items-center absolute right-0 bottom-0">
                    <LinkedIn className="px-3"/>
                    <Resume/>
                </span>
            </SheetContent>
        </Sheet>
    ), [$t, MenuToggle, MobileTabletNavigation, isPressed]);

    return (<>
        <MobileTabletOnly>
            {MobileTabletMenu}
        </MobileTabletOnly>
        <DesktopOnly>
            { DesktopNavigation }
        </DesktopOnly>
    </>)
};

export default memo(Menu);
