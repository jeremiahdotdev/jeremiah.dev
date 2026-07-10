import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import PageSection from '@/components/page/page-section'
import PageSectionContent from '@/components/page/page-section-content'
import PageSectionHeader from '@/components/page/page-section-header'
import { client } from '@/sanity/client'
import { hasSanityConfig } from '@/sanity/env'
import { blogPostBySlugQuery, blogPostsQuery } from '@/sanity/queries'
import { PageSectionVariant } from '@/types/page'
import type { PortableTextValue } from '@/sanity/lib/portableText'

type BlogPost = {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  body?: PortableTextValue
}

type BlogParams = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  if (!hasSanityConfig) return []

  try {
    const posts = await client.fetch<Array<{slug: string}>>(blogPostsQuery)
    return posts.map((post) => ({slug: post.slug}))
  } catch {
    return []
  }
}

export default async function BlogPostPage({params}: BlogParams) {
  if (!hasSanityConfig) notFound()

  const {slug} = await params
  const post = await client.fetch<BlogPost | null>(
    blogPostBySlugQuery,
    {slug},
    {next: {revalidate: 60}},
  )

  if (!post) notFound()

  return (
    <PageSection id="blog-post" variant={PageSectionVariant.Primary} showBorder={true}>
      <PageSectionHeader>{post.title}</PageSectionHeader>
      <PageSectionContent>
        <article className="mx-auto w-full max-w-3xl px-4 py-8 text-sm leading-7 text-muted-foreground md:px-8 md:py-10 [&_a]:text-foreground [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p+_p]:mt-4">
          {post.body && <PortableText value={post.body} />}
        </article>
      </PageSectionContent>
    </PageSection>
  )
}
