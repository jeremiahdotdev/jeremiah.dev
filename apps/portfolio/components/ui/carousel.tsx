"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Typography } from "./typography"
import { useDictionary } from "@/components/content/content-provider"
import { formatTemplate } from "@/lib/format-template"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function getCarouselNavigationState(api: CarouselApi) {
  return {
    selectedIndex: api?.selectedScrollSnap() ?? 0,
    snapCount: api?.scrollSnapList().length ?? 0,
  }
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { carousel: labels } = useDictionary()
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useEffectEvent((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    })

    function scrollPrev() {
      api?.scrollPrev()
    }

    function scrollNext() {
      api?.scrollNext()
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        // Portaled previews handle their own keyboard input.
        if (!event.currentTarget.contains(event.target as Node)) return
        const target = event.target as HTMLElement
        if (target.closest("input, textarea, select, [contenteditable=true], [role=slider], [role=combobox], [role=spinbutton]")) return
        const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
        const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
        if (event.key === previousKey) {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === nextKey) {
          event.preventDefault()
          scrollNext()
        }
    }

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      const syncSelection = () => onSelect(api)
      api.on("reInit", syncSelection)
      api.on("select", syncSelection)

      const animationFrame = window.requestAnimationFrame(syncSelection)

      return () => {
        window.cancelAnimationFrame(animationFrame)
        api.off("reInit", syncSelection)
        api.off("select", syncSelection)
      }
    }, [api])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription={labels.label}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    viewportClassName?: string
    fadeEdges?: boolean
  }
>(({ className, viewportClassName, fadeEdges = true, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    // Horizontal slides clip at the page section or dialog edge, beyond content gutters.
    <div ref={carouselRef} className={cn("relative px-4", orientation === "vertical" && "overflow-hidden", viewportClassName)}>
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
      {fadeEdges && orientation === "horizontal" && (
        <>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background-secondary to-transparent" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background-secondary to-transparent" />
        </>
      )}
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()
  const { carousel: labels } = useDictionary()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription={labels.item}
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

function CarouselNavigation({
  className,
  itemLabel,
  itemNames,
}: {
  className?: string
  itemLabel?: string
  itemNames?: string[]
}) {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()
  const { carousel: labels } = useDictionary()
  const item = itemLabel ?? labels.item
  const [state, setState] = React.useState({ selectedIndex: 0, snapCount: 0 })
  const updateState = React.useEffectEvent(() => {
    setState(getCarouselNavigationState(api))
  })

  React.useEffect(() => {
    if (!api) return
    const sync = () => updateState()
    api.on("reInit", sync)
    api.on("select", sync)
    const frame = window.requestAnimationFrame(sync)
    return () => {
      window.cancelAnimationFrame(frame)
      api.off("reInit", sync)
      api.off("select", sync)
    }
  }, [api])

  if (state.snapCount <= 1) return null

  const buttonClass = "flex min-h-11 items-center gap-4 rounded-sm hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default disabled:opacity-30"

  return (
    <div className={cn("flex w-full items-center justify-between gap-3 text-foreground", className)}>
      <button type="button" onClick={scrollPrev} disabled={!canScrollPrev} aria-label={formatTemplate(labels.previousAria, { item })} className={buttonClass}>
        <ArrowLeft aria-hidden="true" className="size-6" strokeWidth={1.5} />
        <span className="hidden sm:inline"><Typography as="span" variant="detail-label">{labels.previous}</Typography></span>
      </button>
      <div className="flex w-1/2 max-w-md items-center justify-center gap-1 sm:gap-2">
        {Array.from({ length: state.snapCount }, (_, index) => (
          <button key={index} type="button" aria-label={formatTemplate(labels.showAria, { item: itemNames?.[index] ?? formatTemplate(labels.numberedItem, { item, index: index + 1 }) })} aria-current={index === state.selectedIndex} onClick={() => api?.scrollTo(index)} className="group flex h-11 min-w-0 flex-1 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <span className={cn("h-0.5 w-full bg-foreground/30 transition-colors group-hover:bg-foreground/70", index === state.selectedIndex && "bg-foreground")} />
          </button>
        ))}
      </div>
      <button type="button" onClick={scrollNext} disabled={!canScrollNext} aria-label={formatTemplate(labels.nextAria, { item })} className={buttonClass}>
        <span className="hidden sm:inline"><Typography as="span" variant="detail-label">{labels.next}</Typography></span>
        <ArrowRight aria-hidden="true" className="size-6" strokeWidth={1.5} />
      </button>
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
}
