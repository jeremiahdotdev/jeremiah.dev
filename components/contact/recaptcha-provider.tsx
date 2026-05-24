"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

type RecaptchaProviderProps = {
  children: ReactNode;
};

export default function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;

    const trigger = triggerRef.current;
    if (!trigger) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={triggerRef} className="w-full flex justify-center">
      {shouldLoad ? (
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
          useEnterprise={true}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: "head",
          }}
        >
          {children}
        </GoogleReCaptchaProvider>
      ) : null}
    </div>
  );
}
