import type { ReactNode } from "react"

interface MobileTabletOnlyProps {
  children: ReactNode
}

export default function MobileTabletOnly({ children }: MobileTabletOnlyProps) {
  return <div className="relative lg:hidden">{children}</div>
}
