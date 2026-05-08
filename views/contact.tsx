"use client"
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionHeader from "@/components/page/page-section-header";
import { getDictionary } from '@/dictionaries';
import PageSectionContent from "@/components/page/page-section-content";
import { ContactForm } from "@/components/contact/contact-form";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Contact() {
  const $t = getDictionary();

  return (
    <PageSection id={$t.contact.id} variant={PageSectionVariant.Primary} showBorder={true}>
      <PageSectionHeader>{$t.contact.heading}</PageSectionHeader>
      <PageSectionContent>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
          useEnterprise={true}
          scriptProps={{
            async: false, // optional, default to false,
            defer: false, // optional, default to false
            appendTo: 'head', // optional, default to "head", can be "head" or "body",
            nonce: undefined // optional, default undefined
          }}
        >
          <ContactForm />
        </GoogleReCaptchaProvider>
      </PageSectionContent>
    </PageSection>
  );
}
