"use client"

import Image from "next/image"
import { useState } from "react"
import styles from "./splash-backdrop.module.css"

export default function SplashBackdrop() {
  const [lightLoaded, setLightLoaded] = useState(false)
  const [darkLoaded, setDarkLoaded] = useState(false)

  const dir = "/flat"
  const darkSrc = "/splash-dark-mud"
  const lightSrc = "/splash-light"
  const mainExt = ".png"
  const loadingExt = ".svg"

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <div className={styles.layer} data-theme="light">
        <img className={`${styles.asset} ${styles.svg}`} src={`${dir}${lightSrc}${loadingExt}`} alt="" />
        <Image
          className={`${styles.asset} ${styles.image} ${lightLoaded ? styles.imageLoaded : ""}`}
          src={`${dir}${lightSrc}${mainExt}`}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          onLoad={() => setLightLoaded(true)}
        />
      </div>

      <div className={styles.layer} data-theme="dark">
        <img className={`${styles.asset} ${styles.svg}`} src={`${dir}${darkSrc}${loadingExt}`} alt="" />
        <Image
          className={`${styles.asset} ${styles.image} ${darkLoaded ? styles.imageLoaded : ""}`}
          src={`${dir}${darkSrc}${mainExt}`}
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
