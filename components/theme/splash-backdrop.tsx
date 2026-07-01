"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import styles from "./splash-backdrop.module.css"

export default function SplashBackdrop() {
  const [lightLoaded, setLightLoaded] = useState(false)
  const [darkLoaded, setDarkLoaded] = useState(false)

  const dir = "/flat"
  const darkSrc = "/splash-dark.png"
  const lightSrc = "/splash-light.png"

  const Placeholder = useMemo(() => (
    <div className={styles.placeholder} />
  ), [])

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <div className={styles.layer} data-theme="light">
        {!lightLoaded && Placeholder}
        <Image
          className={`${styles.asset} ${styles.image} ${lightLoaded ? styles.imageLoaded : ""}`}
          src={`${dir}${lightSrc}`}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          onLoad={() => setLightLoaded(true)}
        />
      </div>
      <div className={styles.layer} data-theme="dark">
        {!darkLoaded && Placeholder}
        <Image
          className={`${styles.asset} ${styles.image} ${darkLoaded ? styles.imageLoaded : ""}`}
          src={`${dir}${darkSrc}`}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          onLoad={() => setDarkLoaded(true)}
        />
      </div>
    </div>
  )
}
