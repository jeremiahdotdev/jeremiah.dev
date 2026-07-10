import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DesktopOnlyProps {
  children: ReactNode
  className?: string
}

export default function DesktopOnly({ children, className }: DesktopOnlyProps) {
  return <div className={twMerge(className, "hidden lg:block")}>{children}</div>
}
