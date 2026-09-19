"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, FileText, Folder, FolderOpen, Linkedin } from "lucide-react";
import { useDictionary } from "@/components/content/content-provider";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export default function ResourcesMenu({ className }: { className?: string }) {
  const $t = useDictionary();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function dismissOutside(event: PointerEvent) {
      const details = detailsRef.current;
      if (details && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    }
    function dismissOnEscape(event: KeyboardEvent) {
      const details = detailsRef.current;
      if (event.key === "Escape" && details?.open) {
        event.preventDefault();
        event.stopPropagation();
        details.open = false;
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape, true);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape, true);
    };
  }, []);

  const links = [
    { href: $t.links.linkedIn, label: $t.menu.linkedIn, ariaLabel: $t.controls.linkedIn, Icon: Linkedin },
    { href: $t.links.resume, label: $t.menu.resume, ariaLabel: $t.controls.resume, Icon: FileText },
  ];

  return (
    <details ref={detailsRef} className="group relative w-fit shrink-0" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }}>
      <summary ref={triggerRef} className={cn("flex cursor-pointer list-none items-center gap-2 text-foreground/75 hover:text-foreground [&::-webkit-details-marker]:hidden", className)}>
        <Folder aria-hidden="true" className="size-5 shrink-0 group-open:hidden" />
        <FolderOpen aria-hidden="true" className="hidden size-5 shrink-0 group-open:block" />
        <Typography as="span" variant="menu">{$t.menu.resources}</Typography>
      </summary>
      <nav aria-label={$t.menu.resources} className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-border/60 bg-background p-2 shadow-lg">
        {links.map(({ href, label, ariaLabel, Icon }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} onClick={() => {
            if (detailsRef.current) detailsRef.current.open = false;
          }} className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            <Typography as="span" variant="menu">{label}</Typography>
            <ArrowUpRight aria-hidden="true" className="ml-auto size-4 shrink-0" />
          </a>
        ))}
      </nav>
    </details>
  );
}
