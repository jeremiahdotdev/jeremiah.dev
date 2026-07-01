"use client"

import dynamic from "next/dynamic";

const ContactSectionClient = dynamic(() => import("@/components/contact/contact-section-client"), {
  ssr: false,
  loading: () => (
    <div className="mx-4 h-80 w-full max-w-screen-sm rounded-md border border-border bg-card/60" />
  ),
})

export default function DeferredContactSection() {
  return <ContactSectionClient />
}
