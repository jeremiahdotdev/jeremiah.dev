import { Typography } from "@/components/ui/typography";

export default function SectionHeading({ label, metadata, as: Label = "span" }: {
  label: string;
  metadata?: string;
  as?: "span" | "h2";
}) {
  return (
    <div className="flex w-full items-center gap-4">
      <Typography as={Label} variant="section-label">{label}</Typography>
      <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-foreground/30" />
      {metadata && <div className="shrink-0 text-right"><Typography as="span" variant="section-label">{metadata}</Typography></div>}
    </div>
  );
}
