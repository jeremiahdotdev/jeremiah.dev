import PageSection from '@/components/page/page-section';
import { TypographyMuted } from '@/components/ui/typography';
import { getSiteDictionary } from '@/sanity/lib/getSiteSettings';
import { PageSectionVariant } from '@/types/page';

export default async function Footer() {
  const $t = await getSiteDictionary();
  const currentYear = new Date().getFullYear();

  return (
    <PageSection id="footer" variant={PageSectionVariant.Footer}>
      <div className='p-2 flex flex-wrap gap-1 items-center justify-between w-full'>
        <TypographyMuted variant="footer">
          &copy; {currentYear} {$t.footer.copyright}
        </TypographyMuted>
        <TypographyMuted variant="footer">
          {$t.footer.captcha.label} <a href={$t.footer.captcha.url} target="_blank" rel="noopener noreferrer" className='underline'>{$t.footer.captcha.captcha}</a>
        </TypographyMuted>
      </div>
    </PageSection>
  );
}
