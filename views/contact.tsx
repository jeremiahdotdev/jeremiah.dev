"use client"
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionHeader from "@/components/page/page-section-header";
import { getDictionary } from '@/dictionaries';
import PageSectionContent from "@/components/page/page-section-content";
import { ContactForm } from "@/components/contact/contact-form";
import RecaptchaProvider from "@/components/contact/recaptcha-provider";

export default function Contact() {
  const $t = getDictionary();

  return (
    <PageSection id={$t.contact.id} variant={PageSectionVariant.Primary} showBorder={true} rotate={true}>
      <PageSectionHeader>{$t.contact.heading}</PageSectionHeader>
      <PageSectionContent>
        <RecaptchaProvider>
          <ContactForm />
        </RecaptchaProvider>
      </PageSectionContent>
    </PageSection>
  );
}
