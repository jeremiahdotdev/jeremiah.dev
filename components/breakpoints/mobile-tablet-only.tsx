import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface MobileTabletOnlyProps {
  children: ReactNode
  className?: string
}

export default function MobileTabletOnly({ children, className }: MobileTabletOnlyProps) {
  return <div className={twMerge(className, "relative lg:hidden")}>{children}</div>
}
