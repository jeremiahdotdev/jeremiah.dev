import type { ReactNode } from "react"

interface DesktopOnlyProps {
  children: ReactNode
}

export default function DesktopOnly({ children }: DesktopOnlyProps) {
  return <div className="hidden lg:block">{children}</div>
}
