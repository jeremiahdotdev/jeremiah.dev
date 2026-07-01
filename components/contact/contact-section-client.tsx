"use client"

import { ContactForm } from "@/components/contact/contact-form";
import RecaptchaProvider from "@/components/contact/recaptcha-provider";

export default function ContactSectionClient() {
  return (
    <RecaptchaProvider>
      <ContactForm />
    </RecaptchaProvider>
  )
}
