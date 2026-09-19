import type { ComponentProps } from "react";
import CardBase from "./card-base";
import { cn } from "@/lib/utils";

export default function SectionCard({ className, ...props }: ComponentProps<typeof CardBase>) {
  return <CardBase className={cn("rounded-2xl bg-card/90 px-5 py-4 backdrop-blur-sm sm:px-6", className)} {...props} />;
}
