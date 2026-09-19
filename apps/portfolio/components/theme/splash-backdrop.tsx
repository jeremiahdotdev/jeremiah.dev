"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function SplashBackdrop() {
  const [lightLoaded, setLightLoaded] = useState(false)
  const [darkLoaded, setDarkLoaded] = useState(false)
  const dir = "/flat"
  const darkSrc = "/splash-dark.webp"
  const lightSrc = "/splash-light.webp"
  const lightBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI5Ij48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgcng9IjEiIGZpbGw9IiNkMWQyZDUiLz48L3N2Zz4="
  const darkBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI5Ij48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgcng9IjEiIGZpbGw9IiMyMjIyMjQiLz48L3N2Zz4="

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 overflow-hidden opacity-[var(--page-section-splash-light-opacity)] transition-opacity duration-600 ease-out" data-theme="light">
        <Image
          className={cn("object-cover object-center opacity-0 transition-opacity duration-600 ease-out", lightLoaded && "opacity-100")}
          src={`${dir}${lightSrc}`}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={lightBlurDataURL}
          onLoad={() => setLightLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 z-10 overflow-hidden opacity-[var(--page-section-splash-dark-opacity)] transition-opacity duration-600 ease-out" data-theme="dark">
        <Image
          className={cn("object-cover object-center opacity-0 transition-opacity duration-600 ease-out", darkLoaded && "opacity-100")}
          src={`${dir}${darkSrc}`}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={darkBlurDataURL}
          onLoad={() => setDarkLoaded(true)}
        />
      </div>
    </div>
  )
}
