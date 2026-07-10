import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 animate-shimmer bg-[length:100%_100%]", className)}
      {...props}
    />
  )
}

export { Skeleton }
