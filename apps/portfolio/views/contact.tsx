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
    <PageSection id={$t.contact.id} variant={PageSectionVariant.Primary}>
      <SectionContainer className="flex flex-1 items-center py-6 lg:py-6">
        <ContactSectionClient />
      </SectionContainer>
    </PageSection>
  );
}
