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
  const [firstWord, ...remainingWords] = role.title.trim().split(/\s+/);

  return (
    <Dialog.Root>
      <article className="relative flex min-h-56 flex-1 flex-col rounded-xl border border-career-accent/40 bg-card px-3 pb-3 transition-colors hover:border-career-accent/75 motion-reduce:transition-none sm:min-h-64 sm:px-4 sm:pb-4">
        <div className="flex min-h-10 items-center justify-center border-b border-muted-foreground/50 py-2 text-center">
          <Typography variant="career-employer">{role.employer}</Typography>
        </div>
        <div className="border-b border-foreground/40 pb-3">
          <Typography as="h3" variant="role-title">
            {firstWord}
            {remainingWords.length > 0 && <><br />{remainingWords.join(" ")}</>}
          </Typography>
        </div>
        {summary && <div className="mt-3"><Typography variant="lead">{summary}</Typography></div>}
        <div className="mt-auto flex justify-end pt-3 text-career-accent">
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </div>
        <Dialog.Trigger asChild>
          <button type="button" aria-label={formatTemplate($t.career.role.readMoreAria, { role: role.title, employer: role.employer })} className="absolute inset-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-career-accent" />
        </Dialog.Trigger>
      </article>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl focus:outline-none sm:p-8">
          <div className="pr-10">
            <Typography variant="detail-label">{role.type.replace(/-/g, " ")}</Typography>
            <div className="mt-3">
              <Dialog.Title asChild><Typography as="h3" variant="title">{role.title}</Typography></Dialog.Title>
            </div>
            <div className="mt-3">
              <Dialog.Description asChild><Typography variant="caption">{role.employer} · {role.startDate} – {role.endDate}</Typography></Dialog.Description>
              <Typography variant="caption">{role.location}</Typography>
            </div>
          </div>
          <div className="my-6 border-t border-border pt-6 [&_li+li]:mt-3 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <Typography as="div" variant="body-muted">{role.description}</Typography>
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
