"use client"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
  } from "@/components/ui/sheet"
import { memo, useMemo, FC, useCallback, useEffect, useState, type MouseEventHandler } from "react"
import { useDictionary } from "@/components/content/content-provider";
import { Toggle } from "@radix-ui/react-toggle";
import { BookOpen, BriefcaseBusiness, Code2, Home, Mail, Menu as MenuIcon, type LucideIcon } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "../theme/theme-toggle";
import LinkedIn from "./linked-in";
import Resume from "./resume";
import MobileTabletOnly from "../breakpoints/mobile-tablet-only";
import DesktopOnly from "../breakpoints/desktop-only";

const navigationIconFallbacks: Record<string, LucideIcon> = {
    home: Home,
    career: BriefcaseBusiness,
    academics: BookOpen,
    projects: Code2,
    contact: Mail,
}

interface BaseLinkProps {
    id: string;
    heading: string;
    icon?: string;
    isActive?: boolean;
    className: string;
    iconClassName?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export interface MenuProps {}

const BaseLink: FC<BaseLinkProps> = ({id, heading, icon, isActive, className, iconClassName, onClick}: BaseLinkProps) => {
    const FallbackIcon = navigationIconFallbacks[id]
    const iconSrc = icon && (icon.startsWith("/") || icon.startsWith("http")) ? icon : undefined

    return (
        <Link
            href={`/#${id}`} 
            scroll
            aria-current={isActive ? "page" : undefined}
            onClick={onClick}
            className={cn(
                className,
                "border-b transition-colors",
                isActive ? "border-primary text-foreground" : "border-transparent hover:border-foreground/50",
            )}
        >
            {iconSrc ? (
                <Image
                    src={iconSrc}
                    alt=""
                    width={20}
                    height={20}
                    className={`${iconClassName ?? ""} dark:invert`}
                    unoptimized={iconSrc.startsWith("http")}
                />
            ) : FallbackIcon ? (
                <FallbackIcon aria-hidden="true" className={iconClassName} />
            ) : null}
            <span>{heading}</span>
        </Link>
    )
}

const Menu: FC<MenuProps> = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const [activeId, setActiveId] = useState<string>("home")
    const $t = useDictionary();

    useEffect(() => {
        const getHashId = () => window.location.hash.replace("#", "")

        const handleHashChange = () => {
            const hashId = getHashId()
            if (hashId) setActiveId(hashId)
        }

        handleHashChange()
        window.addEventListener("hashchange", handleHashChange)

        const sections = $t.navigation
            .map(({ id }) => document.getElementById(id))
            .filter((section): section is HTMLElement => !!section)

        const observer = new IntersectionObserver((entries) => {
            const visibleEntry = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

            if (visibleEntry?.target.id) setActiveId(visibleEntry.target.id)
        }, {
            rootMargin: "-35% 0px -45% 0px",
            threshold: [0.2, 0.4, 0.6],
        })

        sections.forEach((section) => observer.observe(section))

        return () => {
            window.removeEventListener("hashchange", handleHashChange)
            observer.disconnect()
        }
    }, [$t.navigation])

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
                    isActive={activeId === id}
                    onClick={() => setActiveId(id)}
                    className="flex w-fit items-center gap-2.5 pb-1 text-lg font-serif tracking-widest font-thin text-foreground/80 hover:cursor-pointer"
                    iconClassName="h-4 w-4 shrink-0"
                />
            </SheetClose>
        )
        
        return (
            <nav className="m-4 flex flex-col gap-5 border-t border-border pt-6">
                <>{ $t.navigation.map(mobileTabletOption) }</>
            </nav>
        )
    }, [$t, activeId, togglePressed])
    
    const DesktopNavigation = useMemo(() => {
        const desktopOption = ({id, heading, icon}: {id: string, heading: string, icon?: string}) => (
            <BaseLink
                key={id}
                id={id}
                heading={heading}
                icon={icon}
                isActive={activeId === id}
                onClick={() => setActiveId(id)}
                className="flex items-center gap-2 px-4 pb-2 pt-2 font-serif text-sm tracking-widest text-foreground/75 hover:cursor-pointer"
                iconClassName="h-5 w-5 shrink-0"
            />
        )
        return (
            <nav
                aria-label={$t.menu.description}
                className="fixed left-1/2 bottom-4 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/60 bg-background/90 px-4 py-1.5 shadow-sm shadow-foreground/10"
            >
                {$t.navigation.map(desktopOption)}
            </nav>
        )
    }, [$t, activeId])

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
