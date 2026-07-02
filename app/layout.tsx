import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/components/projects/theme.css";
import SplashBackdrop from "@/components/theme/splash-backdrop";
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ContentProvider } from "@/components/content/content-provider";
import { getCachedSiteSettings } from "@/sanity/lib/getCachedSiteSettings";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();

  return {
    title: settings.title,
    description: settings.description,
    icons: '/favicon.svg'
  };
}
 
export default async function RootLayout({ children }:  Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSiteSettings();

  return (
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <SplashBackdrop />
            <div className="relative z-10">
              <ContentProvider dictionary={settings.dictionary}>
                {children}
              </ContentProvider>
            </div>
          </ThemeProvider>
        </body>
      </html>
  )
}
