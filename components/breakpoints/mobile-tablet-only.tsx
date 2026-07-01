import type { ReactNode } from "react"

interface MobileTabletOnlyProps {
  children: ReactNode
}

export default function MobileTabletOnly({ children }: MobileTabletOnlyProps) {
  return <div className="lg:hidden">{children}</div>
}
