"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, Home, Mail, MessageCircle, X } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useDictionary } from "@/components/content/content-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import ResourcesMenu from "./resources-menu";

const menuItemClassName = "flex shrink-0 items-center gap-2 whitespace-nowrap border-b border-transparent px-3 py-2 hover:border-foreground/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 lg:px-2 xl:px-3";

export default function Menu() {
  const $t = useDictionary();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const currentId = pathname === "/" ? activeId : "";
  const navigationIcons = { [$t.home.id]: Home, [$t.academics.id]: BookOpen, [$t.career.id]: BriefcaseBusiness, [$t.projects.id]: Code2, [$t.contact.id]: Mail };
  const links = $t.navigation.map(({ id, heading, icon }) => ({
    label: heading,
    href: `/#${id}`,
    id,
    icon,
  }));

  useEffect(() => {
    const desktopNavigation = window.matchMedia("(min-width: 1024px)");
    function closeMobileMenu(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    desktopNavigation.addEventListener("change", closeMobileMenu);
    return () => desktopNavigation.removeEventListener("change", closeMobileMenu);
  }, []);

  useEffect(() => {
    const sections = $t.navigation.map(({ id }) => id)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      }
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [$t, pathname]);

  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      <nav aria-label={$t.menu.description} className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border/60 bg-background/90 px-2 py-1.5 text-foreground shadow-sm shadow-foreground/10 lg:flex xl:gap-2 xl:px-4">
        <ThemeToggle className={menuItemClassName} />
        <ResourcesMenu className={menuItemClassName} />
        {links.map(({ id, label, href, icon }) => {
          const Icon = navigationIcons[id];
          return (
            <Link key={id} href={href} onClick={() => setActiveId(id)} aria-current={id === currentId ? "location" : undefined} className={cn(menuItemClassName, id === currentId && "border-primary text-foreground")}>
              {icon ? (
                <Image src={icon} alt="" width={20} height={20} className="size-5 shrink-0 dark:invert" unoptimized />
              ) : Icon && <Icon aria-hidden="true" className="size-5 shrink-0" />}
              <Typography as="span" variant="navigation">{label}</Typography>
            </Link>
          );
        })}
        <a href={$t.links.ai} target="_blank" rel="noopener noreferrer" className={menuItemClassName}>
          <MessageCircle aria-hidden="true" className="size-5 shrink-0" />
          <Typography as="span" variant="navigation">{$t.controls.myAi}</Typography>
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </a>
      </nav>
      <div className="fixed bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center rounded-t-xl border border-b-0 border-border/60 bg-background/90 text-foreground shadow-sm shadow-foreground/10 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label={$t.menu.toggle} className="flex min-h-8 items-center justify-center rounded-t-xl px-4 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            <Typography as="span" variant="navigation">{$t.menu.label}</Typography>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto bg-background-secondary px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-foreground sm:max-w-md sm:px-8">
            <div className="flex items-center justify-between border-b border-foreground/20 pb-4">
              <SheetTitle asChild><Typography as="h2" variant="title">{$t.menu.heading}</Typography></SheetTitle>
              <SheetClose aria-label={$t.menu.close} className="flex size-11 items-center justify-center rounded-sm hover:bg-accent"><X className="size-5" /></SheetClose>
            </div>
            <SheetDescription className="sr-only">{$t.menu.description}</SheetDescription>
            <div className="mt-6"><Typography as="span" variant="label">{$t.menu.navigation}</Typography></div>
            <nav aria-label={$t.menu.description} className="mt-3 flex flex-col divide-y divide-foreground/15">
              {links.map(({ id, label, href }) => (
                <SheetClose asChild key={id}>
                  <Link href={href} onClick={() => setActiveId(id)} aria-current={id === currentId ? "location" : undefined} className={cn("block py-3 decoration-foreground/60 underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2", id === currentId && "underline")}>
                    <Typography as="span" variant="navigation">{label}</Typography>
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto pt-8">
              <div className="flex items-center justify-between gap-4 border-t border-foreground/20 py-3">
                <ThemeToggle className={menuItemClassName} />
                <a href={$t.links.ai} target="_blank" rel="noopener noreferrer" className={menuItemClassName}>
                  <MessageCircle aria-hidden="true" className="size-5 shrink-0" />
                  <Typography as="span" variant="navigation">{$t.controls.myAi}</Typography>
                  <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-foreground/20 pt-5">
                <a href={$t.links.linkedIn} target="_blank" rel="noopener noreferrer" aria-label={$t.controls.linkedIn} className="inline-flex min-h-11 items-center gap-2 underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                  <Typography as="span" variant="navigation">{$t.menu.linkedIn}</Typography><ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
                <a href={$t.links.resume} target="_blank" rel="noopener noreferrer" aria-label={$t.controls.resume} className="inline-flex min-h-11 items-center gap-2 underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                  <Typography as="span" variant="navigation">{$t.menu.resume}</Typography><ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
