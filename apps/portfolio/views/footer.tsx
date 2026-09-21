import PageSection from '@/components/page/page-section';
import SectionContainer from '@/components/shared/section-container';
import { PageSectionVariant } from '@/types/page';
import type { Dictionary } from '@/types/dictionary';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';

interface FooterProps {
  dictionary: Dictionary
}

export default function Footer({ dictionary }: FooterProps) {
  const $t = dictionary;
  const currentYear = new Date().getFullYear();
  const linkClassName = "rounded-sm underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

  return (
    <PageSection id="footer" variant={PageSectionVariant.Footer}>
      <SectionContainer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-left sm:gap-x-8 lg:py-3">
        <p className="flex min-w-0 flex-wrap items-baseline justify-start gap-x-3 gap-y-1">
          <Typography as="span" variant="heading">{$t.home.typeHeadingEnd}</Typography>
          <Typography as="span" variant="caption">&copy; {currentYear}</Typography>
        </p>
        <div className="flex min-w-0 flex-col items-end gap-x-4 gap-y-1 text-right sm:flex-row sm:flex-wrap sm:items-center sm:text-left">
          <Typography variant="caption">
            {$t.footer.captcha.label}{' '}
            <a href={$t.footer.captcha.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {$t.footer.captcha.captcha}
            </a>
          </Typography>
          <Link href="/studio" className={`${linkClassName} sm:border-l sm:border-border sm:pl-4`}>
            <Typography as="span" variant="caption">{$t.footer.studio}</Typography>
          </Link>
        </div>
      </SectionContainer>
    </PageSection>
  );
}
