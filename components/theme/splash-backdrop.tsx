"use client"

import Image from "next/image"
import { useState } from "react"
import styles from "./splash-backdrop.module.css"

export default function SplashBackdrop() {
  const [lightLoaded, setLightLoaded] = useState(false)
  const [darkLoaded, setDarkLoaded] = useState(false)
  const dir = "/flat"
  const darkSrc = "/splash-dark.png"
  const lightSrc = "/splash-light.png"
  const lightBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI5Ij48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgcng9IjEiIGZpbGw9IiNkMWQyZDUiLz48L3N2Zz4="
  const darkBlurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI5Ij48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iOSIgcng9IjEiIGZpbGw9IiMyMjIyMjQiLz48L3N2Zz4="

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <div className={styles.layer} data-theme="light">
        <Image
          className={`${styles.asset} ${styles.image} ${lightLoaded ? styles.imageLoaded : ""}`}
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
      <div className={styles.layer} data-theme="dark">
        <Image
          className={`${styles.asset} ${styles.image} ${darkLoaded ? styles.imageLoaded : ""}`}
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
