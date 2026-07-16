"use client"

import { Focus as FocusType } from "@/types/focus"
import { FC, memo, useMemo } from "react"
import Focus from "./focus"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel"

interface FocusListProps {
    focuses: FocusType[]
    gpaLabel: string
}

const FocusList: FC<FocusListProps> = ({ focuses, gpaLabel }: FocusListProps) => {
    const component = useMemo(() => (
        <>
            <div className="lg:hidden">
                <Carousel
                    opts={{
                        align: "center",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="items-stretch px-4">
                        {focuses.map((focus) => (
                            <CarouselItem key={`${focus.type}-${focus.name}`} className="flex basis-full justify-center">
                                <Focus focus={focus} gpaLabel={gpaLabel}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots label="Show academic focus" />
                </Carousel>
            </div>
            <div className="hidden gap-4 lg:grid lg:grid-cols-3 px-8">
                {focuses.map((focus) => (
                    <Focus key={`${focus.type}-${focus.name}`} focus={focus} gpaLabel={gpaLabel}/>
                ))}
            </div>
        </>
        ), [focuses, gpaLabel])

    return component
}

export default memo(FocusList)
