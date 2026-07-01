import DeferredContactSection from "@/components/contact/deferred-contact-section";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import PageSectionHeader from "@/components/page/page-section-header";
import PageSectionContent from "@/components/page/page-section-content";
import type { Dictionary } from "@/types/dictionary";

interface ContactProps {
  dictionary: Dictionary
}

export default function Contact({ dictionary }: ContactProps) {
  const $t = dictionary;

  return (
    <PageSection id={$t.contact.id} variant={PageSectionVariant.Primary} showBorder={true} rotate={true}>
      <PageSectionHeader>{$t.contact.heading}</PageSectionHeader>
      <PageSectionContent>
        <DeferredContactSection />
      </PageSectionContent>
    </PageSection>
  );
}
