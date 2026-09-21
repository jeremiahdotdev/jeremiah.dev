"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import type { CareerMilestone } from "@/lib/career-milestones";
import { Typography } from "@/components/ui/typography";
import { useDictionary } from "@/components/content/content-provider";
import { formatTemplate } from "@/lib/format-template";
import CareerSkills from "./career-skills";

export default function CareerMilestoneCard({ milestone }: { milestone: CareerMilestone }) {
  const $t = useDictionary();
  const { role, summary } = milestone;
  const title = role.title.trim();
  const words = title.split(/\s+/);
  let breakAt = 1;
  for (let index = 2; index < words.length; index++) {
    const balance = (position: number) => Math.abs(words.slice(0, position).join(" ").length - words.slice(position).join(" ").length);
    if (balance(index) < balance(breakAt)) breakAt = index;
  }

  return (
    <Dialog.Root>
      <article className="relative flex min-h-40 flex-1 flex-col rounded-xl border border-career-accent/40 bg-card px-3 pb-3 transition-colors hover:border-career-accent/75 motion-reduce:transition-none sm:px-4 hlg:min-h-64 hlg:pb-4">
        <div className="flex min-h-8 items-center justify-center border-b border-muted-foreground/50 py-1 text-center hlg:min-h-10 hlg:py-2">
          <Typography variant="caption">{role.employer}</Typography>
        </div>
        <div className="flex w-full items-center border-b border-foreground/40 py-2 hlg:py-3">
          <div data-role-title className="relative w-full">
            <Typography as="h3" variant="title">
              <span aria-hidden="true" data-role-title-measure className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap">{title}</span>
              <span>{words.slice(0, breakAt).join(" ")}</span>
              {words.length > 1 && <>{" "}<span className="group-data-[wrap-titles=true]/timeline:block">{words.slice(breakAt).join(" ")}</span></>}
            </Typography>
          </div>
        </div>
        {summary && <div className="mt-2 hlg:mt-3"><Typography variant="body">{summary}</Typography></div>}
        <div className="mt-auto flex justify-end pt-2 text-career-accent hlg:pt-3">
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </div>
        <Dialog.Trigger asChild>
          <button type="button" aria-label={formatTemplate($t.career.role.readMoreAria, { role: role.title, employer: role.employer })} className="absolute inset-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-career-accent" />
        </Dialog.Trigger>
      </article>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[85dvh] max-w-3xl -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl focus:outline-none sm:p-8">
          <div className="pr-10">
            <Typography variant="eyebrow">{role.type.replace(/-/g, " ")}</Typography>
            <div className="mt-3">
              <Dialog.Title asChild><Typography as="h3" variant="title">{role.title}</Typography></Dialog.Title>
            </div>
            <div className="mt-3">
              <Dialog.Description asChild><Typography variant="caption">{role.employer} · {role.startDate} – {role.endDate}</Typography></Dialog.Description>
              <Typography variant="caption">{role.location}</Typography>
            </div>
          </div>
          <div className="my-6 border-t border-border pt-6 [&_li+li]:mt-3 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <Typography as="div" variant="body">{role.description}</Typography>
          </div>
          {role.skills.length > 0 && <CareerSkills skills={role.skills} autoPlay={false} />}
          <Dialog.Close asChild>
            <button type="button" aria-label={$t.career.role.close} className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <X aria-hidden="true" className="size-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
