import type { ReactNode } from "react"

interface MobileOnlyProps {
  children: ReactNode
}

export default function MobileOnly({ children }: MobileOnlyProps) {
  return <div className="md:hidden">{children}</div>
}
