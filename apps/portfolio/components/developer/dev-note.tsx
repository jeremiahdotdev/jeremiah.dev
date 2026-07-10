"use client"
import { FC, ReactNode, memo, useMemo } from "react"
import DevOnly from "./dev-only"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Sparkles } from "lucide-react"

interface DevNote {
    note: ReactNode | ReactNode[]
    children: ReactNode | ReactNode[]
}

const DevNote: FC<DevNote> = ({note, children}: DevNote) => {
    const devNote = useMemo(() => (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="relative p-8">
                <DevOnly>
                    <Popover>
                        <PopoverTrigger className="absolute top-0 right-0">
                            <Sparkles className="h-[1.4rem] w-[1.4rem] rounded-full border border-border p-1"/>
                        </PopoverTrigger>
                        <PopoverContent side="top">{note}</PopoverContent>
                    </Popover>
                </DevOnly>
                {children}
            </div>
        </div>
    ), [children, note])

    return devNote
}

export default memo(DevNote)
