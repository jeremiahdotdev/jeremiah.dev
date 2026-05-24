import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ContentProvider } from "@/components/content/content-provider";
import { getSiteSettings } from "@/sanity/lib/getSiteSettings";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.title,
    description: settings.description,
    icons: '/favicon.svg'
  };
}
 
export default async function RootLayout({ children }:  Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ContentProvider dictionary={settings.dictionary}>
              {children}
            </ContentProvider>
          </ThemeProvider>
        </body>
      </html>
  )
}
