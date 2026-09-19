import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function SectionContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-section px-4 pb-6 pt-3 sm:px-6 lg:px-8 lg:pt-4", className)} {...props} />;
}
