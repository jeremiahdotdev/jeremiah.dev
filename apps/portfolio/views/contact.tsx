import ContactSectionClient from "@/components/contact/contact-section-client";
import PageSection from "@/components/page/page-section";
import { PageSectionVariant } from '@/types/page';
import SectionContainer from "@/components/shared/section-container";
import type { Dictionary } from "@/types/dictionary";

interface ContactProps {
  dictionary: Dictionary
}

export default function Contact({ dictionary }: ContactProps) {
  const $t = dictionary;

  return (
    <PageSection id={$t.contact.id} variant={PageSectionVariant.Primary} fitViewport={false} className="min-h-dvh lg:pb-0">
      <SectionContainer className="flex flex-1 items-center justify-center py-20 lg:py-20">
        <ContactSectionClient />
      </SectionContainer>
    </PageSection>
  );
}
